const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// Send account verification email using Resend service.
const sendVerificationEmail = async (email, name, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  await resend.emails.send({
    from: "Issue Tracker <onboarding@resend.dev>",
    to: email,
    subject: "Verify your email address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Welcome to Issue Tracker, ${name}! 🐛</h2>
        <p>Thanks for registering. Please verify your email address by clicking the button below:</p>
        <a href="${verifyUrl}" 
          style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 16px 0;">
          Verify Email
        </a>
        <p style="color: #94a3b8; font-size: 0.85rem;">This link expires in 24 hours.</p>
        <p style="color: #94a3b8; font-size: 0.85rem;">If you didn't create an account, ignore this email.</p>
      </div>
    `,
  });
};

module.exports = { sendVerificationEmail };