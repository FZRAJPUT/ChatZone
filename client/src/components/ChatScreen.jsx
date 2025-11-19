import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { SendHorizonal } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";


const ChatScreen = ({ friendId }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const scrollRef = useRef();

  useEffect(() => {
    if (friendId) loadMessages();
  }, [friendId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/messages/${friendId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(res.data.messages);
    } catch (err) {
      toast.error(err.message)
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/send-message`,
        { receiverId: friendId, message: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setText("");
      loadMessages();
    } catch (err) {
      console.log(err);
    }
  };

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // If no friend is selected, show welcome message
  if (!friendId) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-xl shadow-md p-4 text-center">
        <h2 className="text-2xl font-bold text-indigo-600 mb-2">
          Welcome to ChatZone
        </h2>
      <Toaster position="top-center" />
        <p className="text-gray-500">
          Select a friend from your list to start chatting in real-time.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[95%] bg-gray-50 rounded-xl shadow-md p-4">
      {/* Chat messages */}
      <Toaster position="top-center" />
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            ref={scrollRef}
            className={`flex mb-2 ${
              msg.sender === friendId ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-xl break-words ${
                msg.sender === friendId
                  ? "bg-gray-200 text-gray-800"
                  : "bg-indigo-500 text-white"
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>

      {/* Input box */}
      <div className="flex gap-2 mb-1">
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-[90%] px-4 rounded-full border border-gray-300 focus:outline-none focus:border-1 focus:border-indigo-700"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-3 py-3 flex items-center justify-center text-white rounded-full bg-indigo-700 transition-colors"
        >
          <SendHorizonal size={25} className="text-white font-light" />
        </button>
      </div>
    </div>
  );
};

export default ChatScreen;
