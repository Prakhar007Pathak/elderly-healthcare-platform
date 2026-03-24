const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, token) => {
  try {
    const verificationLink = `${process.env.API_URL}/api/auth/verify-email/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const info = await transporter.sendMail({
      from: `"ElderCare Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email address",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to ElderCare</h2>

          <p>
            Please verify your email to activate your account.
          </p>

          <a 
            href="${verificationLink}" 
            style="
              display:inline-block;
              padding:12px 24px;
              background:#2563eb;
              color:white;
              text-decoration:none;
              border-radius:6px;
              margin-top:12px;
              font-weight:bold;
            "
          >
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