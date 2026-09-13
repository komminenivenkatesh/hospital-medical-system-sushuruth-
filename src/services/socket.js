import { io } from 'socket.io-client';

let socket = null;

/**
 * Initialize Socket.io connection.
 * Vite proxy handles /socket.io -> backend automatically.
 */
export const connectSocket = () => {
  if (socket?.connected) return socket;

  socket = io('/', {
    transports: ['websocket', 'polling'],
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
