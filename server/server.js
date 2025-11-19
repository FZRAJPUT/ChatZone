import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'
import http from 'http'
import connectDB from './config/database.js';
import dotenv from 'dotenv'
import userRouter from './routes/userRoutes.js';
import User from './models/userModel.js';
import msgRouter from './routes/messageRoutes.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api",userRouter)
app.use("/api",msgRouter)

app.get("/", (req, res) => {
    res.json({ message: "Hello from socket server....." })
})
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "PUT"]
    }
});

io.on("connection", (socket) => {
  socket.on("joinroom", (roomId) => {
    socket.join(roomId);
    console.log(`SocketId: ${socket.id} joined RoomId: ${roomId}`);
  });

  socket.on("online", async (userId) => {
    try {
      console.log("User online:", userId);
      socket.userId = userId;
      if (userId) {
        await User.findByIdAndUpdate(
          userId,
          { isOnline: true },
          { new: true }
        );
      }
    } catch (err) {
      console.error("Error setting user online:", err.message);
    }
  });

  socket.on("sendMessage", (data) => {
    socket.to(data.room).emit("recieveMSG", data);
  });

  socket.on("disconnect", async () => {
    try {
      if (socket.userId) {
        console.log("User disconnected:", socket.userId);
        await User.findByIdAndUpdate(
          socket.userId,
          { isOnline: false },
          { new: true }
        );
      }
    } catch (err) {
      console.error("Error setting user offline:", err.message);
    }
  });
});


server.listen(4002, () => {
    connectDB()
    console.log("Server is running on http://localhost:4002")
})