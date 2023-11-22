const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User"); // Import the User model from User.js
const Otp = require("../models/otp_schema");
const messageSchema = require("../models/message_sch");
const conversation = require("../models/conversation");
mongoose
  .connect("mongodb://localhost:27017/Credential", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongodb connected");
  })
  .catch((error) => {
    console.log("Mongodb connection error", error);
  });
