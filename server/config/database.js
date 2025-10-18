import mongoose from "mongoose";

const connectDB = async () => {
    await mongoose.connect("mongodb://localhost:27017/chat")
        .then(() => console.log("Database connected sucsessfully..."))
        .catch((e) => console.log(e.message))
}

export default connectDB