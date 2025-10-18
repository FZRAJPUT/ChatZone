// src/context/socketContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:4002");

const SocketContext = createContext();
export const SocketProvider = ({ children }) => {

 
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
