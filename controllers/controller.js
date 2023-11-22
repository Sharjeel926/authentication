const verifyToken = require("../utils/authentication");
const UserCred = require("../models/User");
const otpSch = require("../models/otp_schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { secretKey } = require("../config/config");
const { body, validationResult } = require("express-validator");
const { generateOtp } = require("../utils/otp");
const conversation = require("../models/conversation");
const MSG = require("../models/message_sch");
const vobj = { v: false };
const isVerified = () => {
  return new Promise((resolve) => {
    if (vobj.v === true) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
};

const { sendVerificationCode } = require("../utils/email_verification");
//const ret_em_pass;
const route = (req, res) => {
  res.send("Welcome to Authentication system ");
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserCred.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const pass_validity = await bcrypt.compare(password, user.password);
    if (pass_validity) {
      const token = jwt.sign(
        {
          userId: user._id,
          username: user.username,
        },
        secretKey,
        { expiresIn: "1h" }
      );
      return res
        .status(200)
        .json({ message: "Login successfully", token, senderId: user._id });
    } else {
      return res.status(401).json({ message: "Authentication failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error generated while processing" });
  }
};

const profile = async (req, res) => {
  jwt.verify(req.token, secretKey, async (err, auth) => {
    if (err) {
      res.status(403).json({ result: "Invalid token" });
    } else {
      try {
        const username = auth.username;

        const user = await UserCred.findOne({ username });

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Welcome to your profile", user });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: "An error occurred while processing the request",
        });
      }
    }
  });
};

const verifyOtp = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      vobj.v = false;
      const otp = generateOtp();

      const { username, email, OTP } = req.body;

      const user_ot = new otpSch({
        username,
        email,
        otp,
      });

      // Save the OTP instance to the database
      await user_ot.save();
      const userMatchOtp = await otpSch.findOne({
        $or: [{ username }, { email }],
        otp: otp,
      });

      if (userMatchOtp) {
        vobj.v = true;
        await isVerified((vobj.v = true));
        console.log("OTP is verified");
        //return resolve("OTP is verified");
        // await registration(req, res);
        return res.status(201).json({ message: "OTP is verified" });
      } else {
        // If the OTP doesn't match, respond with an error
        return res.status(401).json({ message: "Token is not verified" });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "An error occurred while processing the request" });
    }
  });
};

/*/const registration = async (req, res) => {
  const { username, email, password, phoneNumber } = req.body;
  const em = email;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  try {
    const existingUser = await UserCred.findOne({
      $or: [{ username: username }], //, { email: email }
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hash_pass = await bcrypt.hash(password, 10);

    const newUser = new UserCred({
      username,
      email,
      password: hash_pass,
      phoneNumber,
    });

    sendVerificationCode(em);
    const otpVerificationRes = await verifyOtp(req, res);
    //const verifi = vobj.v; //await isVerified();

    if (otpVerificationRes.message === "Token is verified") {
      await newUser.save();
      return res.status(201).json({ message: "User registered successfully" });
    } else {
      return res.status(401).json({ message: "OTP is not verified" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while processing the request" });
  }
};/*/
const chatStart = async (req, res) => {
  const { senderID, receiverID } = req.body;
  const newCon = new conversation({
    participants: [senderID, receiverID],
  });
  await newCon.save();
  res.sendStatus(201).json(newCon);
};

const sendMessage = async (req, res) => {
  const { sender_id, receiver_id, message_content } = req.body;
  const user = await UserCred.findOne({ _id: receiver_id });
  if (!user) {
    res.send("Recipient is not find in the system");
  }
  const newMsg = new MSG({
    message_id: new mongoose.Types.ObjectId(),
    sender_id,
    receiver_id,
    message_content,
  });
  await newMsg.save();
  console.log("Message send successfully");

};

const receiveMessage = async (req, res) => {};
const getRecipient = async (req, res) => {
  const users = await UserCred.find({}, "_id username");
  const usernames = users.map((user) => ({
    receiverId: user._id,
    username: user.username,
  }));

  return res.status(200).json({ users: usernames });
};
const handleRegistration = async (req, res) => {
  try {
    const { username, email, password, phoneNumber } = req.body;
    const em = email;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const existingUser = await UserCred.findOne({
      $or: [{ username: username }], //{ email: email }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hash_pass = await bcrypt.hash(password, 10);

    const newUser = new UserCred({
      username,
      email,
      password: hash_pass,
      phoneNumber,
    });

    sendVerificationCode(em);

    const otpVerificationResponse = vobj.v;
    // Check the response to see if OTP is verified
    if (otpVerificationResponse) {
      //otpVerificationResponse.message === "OTP is verified"
      await newUser.save();
      return res.status(201).json({ message: "User registered successfully" });
    } else {
      return res.status(401).json({ message: "OTP is not verified" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while processing the request" });
  }
};

const registration = async (req, res) => {
  // You can call handleRegistration function here
  await handleRegistration(req, res);
};

module.exports = {
  route,
  login,
  profile,
  registration,
  verifyOtp,
  getRecipient,
  chatStart,
  sendMessage,
};
