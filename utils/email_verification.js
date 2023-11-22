const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const { generateOtp } = require("../utils/otp");
dotenv.config();
let verificationToken;
const sendVerificationCode = (email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASS,
    },
  });

  verificationToken = generateOtp();
  console.log(`your otp is : ${verificationToken}`);
  const send_email = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "Email verification",
    text: `Your OTP is ${verificationToken}`,
  };

  transporter.sendMail(send_email, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Verification email sent: " + info.response);
    }
  });
};

module.exports = { sendVerificationCode };
