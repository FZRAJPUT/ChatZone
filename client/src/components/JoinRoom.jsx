import { useState } from "react";
import Chat from "../pages/Chat";
import io from "socket.io-client";

const socket = io("http://localhost:4002");

const JoinRoom = () => {
  const [room, setRoom] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  
  const userData = JSON.parse(localStorage.getItem("user"))
  
  const joinChat = () => {
    let userName = userData.username
    if (userName && room) {
      socket.emit("joinroom", room);
      setIsJoined(true);
    }
  };


  return (
    <div className="flex items-center justify-center h-[100dvh] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      {!isJoined ? (
        <div className="bg-white max-w-[90%] w-[400px] p-8 rounded-2xl shadow-2xl">
          <h1 className="text-2xl font-bold mb-6 text-center">🚀 Join Chat Room</h1>
          <h1>{userData.username?.toUpperCase()}</h1>
          <input
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            type="text"
            placeholder="Enter Room ID"
            className="w-full p-3 mb-6 border rounded-lg"
          />
          <button
            onClick={joinChat}
            className="w-full py-3 rounded-lg bg-indigo-600 text-white"
          >
            Join Now
          </button>
        </div>
      ) : (
        <Chat socket={socket} userName={userData.username} room={room} />
      )}
    </div>
  );
};

export default JoinRoom;
