import { io, Socket } from 'socket.io-client';
import { BACKEND_URL } from '@/config/api';

const SOCKET_URL = BACKEND_URL;

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socket;
};

export const connectSocket = (userId: string, role: 'user' | 'provider') => {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
    s.emit('join', { userId, role });
  }
  return s;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
