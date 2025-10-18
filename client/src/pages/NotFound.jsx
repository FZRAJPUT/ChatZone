import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white text-center px-6">
      <h1 className="text-8xl font-extrabold text-indigo-500 mb-4 animate-bounce">
        404
      </h1>
      <h2 className="text-3xl md:text-4xl font-semibold mb-2">
        Oops! Page Not Found 😕
      </h2>
      <p className="text-gray-400 mb-8 max-w-md">
        It looks like the page you’re looking for doesn’t exist or has been moved.
      </p>

      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 transition rounded-full font-medium shadow-md"
      >
        Back to Chatzone
      </button>

      <div className="mt-10 flex gap-3 text-gray-500 text-sm">
        <span>💬 ChatApp</span>
        <span>•</span>
        <span>Connecting People, Instantly</span>
      </div>
    </div>
  );
};

export default NotFoundPage;
