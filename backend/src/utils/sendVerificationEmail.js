const axios = require("axios");

const sendVerificationEmail = async (email, token) => {
  try {
    const verificationLink = `${process.env.API_URL}/api/auth/verify-email/${token}`;

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "ElderCare",
          email: "prakharpathak200@gmail.com"
        },
        to: [
          {
            email: email
          }
        ],
        subject: "Verify your email address",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Welcome to ElderCare</h2>

            <p>Please verify your email to activate your account.</p>

            <a href="${verificationLink}" 
               style="padding:12px 24px; background:#2563eb; color:white; text-decoration:none; border-radius:6px;">
              Verify Email
            </a>
          </div>
        `
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Email sent:", response.data);

  } catch (error) {
    console.error(
      "Email sending failed:",
      error.response?.data || error.message
    );
    throw new Error("Failed to send verification email");
  }
};

module.exports = sendVerificationEmail;