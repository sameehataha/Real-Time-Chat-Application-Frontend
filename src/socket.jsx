import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { server } from "./constants/config";

const SocketContext = createContext();

const getSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    console.log("🔌 Initializing Socket.IO connection...");
    console.log("Server URL:", server);
    console.log("Environment:", process.env.NODE_ENV);

const token = localStorage.getItem("talkie-token");

const newSocket = io(server, {
  withCredentials: true,
  auth: { token },    
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  transports: ["websocket", "polling"],
});
    newSocket.on("connect", () => {
      console.log(" Socket connected!");
      console.log("Socket ID:", newSocket.id);
      setSocket(newSocket);
    });

    newSocket.on("connect_error", (error) => {
      console.error(" Socket connection error:", error);
      console.error("Error message:", error.message);
      if (error.data) {
        console.error("Error data:", error.data);
      }
    });

    newSocket.on("error", (error) => {
      console.error(" Socket error:", error);
    });

    newSocket.on("disconnect", (reason) => {
      console.log(" Socket disconnected:", reason);
    });

    newSocket.on("reconnect_attempt", () => {
      console.log("Attempting to reconnect...");
    });

    newSocket.on("reconnect", () => {
      console.log(" Socket reconnected!");
    });

    // Set socket immediately (even if not connected yet)
    setSocket(newSocket);
    console.log(" Socket instance created, waiting for connection...");

    // Cleanup on unmount
    return () => {
      console.log(" Cleaning up socket...");
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider, getSocket };
