import axios from "axios";

export const sendOTPEmail = async (email, otp) => {
    try {
        const response = await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender: { email: "subhashkushwah134@gmail.com" },
                to: [{ email }],
                subject: "OTP Verification",
                textContent: `Your OTP is ${otp}`,
            },
            {
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("OTP sent:", response.data);
        return { success: true, message: "Email Sent" }
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
    }
};