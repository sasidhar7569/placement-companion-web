import { io } from 'socket.io-client';
import { API_BASE_URL, syncPendingChanges } from '../assets/api';

let socket = null;
const listeners = new Map();

const getSocketUrl = () => {
  return API_BASE_URL;
};

export const getSocket = () => socket;

export const connectSocket = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    disconnectSocket();
    return null;
  }

  if (socket && socket.connected) {
    return socket;
  }

  if (socket) {
    socket.disconnect();
  }

  const socketUrl = getSocketUrl();
  console.log(`Connecting to Socket.IO server at: ${socketUrl}`);

  socket = io(socketUrl, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000
  });

  socket.on('connect', () => {
    console.log('Socket.IO connected successfully');
    syncPendingChanges().catch(err => console.error('Error running offline sync on connect:', err));
    listeners.forEach((callbacks, event) => {
      callbacks.forEach(cb => {
        socket.on(event, cb);
      });
    });
  });

  socket.on('disconnect', (reason) => {
    console.log(`Socket.IO disconnected: ${reason}`);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket.IO connection error:', error.message);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket.IO disconnected and cleared');
  }
};

export const subscribeToEvent = (event, callback) => {
  if (!listeners.has(event)) {
    listeners.set(event, new Set());
  }
  listeners.get(event).add(callback);

  if (socket) {
    socket.on(event, callback);
  }

  return () => {
    const callbacks = listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        listeners.delete(event);
      }
    }
    if (socket) {
      socket.off(event, callback);
    }
  };
};

export const subscribe = subscribeToEvent;
export const unsubscribe = (event, callback) => {
  if (socket) {
    socket.off(event, callback);
  }
  const callbacks = listeners.get(event);
  if (callbacks) {
    callbacks.delete(callback);
    if (callbacks.size === 0) {
      listeners.delete(event);
    }
  }
};
