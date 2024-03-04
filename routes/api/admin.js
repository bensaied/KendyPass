const express = require("express");
const { Role, Status } = require("../../constants");
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../../models/User");
var passport = require("passport");
const router = express.Router();
const fs = require("fs");
const userLog = require('../../logger/index');

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  //reject a file
  if (file.mimetype == "image/jpeg" || file.mimetype === "image/png")
    cb(null, true);
  else {
    cb(null, false);
  }
  //accept a file
};
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});


//////////////////////////////////////////////////////////////////////////////////////GET ALL KendyPass Users & Admins
// @route  get api/admin/all
// @desc   all users
// @access Private: admin
router.get(
  "/all",

  passport_authenticate_jwt_admin(async function (req, res, next) {
  try {//See if admin
    const admin = req.user
    if (admin.role != 'ADMIN') {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Only Admin can get users.' }] });
    }
      const users = await User.find({ _id: { $nin: [req.user._id] } /*role: Role.USER*/ }).select(
      //"-password -role" 
      ).lean().populate("passwords","appName")
      if (!users) return res.status(400).json({ msg: "There is no users" });
      return res.json(users);
    }  catch (err) {
      console.error(err.message);
      if (err.kind == "ObjectId") {
        return res.status(400).json({ msg: "There is no users" });
      }
      res.status(500).send("Server Error");
    }
})

);


//////////////////////////////////////////////////////////////////////////////////////Admin Update Users Profiles

// @route  PUT api/admin/user/:id
// @desc   update  a  user
// @access private
router.put(
  "/user/:id",
  upload.single("avatar"),
  [
    check("username", "Username is required")
      .optional({ nullable: true })
      .not().isEmpty(),
  ],
  passport_authenticate_jwt_admin(async function (req, res, next) {
    
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ msg: "User not found" });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const id = req.params.id;
      let user = await User.findById(id);
      if (user.role === Role.ADMIN) {
        return res.status(400).json({ msg: "Unauthorized to modify admin" });
      }
      if (!user) {
        return res.status(404).json({ msg: "User does not exist" });
      }

      if (Object.keys(req.body).length === 0 && !req.file) {
        return res.status(400).json({ msg: "No parameters to change" });
      } 
     
      //Body of the req definition 
      req.body = JSON.parse(req.body.body);
      const { username, firstName, lastName, status, password, newpassword, confirmnewpassword } = req.body;
     
      //Change Status (ACTIVE or INACTIVE)
      if (status) {
        user = await User.findByIdAndUpdate(
          id,
          { $set: { status } },
          { new: true }
        );
      }

      //Reset Password of the User and change his status to STANDBY
      if (!newpassword && confirmnewpassword) {return res.status(400).json({ msg: "Enter your new password." });}
      if (newpassword && !confirmnewpassword) {return res.status(400).json({ msg: "Confirm your new password." });}
      if( newpassword && confirmnewpassword) {
      if (newpassword !== confirmnewpassword) {
          return res.status(400).json({ msg: "Passwords do not match." });
        } else {
            // Encrypt password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newpassword, salt);
            user.status = "STANDBY";
            user = await user.save();
        }
      }
      
      //In the case of change User's username ! look if the username is already exists
      const user1 = await User.findOne({ username });
      if (user1 && user1.id !== user.id) {
        return res.status(400).json({ msg: "Username already taken" });
      }

      //Change User's avatar image
      let avatar;
      if (req.file && user.avatar[0] === "u") {
        fs.unlink(user.avatar, (err) => {
          if (err) console.log(err);
          else {
            // console.log("\nDeleted Symbolic Link: symlinkToFile");
          }
        });
      }
      if (req.file) avatar = req.file.path;
      
      //Save user's informations when updating ( username, FirstName, LastName and Avatar )
      user = await User.findByIdAndUpdate(
        id,
        { $set: { username, firstName, lastName, avatar } },
        { new: true }
      );

      //await password.save();
      res.json(user);

 ///////////////////////////////////////////////////////////////////////LOG
 userLog.info(
  "Admin update user's account!",
 {
  FirstName: `${user.firstName}`,
  LastName: `${user.lastName}`,
  Username: `${user.username}`,
  UserID: `${user._id}`,
  Password: `${user.password}`,
  Status: `${user.status}`,
  Role: `${user.role}`,
  Avatar: `${user.avatar}`
});
////////////////////////////////////////////////////////////////////////LOG


    } catch (err) {
      console.error(err.stack);
      res.status(500).send("server error");
    }
  })
);







//////////////////////////////////////////////////////////////////////////////////////Admin delete User's account (NOT USED IN THE APPLICATION)

// @route  DELETE api/admin/user/:id
// @desc   Delete user by id
// @access Private: admin
router.delete(
  "/user/:id",
  passport_authenticate_jwt_admin(async function (req, res, next) {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ msg: "User not found" });
    }
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
      user.remove();
      return res.status(200).json({ msg: "User deleted succefully" });
    } catch (err) {
      console.error(err.message);
      return res.status.send("Server error");
    }
  })
);



//////////////////////////////////////////////////////////////////////////////////////Router export with passport function definition

module.exports = router;
// function to custom  error message
function passport_authenticate_jwt_admin(callback) {
  function authenticateJwt(req, res, next) {
    passport.authenticate("user", function (err, user, info) {
      if (err) return next(err);
      if (!user)
        return res.status(401).send({
          error: {
            code: "INVALID_AUTHORIZATION_CODE",
            message: "You are unauthorized",
          },
        });
      req.user = user;
      return callback(req, res, next);
    })(req, res, next);
  }

  return authenticateJwt;
}