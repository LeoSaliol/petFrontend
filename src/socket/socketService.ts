import { socket } from "./socket";
import type { AuthContextType } from "../context/AuthContext";

export const connectSocket = (userToken: number | null) => {
  if (userToken) {
    socket.auth = { userId: userToken };
  }
  socket.connect();
};
export const disconnectSocket = () => {
  socket.disconnect();
};
