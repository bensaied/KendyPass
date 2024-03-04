const mongoose = require("mongoose");
const { Role, Status } = require("../constants");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: Role,
    default: Role.USER,
  },
  status: {
    type: String,
    enum: Status,
    default: Status.STANDBY,
  },
  passwords: [{ type: mongoose.Schema.Types.ObjectId, ref: "password" }]
 
});





module.exports = User = mongoose.model("user", UserSchema);
