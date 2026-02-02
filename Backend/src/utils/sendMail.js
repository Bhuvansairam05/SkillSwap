// utils/sendMail.js
const nodemailer = require("nodemailer");

const sendMail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,   // your gmail
        pass: process.env.MAIL_PASS,   // app password
      },
    });

    await transporter.sendMail({
      from: `"Peer Skill" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("✅ Mail sent to:", to);
  } catch (error) {
    console.error("❌ Mail error:", error);
  }
};

module.exports = sendMail;
