import { createContext, useContext, useMemo } from "react";
import io from "socket.io-client";
import { server } from "./src/constants/config";

const SocketContext = createContext();
const getSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const socket = useMemo(() => io(`${server}`, { withCredentials: true }), []);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { getSocket, SocketProvider };
