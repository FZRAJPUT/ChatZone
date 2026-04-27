import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white text-gray-800 flex flex-col">

            {/* Navbar */}
            <div className="flex justify-between items-center px-6 py-4 shadow-sm">
                <span className="relative inline-block">
                    <span className="inline-flex rounded-lg shadow-sm">
                        <span className="bg-white border-[4px] border-indigo-600 text-indigo-600 px-2 py-1 font-bold">
                            Chat
                        </span>
                        <span className="bg-indigo-600 text-white px-2 py-2 font-bold">
                            Zone
                        </span>
                    </span>
                    <motion.span
                        className="absolute left-0 bottom-0 h-1 bg-indigo-500"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1 }}
                    />
                </span>

                <div className="space-x-3">
                    <button
                        onClick={() => navigate("/login")}
                        className="px-4 py-2 rounded-lg text-indigo-600 border border-indigo-600 hover:bg-indigo-50 transition"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate("/register")}
                        className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                    >
                        Register
                    </button>
                </div>
            </div>

            {/* Hero Section */}
            <div className="flex flex-1 flex-col justify-center items-center text-center px-6 py-10">

                {/* Animated Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl sm:text-5xl font-bold text-indigo-600 mb-4"
                >
                    Welcome to{" "}
                    <span className="relative inline-block">
                        <span className="inline-flex rounded-lg shadow-sm">
                            <span className="bg-white border-[4px] border-indigo-600 text-indigo-600 px-2 py-1 font-bold">
                                Chat
                            </span>
                            <span className="bg-indigo-600 text-white px-2 py-1 font-bold">
                                Zone
                            </span>
                        </span>
                        <motion.span
                            className="absolute left-0 bottom-0 h-1 bg-indigo-500"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1 }}
                        />
                    </span>
                </motion.h2>

                {/* Animated Subtext */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="max-w-xl text-lg text-gray-500 mb-8"
                >
                    Connect instantly with friends, send messages in real-time,
                    and enjoy a fast, secure, and seamless chatting experience.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <button
                        onClick={() => navigate("/register")}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
                    >
                        Get Started
                    </button>

                    <button
                        onClick={() => navigate("/login")}
                        className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition"
                    >
                        Already have an account
                    </button>
                </motion.div>
            </div>

            {/* Features Section */}
            <div className="bg-indigo-50 py-12 px-6">
                <h3 className="text-2xl font-bold text-center text-indigo-600 mb-10">
                    Why Choose ChatZone?
                </h3>

                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto">

                    {[
                        { title: "Real-time Messaging", desc: "Instant chat with zero delay." },
                        { title: "Secure & Private", desc: "Your data is safe and protected." },
                        { title: "Modern UI", desc: "Clean and beautiful user interface." }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            className="bg-white p-6 rounded-xl shadow hover:shadow-xs transition text-center"
                        >
                            <h4 className="font-semibold text-lg text-indigo-600 mb-2">
                                {item.title}
                            </h4>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="text-center py-4 text-gray-400 text-sm">
                © {new Date().getFullYear()} ChatZone. All rights reserved.
            </div>
        </div>
    );
};

export default Welcome;