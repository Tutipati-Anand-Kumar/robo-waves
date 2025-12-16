import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const socket = io(BASE_URL, {
  autoConnect: false,
});

export const connectSocket = (userId) => {
  socket.auth = { userId }; // backend uses this
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};