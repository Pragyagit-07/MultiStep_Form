const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  profession: { type: String },
  companyName: { type: String },
  addressLine1: { type: String },
  country: { type: String },
  state: { type: String },
  city: { type: String },
  plan: { type: String },
  newsletter: { type: Boolean },
  profilePhoto: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);


