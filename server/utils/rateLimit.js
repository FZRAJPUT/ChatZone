import rateLimit from "express-rate-limit";

// Register limiter
export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: "Too many registrations" },
});

// Login limiter (stricter)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: "Too many login attempts" },
});

// OTP verify limiter (very strict)
export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many OTP attempts" },
});

// General API limiter (light)
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
});