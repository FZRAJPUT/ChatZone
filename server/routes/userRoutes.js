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
} from "../controllers/userController.js";
import verifyToken from "../utils/verifyToken.js";
import User from "../models/userModel.js";
import multer from 'multer'

const upload = multer({ storage: multer.memoryStorage() });

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/get-users", verifyToken, getAllUser);
userRouter.get("/me", verifyToken, getMe);
userRouter.get("/search", verifyToken, searchUsers);
userRouter.get("/users/search", async (req, res) => {
    try {
        const { username } = req.query;
        const user = await User.findOne({ username });
        res.json({ available: !user });
    } catch (err) {
        res.status(500).json({ available: false });
    }
});
userRouter.put("/update/profile",verifyToken,upload.single("profilePic"),updateProfile)
userRouter.post("/send-request",verifyToken,sendRequest);
userRouter.post("/cancel-request", verifyToken, cancelRequest);
userRouter.post("/accept-request", verifyToken, acceptRequest);
userRouter.post("/reject-request", verifyToken, rejectRequest);
userRouter.put("/setup/:userId",upload.single("profilePic"),setupProfile)

export default userRouter;