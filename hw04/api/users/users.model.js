const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
    required: false,
  },
  token: String,
});

const UserModel = mongoose.model("User", userSchema);

exports.UserModel = UserModel;
