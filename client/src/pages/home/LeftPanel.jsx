import React, { useRef, useState } from 'react';
import { LogOut, MessageCircle, Upload, Edit3, Save, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useChat } from '../../context/chatContext';
import toast, { Toaster } from "react-hot-toast";


const LeftPanel = ({ username, profilePic, userBio }) => {
  const navigate = useNavigate();
  const { token } = useChat();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(username);
  const [bio, setBio] = useState(userBio || '');
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [preview, setPreview] = useState(profilePic);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Handle profile picture change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      updateProfileImage(file);
    }
  };

  const updateProfileImage = async (file) => {
    const formData = new FormData();
    formData.append('profilePic', file);

    try {
      setLoading(true);
      await axios.put(
        `${import.meta.env.VITE_API_URL}/update/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      toast.success('Profile picture updated!');
    } catch (error) {
      toast.error('Error updating profile picture');
    } finally {
      setLoading(false);
    }
  };

  // Save username and bio
  const saveProfileChanges = async () => {
    try {
      setLoading(true);
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/update/profile`,
        { username: name, bio },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      toast.success('Profile updated successfully!');
      setEditMode(false);
    } catch (error) {
      toast.error('Error updating profile details');
    } finally {
      setLoading(false);
    }
  };

  // Confirm logout
  const confirmLogout = () => setShowLogoutModal(true);

  // Perform logout
  const performLogout = () => {
    setShowLogoutModal(false);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-full lg:h-full bg-gray-50 p-6 flex flex-col justify-center items-center text-center shadow-sm">
      <Toaster position="top-center" />
      <div className="relative group">
        <img
          src={preview || profilePic}
          alt={username}
          className="w-24 h-24 rounded-full object-cover border-4 border-indigo-200 shadow-md"
        />
        <button
          onClick={() => fileInputRef.current.click()}
          className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full text-white hover:bg-indigo-700 transition-all opacity-0 group-hover:opacity-100"
          title="Update Profile Picture"
          disabled={loading}
        >
          <Upload className="w-4 h-4" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      {/* Username */}
      <h2 className="text-xl font-semibold text-gray-800 mt-3">
        {username?.toUpperCase()}
      </h2>
      <p className="text-gray-500 text-sm mt-1">{userBio}</p>

      {/* Edit Profile */}
      {!editMode ? (
        <button
          onClick={() => setEditMode(true)}
          className="mt-4 w-full py-2 bg-indigo-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all"
        >
          <Edit3 className="w-4 h-4" /> Edit Profile
        </button>
      ) : (
        <div className="mt-4 w-full bg-white rounded-xl shadow-lg p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-700">Edit Profile</h3>
            <button
              onClick={() => setEditMode(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 mb-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800"
            placeholder="Enter username"
          />

          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3 py-2 mb-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-700"
            rows="3"
            placeholder="Write your bio..."
          ></textarea>

          <button
            onClick={saveProfileChanges}
            disabled={loading}
            className="w-full py-2 bg-purple-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-purple-700 transition-all"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {/* Buttons */}
      <div className="mt-6 w-full space-y-3">
        <button
          onClick={() => navigate("/join")}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5" /> Join a Room
        </button>

        <button
          onClick={confirmLogout}
          className="w-full py-3 rounded-xl bg-red-400 text-gray-100 font-semibold shadow-md hover:bg-red-600 transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80 text-center">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Are you sure you want to logout?
            </h3>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={performLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
              >
                Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all"
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

export default LeftPanel;
