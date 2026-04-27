import axios from "axios";
import React, { useRef, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const OtpScreen = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const inputsRef = useRef([]);
    const location = useLocation();
    const email = location.state?.email || "";
    const navigate = useNavigate();


    const handleChange = (value, index) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < otp.length - 1) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        const pasteData = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(pasteData)) return;

        const newOtp = pasteData.split("");
        setOtp(newOtp);

        const lastIndex = newOtp.length - 1;
        if (inputsRef.current[lastIndex]) {
            inputsRef.current[lastIndex].focus();
        }
    };

    const handleSubmit = async () => {
        const finalOtp = otp.join("");

        try {
            setLoading(true);

            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/verify`,
                { otp: finalOtp, email }
            );

            if (!data.success) {
                toast.error(data.message);
                setLoading(false);
                return;
            }

            toast.success("Registration successful!");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    };

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft])

    return (
        <div className="min-h-screen flex items-center justify-center bg-indigo-50 px-4">
            <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-md text-center">
                <Toaster position="top-center" />
                <h2 className="text-2xl font-bold text-indigo-600 mb-2">
                    OTP Verification
                </h2>
                <p className="text-gray-500 mb-6 text-sm sm:text-base">
                    Enter the 6-digit code sent to your email
                </p>

                {/* OTP Inputs */}
                <div className="flex justify-center gap-2 sm:gap-3 mb-6">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength="1"
                            value={digit}
                            ref={(el) => (inputsRef.current[index] = el)}
                            onChange={(e) => handleChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={handlePaste}
                            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center text-lg font-semibold border-2 border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                    ))}

                </div>
                <p className="text-sm mb-4">
                    {timeLeft > 0 ? (
                        <span className="text-gray-500">
                            OTP expires in{" "}
                            <span className="text-indigo-600 font-semibold">
                                {formatTime(timeLeft)}
                            </span>
                        </span>
                    ) : (
                        <span className="text-red-500 font-medium">
                            OTP Expired
                        </span>
                    )}
                </p>

                <button
                    onClick={handleSubmit}
                    disabled={otp.some((digit) => digit === "") || loading || timeLeft === 0}
                    className={`w-full py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2
    ${otp.some((digit) => digit === "") || loading
                            ? "bg-indigo-300 cursor-not-allowed text-white"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                        }`}
                >
                    {loading ? (
                        <>
                            Verifying...
                        </>
                    ) : (
                        "Verify OTP"
                    )}
                </button>

                <p className="text-sm text-gray-500 mt-4">
                    Didn’t receive code?{" "}
                    {timeLeft === 0 ? (
                        <span
                            onClick={() => {
                                setTimeLeft(300); // reset timer
                            }}
                            className="text-indigo-600 cursor-pointer hover:underline"
                        >
                            Resend
                        </span>
                    ) : (
                        <span className="text-gray-400 cursor-not-allowed">
                            Resend
                        </span>
                    )}
                </p>
            </div>
        </div>
    );
};

export default OtpScreen;