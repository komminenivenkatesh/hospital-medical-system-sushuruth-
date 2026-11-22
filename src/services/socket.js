import { io } from 'socket.io-client';

let socket = null;

/**
 * Initialize Socket.io connection.
 * Vite proxy handles /socket.io -> backend automatically.
 */
export const connectSocket = () => {
  if (socket?.connected) return socket;

  socket = io('/', {
    transports: ['polling', 'websocket'],
    autoConnect: true,
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.warn('[Socket] Connection error:', err.message);
  });

  return socket;
};

/**
 * Get the existing socket instance (or create one).
 */
export const getSocket = () => {
  if (!socket) return connectSocket();
  return socket;
};

/**
 * Disconnect the socket.
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// ---- Chat helpers ----
export const joinRoom = (conversationId) => {
  getSocket().emit('join_room', { conversationId });
};

export const sendSocketMessage = ({ conversationId, sender, senderType, content }) => {
  getSocket().emit('send_message', { conversationId, sender, senderType, content });
};

export const emitTyping = (conversationId, userId) => {
  getSocket().emit('typing', { conversationId, userId });
};

export const emitStopTyping = (conversationId, userId) => {
  getSocket().emit('stop_typing', { conversationId, userId });
};

export const emitDoctorStatusChange = (doctorId, status) => {
  getSocket().emit('doctor_status_change', { doctorId, status });
};

// ---- Event listeners ----
export const onReceiveMessage = (callback) => {
  getSocket().on('receive_message', callback);
  return () => getSocket().off('receive_message', callback);
};

export const onConversationUpdated = (callback) => {
  getSocket().on('conversation_updated', callback);
  return () => getSocket().off('conversation_updated', callback);
};

export const onUserTyping = (callback) => {
  getSocket().on('user_typing', callback);
  return () => getSocket().off('user_typing', callback);
};

export const onUserStopTyping = (callback) => {
  getSocket().on('user_stop_typing', callback);
  return () => getSocket().off('user_stop_typing', callback);
};

export const onDoctorStatusUpdated = (callback) => {
  getSocket().on('doctor_status_updated', callback);
  return () => getSocket().off('doctor_status_updated', callback);
};

// ---- WebRTC Video Consultation Helpers ----
export const joinVideoRoom = (roomId, user) => {
  getSocket().emit('video_join_room', { roomId, user });
};

export const sendWebRtcOffer = ({ roomId, sdp, callerInfo }) => {
  getSocket().emit('webrtc_offer', { roomId, sdp, callerInfo });
};

export const sendWebRtcAnswer = ({ roomId, sdp }) => {
  getSocket().emit('webrtc_answer', { roomId, sdp });
};

export const sendIceCandidate = ({ roomId, candidate }) => {
  getSocket().emit('webrtc_ice_candidate', { roomId, candidate });
};

export const sendMediaState = ({ roomId, mic, cam, screen }) => {
  getSocket().emit('media_state_change', { roomId, mic, cam, screen });
};

export const sendVideoChatMessage = ({ roomId, sender, senderType, content }) => {
  getSocket().emit('video_chat_message', { roomId, sender, senderType, content, timestamp: new Date().toISOString() });
};

export const emitEndVideoCall = ({ roomId, reason, prescriptionId }) => {
  getSocket().emit('end_video_call', { roomId, reason, prescriptionId });
};

// ---- Video Event Listeners ----
export const onVideoRoomJoined = (callback) => {
  getSocket().on('video_room_joined', callback);
  return () => getSocket().off('video_room_joined', callback);
};

export const onUserJoinedVideo = (callback) => {
  getSocket().on('user_joined_video', callback);
  return () => getSocket().off('user_joined_video', callback);
};

export const onWebRtcOffer = (callback) => {
  getSocket().on('webrtc_offer', callback);
  return () => getSocket().off('webrtc_offer', callback);
};

export const onWebRtcAnswer = (callback) => {
  getSocket().on('webrtc_answer', callback);
  return () => getSocket().off('webrtc_answer', callback);
};

export const onIceCandidate = (callback) => {
  getSocket().on('webrtc_ice_candidate', callback);
  return () => getSocket().off('webrtc_ice_candidate', callback);
};

export const onPeerMediaStateChanged = (callback) => {
  getSocket().on('peer_media_state_changed', callback);
  return () => getSocket().off('peer_media_state_changed', callback);
};

export const onVideoChatMessage = (callback) => {
  getSocket().on('video_chat_message', callback);
  return () => getSocket().off('video_chat_message', callback);
};

export const onVideoCallEnded = (callback) => {
  getSocket().on('video_call_ended', callback);
  return () => getSocket().off('video_call_ended', callback);
};

export const onPeerLeftVideo = (callback) => {
  getSocket().on('peer_left_video', callback);
  return () => getSocket().off('peer_left_video', callback);
};
