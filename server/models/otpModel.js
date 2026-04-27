import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 3,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    otp: {
        type: String,
        required: true,
        maxlength: 6
    },
    createdAt: { type: Date, expires: 300, default: Date.now },
})

const otpModel = mongoose.models.otps || mongoose.model("otps", otpSchema);
export default otpModel