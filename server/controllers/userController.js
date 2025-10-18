import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import imagekit from "../utils/imagekit.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Username, email, and password are required" });
    }

    const isExist = await User.findOne({ $or: [{ username }, { email }] });
    if (isExist) {
      return res
        .status(409)
        .json({ success: false, message: "Username or email already in use" });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashPass,
    });

    await user.save();

    return res
      .status(201)
      .json({ success: true, message: "Registration successful" });

  } catch (error) {
    console.error("Register Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Username and password are required" });
    }

    const userFound = await User.findOne({ username }).select("+password");
    if (!userFound) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: userFound._id, username: userFound.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });

  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("GetAllUser Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMe = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(req.user.id)
  .select("-password")
  .populate("friends", "username email profilePic isOnline lastSeen")
  .populate("friendRequests.sent", "username email profilePic isOnline lastSeen")
  .populate("friendRequests.received", "username email profilePic isOnline lastSeen");


    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("GetMe Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ success: false, message: "Search query required" });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("-password");

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "No users found" });
    }

    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Search Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const acceptRequest = async (req, res) => {
  try {
    const userId = req.user.id; // logged-in user
    const { requesterId } = req.body; // user who sent the request

    if (!requesterId) {
      return res.status(400).json({ success: false, message: "Requester ID is required" });
    }

    const user = await User.findById(userId);
    const requester = await User.findById(requesterId);

    if (!user || !requester) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if requester is in received requests
    if (!user.friendRequests.received.includes(requesterId)) {
      return res.status(400).json({ success: false, message: "No request from this user" });
    }

    // Remove from received & sent requests
    user.friendRequests.received = user.friendRequests.received.filter(
      (id) => id.toString() !== requesterId
    );
    requester.friendRequests.sent = requester.friendRequests.sent.filter(
      (id) => id.toString() !== userId
    );

    // Add each other as friends
    if (!user.friends.includes(requesterId)) user.friends.push(requesterId);
    if (!requester.friends.includes(userId)) requester.friends.push(userId);

    await user.save();
    await requester.save();

    return res.status(200).json({ success: true, message: "Friend request accepted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const userId = req.user.id; // logged-in user
    const { requesterId } = req.body;

    if (!requesterId) {
      return res.status(400).json({ success: false, message: "Requester ID is required" });
    }

    const user = await User.findById(userId);
    const requester = await User.findById(requesterId);

    if (!user || !requester) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Remove requester from logged-in user's received requests
    user.friendRequests.received = user.friendRequests.received.filter(
      (id) => id.toString() !== requesterId
    );

    // Remove logged-in user from requester's sent requests
    requester.friendRequests.sent = requester.friendRequests.sent.filter(
      (id) => id.toString() !== userId
    );

    await user.save();
    await requester.save();

    return res.json({ success: true, message: "Friend request rejected successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const cancelRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.id;

    if (!receiverId) {
      return res.status(400).json({ success: false, message: "Receiver ID is required" });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    sender.friendRequests.sent = sender.friendRequests.sent.filter(
      (id) => id.toString() !== receiverId
    );

    receiver.friendRequests.received = receiver.friendRequests.received.filter(
      (id) => id.toString() !== senderId
    );

    await sender.save();
    await receiver.save();

    return res.status(200).json({ success: true, message: "Friend request canceled" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, bio } = req.body;
    const file = req.file;

    const updates = {};

    if (username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({
          success: false,
          message: "Username already taken. Please choose another.",
        });
      }
      updates.username = username;
    }

    if (bio) updates.bio = bio;

    if (file) {
      const uploadedImage = await imagekit.upload({
        file: file.buffer.toString("base64"),
        fileName: file.originalname,
        folder: "/profile_pics",
      });
      updates.profilePic = uploadedImage.url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const sendRequest = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const senderId = req.user.id;

    if (senderId === targetUserId) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot send request to yourself" });
    }

    const sender = await User.findById(senderId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if request already sent
    if (sender.friendRequests.sent.includes(targetUserId)) {
      return res
        .status(400)
        .json({ success: false, message: "Request already sent" });
    }

    if (sender.friends.includes(targetUserId)) {
      return res
        .status(400)
        .json({ success: false, message: "Already friends" });
    }

    sender.friendRequests.sent.push(targetUserId);
    targetUser.friendRequests.received.push(senderId);

    await sender.save();
    await targetUser.save();

    res.status(200).json({ success: true, message: "Friend request sent" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};
