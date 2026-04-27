import axios from "axios";

export const sendOTPEmail = async (email, otp) => {
    try {
        const response = await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender: { email: "subhashkushwah134@gmail.com" },
                to: [{ email }],
                subject: "OTP Verification",
                htmlContent: `
    <div style="font-family: Arial, sans-serif; background-color:#f1f5ff; padding:20px;">
        <div style="max-width:500px; margin:auto; background:white; padding:30px; border-radius:10px; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
            
            <h2 style="color:#4f46e5; margin-bottom:10px;">OTP Verification</h2>
            
            <p style="color:#555; font-size:14px;">
                Use the OTP below to verify your account
            </p>

            <div style="margin:20px 0;">
                <span style="display:inline-block; font-size:28px; letter-spacing:6px; font-weight:bold; color:#111; background:#eef2ff; padding:10px 20px; border-radius:8px;">
                    ${otp}
                </span>
            </div>

            <p style="color:#888; font-size:12px;">
                This OTP is valid for 5 minutes.
            </p>

            <hr style="margin:20px 0; border:none; border-top:1px solid #eee;" />

            <p style="font-size:12px; color:#aaa;">
                If you didn't request this, you can ignore this email.
            </p>

        </div>
    </div>
    `,
            },
            {
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

        return { success: true, message: "Email Sent" }
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
    }
};