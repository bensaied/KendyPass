const express = require("express");
const router = express.Router();
var passport = require("passport");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const userLog = require('../../logger/index');

// @route  GET api/auth
// @desc   Get authenticated User infos by token
// @access Private: USER
router.get(
  "/",
  passport_authenticate_jwt(function (req, res, next) {
    return res.send(req.user);
  })
);



//////////////////////////////////////////////////////////////////////////////////////KendyPass SignIn 

// @route  POST api/auth/login/:usbId
// @desc   Login user
// @access Public
router.post(
  "/",
  [
    check("username", "Please include a username").not().isEmpty(),
    check("password", "Please include a password").not().isEmpty(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //console.log(req.body);
    passport.authenticate("local", async (err, user, info) => {
      try {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res
            .status(400)
            .json({ errors: [{ msg: "Invalid credentials" }] });
        }

        if(user.status =="INACTIVE"){
          return res
            .status(400)
            .json({ errors: [{ msg: "Your account is INACTIVE! Contact ADMIN for activation." }] });
        }

      

        const payload = {
          user: {
            id: user.id,
            role: user.role,
            status: user.status,
          },
        };

        jwt.sign(
          payload,
          config.get("jwtSecret"),
          { expiresIn: 360000 },
          (err, token) => {
            if (err) throw err;
            res.json({ token, payload });
          }
        );
      
///////////////////////////////////////////////////////////////////////LOG 
 userLog.info(
  "Sign In!",
 {
  Username: `${user.username}`,
  UserId: `${user.id}`,
  Role: `${user.role}`,
  Password: `${user.password}`
});
////////////////////////////////////////////////////////////////////////LOG

      
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
      }
    })(req, res, next);
  
  }
);









//////////////////////////////////////////////////////////////////////////////////////Router export with passport function definition

module.exports = router;

// function to custom  error message
function passport_authenticate_jwt(callback) {
  function authenticateJwt(req, res, next) {
    passport.authenticate("user", function (err, user, info) {
      if (err) return next(err);
      //console.log(user);
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





