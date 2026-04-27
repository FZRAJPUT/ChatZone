import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const connectDB = async () => {
    await mongoose.connect(process.env.DB_URI)
        .then(() => console.log("Database connected sucsessfully..."))
        .catch((e) => console.log(e.message))
}

export default connectDB