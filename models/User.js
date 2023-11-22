
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const productSchema = new mongoose.Schema({
  username: String,//mongoose document
  email: String,
  password: String,
  phoneNumber: String,
});
module.exports = mongoose.model("User", productSchema);
