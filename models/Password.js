const mongoose = require("mongoose");
const PasswordSchema = new mongoose.Schema({
  appName: {
    type: String,
    required: true,
  },
  login: {
    type: String,
    required: true,
  },
  password: { type: String, required: true },
  owner: {
    type: mongoose.Schema.Types.String,
    ref: "user",
    required: true,
  },
  shared: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});
module.exports = Password = mongoose.model("password", PasswordSchema);
