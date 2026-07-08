const nodemailer = require("nodemailer");

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error(
      "GMAIL_USER and GMAIL_APP_PASSWORD must be set in environment variables to send email.",
    );
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  return transporter;
}

async function sendPasswordResetOTP(toEmail, name, otp) {
  const mailer = getTransporter();

  await mailer.sendMail({
    from: `"Digital Logics Studio" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: "Your password reset code",
    text: `Hi ${name},\n\nYour password reset code is ${otp}. It expires in 10 minutes.\n\nIf you didn't request this, you can safely ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #111;">Reset your password</h2>
        <p>Hi ${name},</p>
        <p>Use the code below to reset your Digital Logics Studio password. This code expires in <strong>10 minutes</strong>.</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; background: #f4f4f5; padding: 16px 24px; text-align: center; border-radius: 8px;">${otp}</p>
        <p style="color: #666; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}

module.exports = { sendPasswordResetOTP };
