import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Users } from "lucide-react";
import axios from "axios";
import LeftPanel from "./LeftPanel";
import UserSearch from "../../components/UserSearch";
import FriendRequests from "../../components/FriendRequests";
import ChatScreen from "../../components/ChatScreen";
import { useSocket } from "../../context/SocketContext";

const Home = () => {
  const socket = useSocket();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [requestsOpen, setRequestsOpen] = useState(false);
  const [friends, setFriends] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [selectedFriend, setSelectedFriend] = useState(null);

  // Fetch user details and friends
  const getUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setUserDetails(res.data.user);
        setFriends(res.data.user.friends || []);
        socket.emit("online", res.data.user._id);
      }
    } catch (error) {
      console.log(error.message);
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-gray-50 flex flex-col lg:flex-row">
      {/* Left Sidebar */}
      <div className="max-w-full min-w-[300px] bg-white/10 backdrop-blur-sm lg:min-h-screen">
        <LeftPanel
          username={userDetails.username}
          handleLogout={handleLogout}
          profilePic={userDetails.profilePic}
          userBio={userDetails.bio}
        />
      </div>

      {/* Middle Panel: Friends / Search / Requests */}
      <div className="flex-1 flex flex-col p-4 overflow-y-auto">
        {/* Top Buttons */}
        <div className="flex items-center justify-end gap-3 mb-4">
          <button
            onClick={() => setSearchOpen(true)}
            className="p-3 rounded-full bg-white shadow hover:bg-indigo-50 transition-all"
            title="Search Users"
          >
            <Search className="w-5 h-5 text-indigo-600" />
          </button>

          <button
            onClick={() => setRequestsOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all"
          >
            <Users className="w-5 h-5" />
            <span className="hidden sm:inline">Requests</span>
          </button>
        </div>

        {/* Greeting */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            {getGreeting()},{" "}
            <span className="text-indigo-600">{userDetails.username?.toUpperCase()}</span>
          </h1>
          <p className="text-gray-500">Welcome to Chatzone</p>
        </div>

        {/* Friends List */}
        <div className="flex-1 overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Friends List</h2>
          {friends.length > 0 ? (
            <ul className="space-y-3">
              {friends.map((friend) => (
                <li
                  key={friend._id}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={friend.profilePic || "/default-avatar.png"}
                      alt={friend.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{friend.username}</p>
                      <p className={`text-sm ${friend.isOnline ? "text-green-500" : "text-gray-400"}`}>
                        {friend.isOnline ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFriend(friend)}
                    className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                  >
                    Chat
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-400 mt-10">No friends found</p>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-400 mt-6">
          Made with ❤️ for real-time conversations
        </div>
      </div>

      {/* Chat Panel (Always Visible) */}
      <div className="w-full h-[86vh] sm:h-screen lg:w-[50%] bg-gray-50 p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-3">
          {selectedFriend ? `Chat with ${selectedFriend.username.toUpperCase()}` : "Welcome to ChatZone"}
        </h2>
        <ChatScreen friendId={selectedFriend?._id} />
      </div>

      {/* UserSearch Overlay */}
      {searchOpen && (
        <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex pt-28 sm:pt-0 items-start sm:items-center justify-center">
          <div className="relative w-[90%] max-w-3xl bg-white rounded-2xl shadow-2xl p-6 animate-fadeIn">
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-lg font-bold"
            >
              ✕
            </button>
            <UserSearch />
          </div>
        </div>
      )}

      {/* FriendRequests Overlay */}
      {requestsOpen && (
        <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="relative w-[90%] max-w-3xl bg-white rounded-2xl shadow-2xl p-6 animate-fadeIn">
            <button
              onClick={() => setRequestsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-lg font-bold"
            >
              ✕
            </button>
            <FriendRequests />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
