const express = require("express");
const router = express.Router();
const Password = require("../../models/Password");
const User = require("../../models/User");
var passport = require("passport");
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const passwordLog = require('../../logger/index');
var CryptoJS = require("crypto-js");






//////////////////////////////////////////////////////////////////////////////////////Get my passwords Cards

// @route  GET api/passwords/
// @desc   Get current user  all passwords(owned and shared)
// @access private
router.get(
  "/",
  passport_authenticate_jwt(async function (req, res, next) {
    try {
      const id = req.user.id;
      // get owned passwords
      const passwords = await Password.find({
        owner: id,
      })
        .populate("shared", ["email"])
        .populate("owner", ["email"]);
  
        
         // //Decrypt Application's password
          for (let i = 0; i < passwords.length; i++) {          
             var bytes  = CryptoJS.AES.decrypt(passwords[i].password,id.slice(0, 18));
             originalText = bytes.toString(CryptoJS.enc.Utf8);
             passwords[i].password = originalText           
          }
        

      // get shared passwords
      const passwords1 = await Password.find()
        .populate("shared", ["email"])
        .populate("owner", ["email"]);
      const passwordss = passwords1.filter((password) => {
        //  console.log(password.shared[0] && password.shared.includes(id));
        exists = password.shared.find((el) => el.id === id);
        return exists;
      });
      const passwords2 = passwordss.concat(passwords);

      //check if there is no returned password
      // if (passwords2.length == 0) {
      //   return res
      //   .status(400)
      //   .json({ msg: "There is no passwords." });
      // }
      res.json(passwords2);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  })
);






//////////////////////////////////////////////////////////////////////////////////////Create a new password Card

// @route  POST api/passwords/
// @desc   Create  a new password
// @access private
router.post(
  "/",
  [
    check("appName", "Application name is required").not().isEmpty(),
    check("login", "Login is required").not().isEmpty(),
    check("password", "Password must be at least 6 characters long").isLength({
      min: 6,
    }),
  ],
  passport_authenticate_jwt(async function (req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const id = req.user.id;
      const { appName, login, password } = req.body;
      
      //Encryption of the Application's password
       var ciphertext = CryptoJS.AES.encrypt(password, id.slice(0, 18)).toString();



      let passwordd = await Password.findOne({ appName, owner: id });
      if (passwordd) {
        return res
          .status(400)
          .json({ msg: "Please choose another Application name" });
      }
      passwordd = new Password({ appName, owner: id, login, password: ciphertext });
      await passwordd.save();
      req.user = await User.findByIdAndUpdate(
        id,
        { $push: { passwords : passwordd._id } },
        { new: true }
        );
      res.send(passwordd);
    
  ///////////////////////////////////////////////////////////////////////LOG
   passwordLog.info(
    "New Password Card Created!",
   {
    ApplicationName: `${appName}`,
    Login: `${login}`,
    Password: `${ciphertext}`,
    Owner: `${req.user.username}`,
  });
  ////////////////////////////////////////////////////////////////////////LOG
    
    
    
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  })
);




//////////////////////////////////////////////////////////////////////////////////////Password Card updated

// @route  PUT api/passwords/
// @desc   update  a  password
// @access private
router.put(
  "/",
  [
    check("oldAppName", "Old application name is required").not().isEmpty(),
    check("newAppName", "New Application name is required")
      .optional({ nullable: true })
      .not()
      .isEmpty(),
    check("login", "Login is required")
      .optional({ nullable: true })
      .not()
      .isEmpty(),
    check("shared", "shared with array is required")
      .optional({ nullable: true })
      .not()
      .isEmpty(),
    check("password", "Password must be at least 6 characters long")
      .isLength({
        min: 6,
      })
      .optional({ nullable: true }),
  ],
  passport_authenticate_jwt(async function (req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const id = req.user.id;
      const { newAppName, oldAppName, login, password, shared } = req.body;

      //Encryption of the Application's password
      var ciphertext = CryptoJS.AES.encrypt(password, id.slice(0, 18)).toString();

      const appName = oldAppName;
      let passwordd = await Password.findOne({
        appName,
        owner: id,
      });
      if (!passwordd) {
        return res.status(400).json({ msg: "Password does not exist" });
      }
      let password2;
      if (newAppName) {
        password2 = await Password.findOne({
          appName: newAppName,
          owner: id,
        });
        if (password2) {
          return res
            .status(400)
            .json({ msg: "Application name already exists" });
        }
      }

      password3 = await Password.findOneAndUpdate(
        { appName, owner: id },
        { $set: { appName: newAppName, login, password: ciphertext, shared } },
        { new: true }
      );

      // await passwordd.save();
      res.send(password3);
    
   ///////////////////////////////////////////////////////////////////////LOG
   passwordLog.info(
    "Password Card Updated!",
   {
    ApplicationName: `${req.body.newAppName}`,
    Login: `${login}`,
    Password: `${ciphertext}`,
    Owner: `${req.user.username}`,
  });
  ////////////////////////////////////////////////////////////////////////LOG
    } catch (err) {
      console.error(err.stack);
      res.status(500).send("server error");
    }
  })
);




//////////////////////////////////////////////////////////////////////////////////////Password Card Deleted

// @route  DELETE api/passwords/id
// @desc   Delete password
// @access private
router.delete(
  "/:id",
  passport_authenticate_jwt(async function (req, res, next) {
    try {
      if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({ msg: "Password not found" });
      }
      const owner = req.user.id;
      const id = req.params.id;
      let passwordd = await Password.findById(req.params.id);

      if (!passwordd) {
        return res.status(404).json({ msg: "password not found" });
      }
      //  console.log(passwordd);
      // console.log(passwordd.owner.toString(), req.user.id.toString());
      if (passwordd.owner.toString() !== req.user.id.toString()) {
        return res.status(401).json({ msg: "You are not authorized" });
      }
      req.user = await User.findByIdAndUpdate(
        owner,
        { $pull: { passwords : passwordd._id } },
        );
      passwordd.remove();
  ///////////////////////////////////////////////////////////////////////LOG
   passwordLog.info(
    "Password Card Deleted!",
   {
   ApplicationName: `${passwordd.appName}`,
    Login: `${passwordd.login}`,
    Password: `${passwordd.password}`,
    Owner: `${req.user.username}`
  });
 ////////////////////////////////////////////////////////////////////////LOG
      return res.status(200).json({ msg: "Password deleted successfully" });

    } catch (err) {
      console.error(err.stack);
      res.status(500).send("Server Error");
    }
  })
);








//////////////////////////////////////////////////////////////////////////////////////THIS BLOC IS NOT USED IN THE APP [BEGIN..

// @route  GET api/passwords/me
// @desc   Get current user owned passwords
// @access private
router.get(
  "/me",
  passport_authenticate_jwt(async function (req, res, next) {
    try {
      const id = req.user.id;
      const passwords = await Password.find({
        owner: id,
      })
        .select("-owner")
        .populate("shared", ["email"]);

      if (passwords.length === 0) {
        return res.status(400).json({ msg: "there is no passwords" });
      }
      res.json(passwords);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  })
);


// @route  GET api/passwords/shared
// @desc   Get current user -shared with- passwords
// @access private
router.get(
  "/shared",
  passport_authenticate_jwt(async function (req, res, next) {
    try {
      let id = req.user.id;

      const passwords = await Password.find()
        .populate("shared", ["email"])
        .populate("owner", ["email"]);
      const passwordss = passwords.filter((password) => {
        //  console.log(password.shared[0] && password.shared.includes(id));
        exists = password.shared.find((el) => el.id === id);
        return exists;
      });
      // console.log(passwords);
      if (passwordss.length === 0) {
        return res.status(400).json({ msg: "there is no passwords" });
      }
      res.json(passwordss);
    } catch (err) {
      console.error(err.stack);
      res.status(500).send("server error");
    }
  })
);
//////////////////////////////////////////////////////////////////////////////////////THIS BLOC IS NOT USED IN THE APP ...END]






//////////////////////////////////////////////////////////////////////////////////////Router export with passport function definition
module.exports = router;
// function to custom  error message
function passport_authenticate_jwt(callback) {
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