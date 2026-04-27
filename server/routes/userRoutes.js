import express from "express";
import {
    acceptRequest,
    cancelRequest,
    getAllUser,
    getMe,
    login,
    register,
    rejectRequest,
    searchUsers,
    sendRequest,
    setupProfile,
    updateProfile,
    verifyOTP,
} from "../controllers/userController.js";
import verifyToken from "../utils/verifyToken.js";
import User from "../models/userModel.js";
import multer from 'multer'
import { registerLimiter, apiLimiter, loginLimiter, otpLimiter } from "../utils/rateLimit.js";

const upload = multer({ storage: multer.memoryStorage() });

const userRouter = express.Router();
userRouter.post("/register", registerLimiter, register);
userRouter.post("/login", loginLimiterr, login);
userRouter.post("/verify", otpLimiter, verifyOTP);

userRouter.get("/get-users", apiLimiter, verifyToken, getAllUser);
userRouter.get("/me", apiLimiter, verifyToken, getMe);

userRouter.get("/search", verifyToken, searchUsers);

userRouter.get("/users/search", apiLimiter, async (req, res) => {
    try {
        const { username } = req.query;
        const user = await User.findOne({ username });
        res.json({ available: !user });
    } catch (err) {
        res.status(500).json({ available: false });
    }
});

userRouter.put(
    "/update/profile",
    apiLimiter,
    verifyToken,
    upload.single("profilePic"),
    updateProfile
);

userRouter.post("/send-request", verifyToken, sendRequest);
userRouter.post("/cancel-request", verifyToken, cancelRequest);
userRouter.post("/accept-request", verifyToken, acceptRequest);
userRouter.post("/reject-request", verifyToken, rejectRequest);

userRouter.put(
    "/setup/:userId",
    apiLimiter,
    upload.single("profilePic"),
    setupProfile
);

export default userRouter;