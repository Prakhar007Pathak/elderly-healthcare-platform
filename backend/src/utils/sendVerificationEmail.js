const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (email, token) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is missing");
    }

    const verificationLink = `${process.env.API_URL}/api/auth/verify-email/${token}`;

    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify your email address",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to ElderCare</h2>
          
          <p>
            Thank you for registering. Please verify your email to activate your account.
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

          <p style="margin-top:20px;">
            If you did not create this account, you can safely ignore this email.
          </p>
        </div>
      `
    });

    console.log("Email sent via Resend:", response);

    if (response.error) {
      console.error("Resend API error:", response.error);
      throw new Error(response.error.message);
    }

  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw new Error("Failed to send verification email");
  }
};

module.exports = sendVerificationEmail;