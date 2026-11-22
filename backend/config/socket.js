/**
 * Socket.io Real-Time Communication Configuration for NeuroCare Backend
 * Handles real-time events for chat messaging, typing indicators, and doctor status updates.
 */

const { Server } = require('socket.io');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

/**
 * Initializes and configures Socket.io server instance on the given HTTP server.
 *
 * @param {import('http').Server} httpServer - Node HTTP server instance
 * @returns {Server} Configured Socket.io Server instance
 */
const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    /**
     * Event 1: join_room
     * Allows client socket to join a specific conversation room.
     */
    socket.on('join_room', (data) => {
      try {
        const conversationId = typeof data === 'string' ? data : data?.conversationId;
        if (!conversationId) {
          console.error(`[Socket ${socket.id}] join_room error: conversationId is required`);
          return;
        }
        socket.join(conversationId);
        console.log(`Socket ${socket.id} joined room: ${conversationId}`);
      } catch (error) {
        console.error(`[Socket ${socket.id}] Error handling join_room:`, error.message);
        socket.emit('error', { event: 'join_room', message: error.message });
      }
    });

    /**
     * Event 2: send_message
     * Creates a new Message in MongoDB, updates Conversation's lastMessage & updatedAt,
     * emits receive_message to room, and emits conversation_updated to all participants.
     */
    socket.on('send_message', async (data) => {
      try {
        const { conversationId, sender, senderType, content } = data || {};

        if (!conversationId || !sender || !senderType || !content) {
          console.error(`[Socket ${socket.id}] send_message error: Missing required fields`);
          socket.emit('error', {
            event: 'send_message',
            message: 'Missing required fields: conversationId, sender, senderType, content',
          });
          return;
        }

        // 1. Create a new Message document in MongoDB
        const newMessage = await Message.create({
          conversationId,
          sender,
          senderType,
          content,
        });

        // Populate sender metadata if available
        const populatedMessage = await Message.findById(newMessage._id).populate('sender', 'name email role');
        const savedMessage = populatedMessage || newMessage;

        // 2. Update Conversation's lastMessage and updatedAt timestamp
        const updatedConversation = await Conversation.findByIdAndUpdate(
          conversationId,
          {
            lastMessage: content,
            updatedAt: new Date(),
          },
          { new: true }
        );

        // 3. Emit receive_message with saved message to room
        io.to(conversationId).emit('receive_message', savedMessage);

        // 4. Emit conversation_updated to all participants
        io.emit('conversation_updated', {
          conversationId,
          lastMessage: content,
          updatedAt: savedMessage.updatedAt,
          conversation: updatedConversation,
        });

        console.log(`[Socket ${socket.id}] Message saved & emitted for conversation: ${conversationId}`);
      } catch (error) {
        console.error(`[Socket ${socket.id}] Error handling send_message:`, error.message);
        socket.emit('error', { event: 'send_message', message: error.message });
      }
    });

    /**
     * Event 3: typing
     * Broadcasts user_typing event to conversation room except the sender.
     */
    socket.on('typing', (data) => {
      try {
        const { conversationId, userId } = data || {};
        if (!conversationId) return;
        socket.to(conversationId).emit('user_typing', { conversationId, userId });
      } catch (error) {
        console.error(`[Socket ${socket.id}] Error handling typing:`, error.message);
      }
    });

    /**
     * Event 4: stop_typing
     * Broadcasts user_stop_typing event to conversation room except the sender.
     */
    socket.on('stop_typing', (data) => {
      try {
        const { conversationId, userId } = data || {};
        if (!conversationId) return;
        socket.to(conversationId).emit('user_stop_typing', { conversationId, userId });
      } catch (error) {
        console.error(`[Socket ${socket.id}] Error handling stop_typing:`, error.message);
      }
    });

    /**
     * Event 5: doctor_status_change
     * Broadcasts doctor_status_updated event to all connected clients via io.emit.
     */
    socket.on('doctor_status_change', (data) => {
      try {
        const { doctorId, status } = data || {};
        if (!doctorId || !status) {
          console.error(`[Socket ${socket.id}] doctor_status_change error: doctorId and status required`);
          return;
        }
        io.emit('doctor_status_updated', { doctorId, status });
        console.log(`[Socket ${socket.id}] Broadcasted doctor_status_updated for doctor ${doctorId}: ${status}`);
      } catch (error) {
        console.error(`[Socket ${socket.id}] Error handling doctor_status_change:`, error.message);
      }
    });

    /**
     * ==========================================
     * WebRTC Video Consultation Signaling Events
     * ==========================================
     */

    /**
     * video_join_room: Client joins a specific consultation video room
     */
    socket.on('video_join_room', ({ roomId, user }) => {
      try {
        if (!roomId) return;
        const roomName = `video:${roomId}`;

        // Find existing sockets in room before joining
        const existingSocketIds = Array.from(io.sockets.adapter.rooms.get(roomName) || []);
        const existingPeers = existingSocketIds
          .map((id) => io.sockets.sockets.get(id))
          .filter(Boolean)
          .map((s) => ({ socketId: s.id, user: s.data.videoUser }));

        socket.join(roomName);
        socket.data.videoRoom = roomId;
        socket.data.videoUser = user;

        const count = (io.sockets.adapter.rooms.get(roomName) || new Set()).size;

        console.log(`[Video Socket] ${socket.id} (${user?.name || 'User'}) joined room: ${roomName} (Total in room: ${count})`);

        // 1. Notify other participants in the room that a new peer joined
        socket.to(roomName).emit('user_joined_video', {
          socketId: socket.id,
          user: user || { name: 'Participant' },
          totalParticipants: count,
        });

        // 2. Acknowledge back to sender with room info AND existing peers
        socket.emit('video_room_joined', {
          roomId,
          totalParticipants: count,
          isInitiator: count === 1,
          existingPeers,
        });
      } catch (error) {
        console.error(`[Video Socket] Error on video_join_room:`, error.message);
      }
    });

    /**
     * webrtc_offer: Client sends SDP offer to peers in the consultation room
     */
    socket.on('webrtc_offer', ({ roomId, sdp, callerInfo }) => {
      try {
        if (!roomId || !sdp) return;
        console.log(`[Video Socket] webrtc_offer from ${socket.id} (${callerInfo?.name || 'User'}) for room: video:${roomId}`);
        socket.to(`video:${roomId}`).emit('webrtc_offer', {
          sdp,
          callerInfo,
          senderSocketId: socket.id,
        });
      } catch (error) {
        console.error(`[Video Socket] Error on webrtc_offer:`, error.message);
      }
    });

    /**
     * webrtc_answer: Client answers SDP offer
     */
    socket.on('webrtc_answer', ({ roomId, sdp }) => {
      try {
        if (!roomId || !sdp) return;
        console.log(`[Video Socket] webrtc_answer from ${socket.id} for room: video:${roomId}`);
        socket.to(`video:${roomId}`).emit('webrtc_answer', {
          sdp,
          senderSocketId: socket.id,
        });
      } catch (error) {
        console.error(`[Video Socket] Error on webrtc_answer:`, error.message);
      }
    });

    /**
     * webrtc_ice_candidate: Exchange ICE candidates
     */
    socket.on('webrtc_ice_candidate', ({ roomId, candidate }) => {
      try {
        if (!roomId || !candidate) return;
        socket.to(`video:${roomId}`).emit('webrtc_ice_candidate', {
          candidate,
          senderSocketId: socket.id,
        });
      } catch (error) {
        console.error(`[Video Socket] Error on webrtc_ice_candidate:`, error.message);
      }
    });

    /**
     * media_state_change: Mic or Camera toggle
     */
    socket.on('media_state_change', ({ roomId, mic, cam, screen }) => {
      try {
        if (!roomId) return;
        socket.to(`video:${roomId}`).emit('peer_media_state_changed', {
          senderSocketId: socket.id,
          mic,
          cam,
          screen,
        });
      } catch (error) {
        console.error(`[Video Socket] Error on media_state_change:`, error.message);
      }
    });

    /**
     * video_chat_message: In-call quick text messaging
     */
    socket.on('video_chat_message', ({ roomId, sender, senderType, content, timestamp }) => {
      try {
        if (!roomId || !content) return;
        io.to(`video:${roomId}`).emit('video_chat_message', {
          id: `vmsg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          sender,
          senderType,
          content,
          timestamp: timestamp || new Date().toISOString(),
        });
      } catch (error) {
        console.error(`[Video Socket] Error on video_chat_message:`, error.message);
      }
    });

    /**
     * end_video_call: Either participant ends consultation
     */
    socket.on('end_video_call', ({ roomId, reason, prescriptionId }) => {
      try {
        if (!roomId) return;
        io.to(`video:${roomId}`).emit('video_call_ended', {
          endedBy: socket.id,
          reason: reason || 'Consultation concluded',
          prescriptionId: prescriptionId || null,
        });
        console.log(`[Video Socket] Consultation in room video:${roomId} ended.`);
      } catch (error) {
        console.error(`[Video Socket] Error on end_video_call:`, error.message);
      }
    });

    /**
     * Event 6: disconnect
     * Logs socket disconnection and cleans up video room if active.
     */
    socket.on('disconnect', (reason) => {
      if (socket.data.videoRoom) {
        socket.to(`video:${socket.data.videoRoom}`).emit('peer_left_video', {
          socketId: socket.id,
          user: socket.data.videoUser,
        });
      }
      console.log(`Socket disconnected: ${socket.id} (Reason: ${reason})`);
    });
  });

  return io;
};

module.exports = initializeSocket;
module.exports.initializeSocket = initializeSocket;
