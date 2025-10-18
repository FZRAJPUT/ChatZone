import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserPlus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const UserSearch = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query.trim()) {
      setUsers([]);
      setError("");
      return;
    }

    const delayDebounce = setTimeout(() => {
      handleSearch(query);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSearch = async (searchText) => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/search?query=${searchText}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setUsers(res.data.users);
      } else {
        setUsers([]);
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Call API to send friend request
  const handleAddFriend = async (user) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/send-request`,
        { targetUserId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 rounded-2xl">
      <h2 className="text-2xl font-bold text-center mb-4 text-indigo-600">
       Search Users
      </h2>

      {/* Search Input */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Type username..."
          className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {loading && (
          <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-500 text-center text-sm mb-3">{error}</p>
      )}

      {/* Results */}
      <div className="max-h-[400px] overflow-y-auto space-y-3">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-4 border rounded-xl hover:bg-indigo-50 transition-all"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.profilePic || "/default-avatar.png"}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover border"
                />
                <div>
                  <p className="font-semibold text-gray-800">{user.username}</p>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {user.bio || "No bio available"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`w-3 h-3 rounded-full ${
                    user.isOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
                  title={user.isOnline ? "Online" : "Offline"}
                ></span>
                <button
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                  onClick={() => handleAddFriend(user)}
                >
                  <UserPlus className="w-4 h-4" /> Add
                </button>
              </div>
            </div>
          ))
        ) : (
          !loading &&
          !error &&
          query && (
            <p className="text-center text-gray-400 text-sm">No users found.</p>
          )
        )}
      </div>
    </div>
  );
};

export default UserSearch;
