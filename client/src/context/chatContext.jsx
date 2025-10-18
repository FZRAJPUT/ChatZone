import React, { createContext, useState, useContext, useEffect } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [token,setToken] = useState("")

  useEffect(()=>{
    setToken(localStorage.getItem("token"))
  },[])

  return (
    <ChatContext.Provider value={{ token }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
