import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAvailable, setIsAvailable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!username.trim()) {
      setIsAvailable(null);
      return;
    }

    const timeout = setTimeout(async () => {
      setChecking(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/search?username=${username}`
        );
        setIsAvailable(data.available);
      } catch (err) {
        console.error(err);
      } finally {
        setChecking(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [username]);

  // ✅ Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username.trim() || !email.trim() || !password.trim()) {
      return toast.error("All fields are required!");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return toast.error("Please enter a valid email address!");
    }

    if (password.length < 8) {
      return toast.error("Password must be at least 8 characters long!");
    }

    if (isAvailable === false) {
      return toast.error("Username already taken!");
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/register`,
        { username, email, password }
      );

      if (data.success) {
        toast.success("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(data.message || "Registration failed!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-purple-100 px-4">
      <Toaster position="top-center" />
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-purple-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
          Register to ChatZone
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {checking ? (
              <p className="text-sm text-gray-500 mt-1">
                Checking availability...
              </p>
            ) : isAvailable === true ? (
              <p className="text-sm text-green-600 mt-1">
                Username available
              </p>
            ) : isAvailable === false ? (
              <p className="text-sm text-red-500 mt-1">Username taken</p>
            ) : null}
          </div>

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password (min 8 chars)"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition duration-200 flex items-center justify-center gap-2 ${
              loading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="mt-5 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
