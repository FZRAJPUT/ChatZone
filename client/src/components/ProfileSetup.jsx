import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const ProfileSetup = ({ userId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    bio: "",
    profilePic: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // handle text input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle profile image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profilePic: file });
    setPreview(URL.createObjectURL(file));
  };

  // submit profile data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = location.state?.userId;
    console.log(userId)
    try {
      setLoading(true);

      const data = new FormData();
      data.append("bio", formData.bio);
      data.append("profilePic", formData.profilePic);

      const res = await axios.put(`${import.meta.env.VITE_API_URL}/setup/${userId}`, data);

      console.log(res.data)

      toast.success("Profile setup completed successfully!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Error while updating profile!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Complete Your Profile
        </h2>

        {/* Profile Pic Preview */}
        <div className="flex flex-col items-center mb-5">
          <label className="cursor-pointer">
            {preview ? (
              <img
                src={preview}
                alt="Profile preview"
                className="w-24 h-24 object-cover rounded-full border"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border flex items-center justify-center text-gray-400">
                Upload
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Bio */}
        <label className="block mb-2 font-semibold">Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Write something about yourself..."
          className="w-full border p-2 rounded-lg mb-6 focus:outline-none focus:ring focus:ring-blue-300"
          rows="3"
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default ProfileSetup;