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

const allowedOrigins = [
  "http://localhost:8080",
  "https://chatzone1.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api", userRouter)
app.use("/api", msgRouter)

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

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });

  socket.on("sendMessage", (data) => {
    io.to(data.roomId).emit("recieveMSG", data);
  });

  socket.on("online", async (userId) => {
    try {
      socket.userId = userId;
      if (userId) {
        await User.findByIdAndUpdate(userId, { isOnline: true });
      }
    } catch (err) {
      console.error(err.message);
    }
  });

  socket.on("disconnect", async () => {
    try {
      if (socket.userId) {
        await User.findByIdAndUpdate(socket.userId, { isOnline: false });
      }
    } catch (err) {
      console.error(err.message);
    }
  });
});

const PORT = 4002 || process.env.PORT

server.listen(PORT, () => {
  connectDB()
  console.log("Server is running on " + PORT)
})