import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const FriendRequests = () => {
  const [activeTab, setActiveTab] = useState("received");
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalUser, setModalUser] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setSentRequests(res.data.user.friendRequests.sent || []);
        setReceivedRequests(res.data.user.friendRequests.received || []);
      }
    } catch (err) {
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const token = localStorage.getItem("token");

  const handleAccept = async (userId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/accept-request`,
        { requesterId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setModalUser(null);
        fetchRequests();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error accepting request");
    }
  };

  const handleReject = async (userId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/reject-request`,
        { requesterId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setModalUser(null);
        fetchRequests();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error rejecting request");
    }
  };

  const handleCancel = async (userId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/cancel-request`,
        { receiverId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        fetchRequests();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error canceling request");
    }
  };

  const renderRequests = (list, type) => {
    if (!list.length)
      return (
        <p className="text-gray-400 text-sm text-center mt-4">
          No {type} requests
        </p>
      );

    return list.map((user) => (
      <div
        key={user._id}
        className="flex items-center justify-between p-3 border rounded-xl mb-2 hover:bg-indigo-50 transition cursor-pointer"
        onClick={() => type === "received" && setModalUser(user)}
      >
        <div className="flex items-center gap-3">
          <img
            src={user.profilePic || "/default-avatar.png"}
            alt={user.username}
            className="w-12 h-12 rounded-full object-cover border"
          />
          <div>
            <p className="font-medium">{user.username}</p>
            {user.bio && (
              <p className="text-sm text-gray-500 line-clamp-1">{user.bio}</p>
            )}
          </div>
        </div>

        {type === "sent" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCancel(user._id);
            }}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        )}
      </div>
    ));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-2xl mt-6 w-[95%] sm:w-full">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600 text-center">
        Friend Requests
      </h2>

      {/* Tabs */}
      <div className="flex border-b border-gray-300 mb-4 overflow-x-auto">
        <button
          className={`flex-1 py-2 font-semibold whitespace-nowrap ${
            activeTab === "received"
              ? "border-b-2 border-indigo-600 text-indigo-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("received")}
        >
          Received
        </button>
        <button
          className={`flex-1 py-2 font-semibold whitespace-nowrap ${
            activeTab === "sent"
              ? "border-b-2 border-indigo-600 text-indigo-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("sent")}
        >
          Sent
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="max-h-[400px] overflow-y-auto">
          {activeTab === "received"
            ? renderRequests(receivedRequests, "received")
            : renderRequests(sentRequests, "sent")}
        </div>
      )}

      {/* Modal for Accept/Reject */}
      {modalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-11/12 max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {modalUser.username} sent you a friend request
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleAccept(modalUser._id)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Accept
              </button>
              <button
                onClick={() => handleReject(modalUser._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Reject
              </button>
              <button
                onClick={() => setModalUser(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendRequests;
