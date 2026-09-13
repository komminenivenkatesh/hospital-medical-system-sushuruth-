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
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST'],
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
     * Event 6: disconnect
     * Logs socket disconnection.
     */
    socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${socket.id} (Reason: ${reason})`);
    });
  });

  return io;
};

module.exports = initializeSocket;
module.exports.initializeSocket = initializeSocket;
