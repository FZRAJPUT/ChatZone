import React, { useState, useEffect, useRef } from "react";

const Chat = ({ socket, room, userName }) => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (message !== "") {
      const messageData = {
        id: Math.random(),
        room,
        author: userName,
        message,
        time:
          new Date().getHours() % 24 +
          ":" +
          new Date().getMinutes().toString().padStart(2, "0"),
      };

      await socket.emit("sendMessage", messageData);
      setMessageList((list) => [...list, messageData]);
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("recieveMSG", (data) => {
      setMessageList((list) => [...list, data]);
    });

    return () => {
      socket.off("recieveMSG");
    };
  }, [socket]);

  // Auto scroll whenever new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  return (
    <div className="flex flex-col w-[600px] max-w-[90%] h-[600px] bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 flex justify-between items-center">
        <h2 className="font-bold text-lg">💬 Room: {room}</h2>
        <span className="text-sm opacity-80 font-semibold">User: {userName?.toUpperCase()}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messageList.map((el, ind) => {
          const isYou = userName === el.author;
          return (
            <div
              key={ind}
              className={`flex mb-3 ${
                isYou ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-xl shadow-sm ${
                  isYou
                    ? "bg-indigo-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                {!isYou && (
                  <span className="block text-xs font-semibold text-pink-600 underline mb-1">
                    {el.author}
                  </span>
                )}
                <p className="text-sm">{el.message}</p>
                <span
                  className={`block text-xs mt-1 ${
                    isYou ? "text-indigo-200" : "text-gray-500"
                  }`}
                >
                  {el.time}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} /> {/* scroll target */}
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-white flex items-center gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
        />
        <button
          onClick={sendMessage}
          className="px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 transition-all"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default Chat;
