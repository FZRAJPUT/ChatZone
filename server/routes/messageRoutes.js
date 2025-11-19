import express from "express";
import { fetchMessage, sendMessage } from "../controllers/messageController.js";
import verifyToken from "../utils/verifyToken.js";
const msgRouter = express.Router();

msgRouter.post("/send-message", verifyToken,sendMessage);
msgRouter.get("/messages/:friendId", verifyToken,fetchMessage);

export default msgRouter