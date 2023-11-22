//for connect the schema of product
const mongoose = require("mongoose");
const OtpSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
      required: true,
    },
  },
  {
    collection: "Otp_schemas",
  }
);
module.exports = mongoose.model("Otp", OtpSchema);
