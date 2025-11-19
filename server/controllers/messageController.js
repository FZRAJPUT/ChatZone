import User from "../models/userModel.js";
import msgModel from "../models/messageModel.js";

export const sendMessage = async (req, res) => {
    try {
        const { receiverId, message } = req.body;
        const senderId = req.user.id;

        const sender = await User.findById(senderId);

        const isFriend = sender.friends.includes(receiverId);

        if (!isFriend) {
            return res.status(403).json({
                success: false,
                message: "You can only chat with your friends."
            });
        }

        const newMessage = await msgModel.create({
            sender: senderId,
            receiver: receiverId,
            message,
        });

        res.json({
            success: true,
            message: "Message sent",
            data: newMessage,
        });

    } catch (err) {
        console.log(err.message)
        res.status(500).json({ success: false, message: "Internal error" });
    }
}

export const fetchMessage = async (req, res) => {
    const myId = req.user.id;
    const friendId = req.params.friendId;

    console.log(myId,friendId)

    const messages = await msgModel.find({
        $or: [
            { sender: myId, receiver: friendId },
            { sender: friendId, receiver: myId }
        ]
    }).sort({ timestamp: 1 });

    res.json({ success: true, messages });
}
