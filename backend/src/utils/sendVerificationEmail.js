const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const verificationLink = `${process.env.API_URL}/api/auth/verify-email/${token}`;
        
        await transporter.sendMail({
            from: `"ElderCare Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify your email address",
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to ElderCare</h2>
          <p>Thank you for registering. Please verify your email to activate your account.</p>
          
          <a 
            href="${verificationLink}" 
            style="
              display:inline-block;
              padding:10px 20px;
              background:#2563eb;
              color:white;
              text-decoration:none;
              border-radius:6px;
              margin-top:10px;
            "
          >
            Verify Email
          </a>

          <p style="margin-top:20px;">
            If you did not create this account, you can safely ignore this email.
          </p>
        </div>
      `
        });

    } catch (error) {
        console.error("Email sending failed:", error);
    }
};

module.exports = sendVerificationEmail;