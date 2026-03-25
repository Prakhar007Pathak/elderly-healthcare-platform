const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, token) => {
  try {
    const verificationLink = `${process.env.API_URL}/api/auth/verify-email/${token}`;

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const info = await transporter.sendMail({
      from: "ElderCare <prakharpathak200@gmail.com>", // ⚠️ HARDCODED (IMPORTANT)
      to: email,
      subject: "Verify your email address",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to ElderCare</h2>

          <p>Please verify your email to activate your account.</p>

          <a href="${verificationLink}" 
             style="padding:12px 24px; background:#2563eb; color:white; text-decoration:none; border-radius:6px;">
            Verify Email
          </a>
        </div>
      `
    });

    console.log("Email sent:", info.messageId);

  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw new Error("Failed to send verification email");
  }
};

module.exports = sendVerificationEmail;