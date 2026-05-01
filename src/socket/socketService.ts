import { socket } from "./socket";

export const connectSocket = () => {
  socket.connect();
};
export const disconnectSocket = () => {
  socket.disconnect();
};
