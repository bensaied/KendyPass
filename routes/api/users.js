const express = require("express");
const { Role, Status } = require("../../constants");
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../../models/User");
const passport = require("passport");
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
const router = express.Router();

// @route  POST api/users
// @desc   Register User
// @access PUBLIC





//////////////////////////////////////////////////////////////////////////////////////New User Change His Password for the First Connect

// @route  PUT api/users/me
// @desc   update  own account
// @access private
router.post(
  "/changepwd",


  [
    check("oldpassword", "Old Password is required")
      .optional({ nullable: true })
      .not().isEmpty(),
  ],

  // [
  //   check('oldpassword', 'Incorrect Password').isLength({
  //     min: 6,
  //   })
  // ],

  passport_authenticate_jwt_user(
    async function (req, res, next) {
    try { 
      const id = req.user.id;
      const status = req.user.status;
      let user = await User.findById(id);
      if (!user) {
        return res.status(400).json({
          errors: [
            {
              msg: 'User does not exist.',
            },
          ],
        });
      }
      if (status !== "STANDBY") {
        return res.status(400).json({
          errors: [
            {
              msg: "You already changed your password.",
            },
          ],
        });
      }
      if (Object.keys(req.body).length === 0 && !req.file) {
        return res.status(400).json({ msg: "No parameters to change" });
      }
      const { oldpassword, newpassword, confirmpassword } = req.body;
      const username = user.username
      const user1 = await User.findOne({ username });
      if (user1 && user1.id !== user.id) {
        return res.status(400).json({ msg: "UserfindByIdname already taken" });
      }     
      if (oldpassword) {
        const isMatch = await bcrypt.compare(oldpassword, user1.password);

        if (!isMatch) {
          return res.status(400).json({
            errors: [
              {
                msg: 'Incorrect Old Password.',
              },
            ],
          });
        }
      }
      if (newpassword !== confirmpassword) {
        return res.status(400).json({
          errors: [
            {
              msg: 'Passwords do not match.',
            },
          ],
        });
      }
 
       // Encrypt password
       const salt = await bcrypt.genSalt(10);
       user1.password = await bcrypt.hash(newpassword, salt);
       // Change Status
       user1.status = "ACTIVE"
       user = await user1.save();

    
      res.json(user);

 ///////////////////////////////////////////////////////////////////////LOG
 userLog.info(
  'User Change his Password for the First Time!',
 {
  FirstName: `${user.firstName}`,
  LastName: `${user.lastName}`,
  Username: `${user.username}`,
  UserID: `${user._id}`,
  Password: `${user.password}`,
  Avatar: `${user.avatar}`
});
////////////////////////////////////////////////////////////////////////LOG

    } catch (err) {
      console.error(err.stack);
      res.status(500).send("Server error");
    }
  }
  )
);







//////////////////////////////////////////////////////////////////////////////////////New User Created

router.post(
  "/adduser",
  upload.single("avatar"),
  [
    // check("firstName", "First name is required").not().isEmpty(),
    // check("lastName", "Last name is required").not().isEmpty(),
    // check("username", "Please include a username").not().isEmpty(),
    // check("role", "Please include a valid role")
    //   .optional({ nullable: true })
    //   .isIn(Role),
    // check("status", "Please include a valid status")
    //   .optional({ nullable: true })
    //   .isIn(Status),
    // check("password", "Password must be at least 8 characters long").isLength({
    //   min: 8,
    // }),
  ],
  passport_authenticate_jwt_admin(async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const admin = req.user

    if (admin.role != 'ADMIN') {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Only Admin can add users.' }] });
    }
    const { firstName, lastName, username, password, role, status, avatar} = JSON.parse(req.body.body);

    try {
      // See if user exists
      let user = await User.findOne({ username });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Username already exists" }] });
      }
    

      user = new User({
        firstName,
        lastName,
        username,
        password,
        avatar,
        role: "USER",
        status: "STANDBY",
  
      });
      
     
      // if (req.file && user.avatar[0] === "u") {
      //   fs.unlink(user.avatar, (err) => {
      //     if (err) console.log(err);
      //     else {
      //       // console.log("\nDeleted Symbolic Link: symlinkToFile");
      //     }
      //   });
      // }

      if (req.file) { user.avatar=req.file.path} 
      else{ user.avatar = "uploads/avatar_default.jpg" }

   

    
      
      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user = await user.save();
      // return res.send("user registred");
      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    ///////////////////////////////////////////////////////////////////////LOG
      userLog.info(
        'A New User Created!',
       {
        FirstName: `${user.firstName}`,
        LastName: `${user.lastName}`,
        Username: `${user.username}`,
        UserID: `${user._id}`,
        Password: `${user.password}`,
        Avatar: `${user.avatar}`
      });
    ////////////////////////////////////////////////////////////////////////LOG
    
    } catch (err) {
      console.error(err.message);
      return res.status.send("Server error");
    }
  }
  )
);







//////////////////////////////////////////////////////////////////////////////////////Change Current Password

router.post(
  "/pwd",


  // [
  //   check("currentpassword", "Current Password is required")
  //     .optional({ nullable: true })
  //     .not().isEmpty(),
  // ],

  // [
  //   check('oldpassword', 'Incorrect Password').isLength({
  //     min: 6,
  //   })
  // ],

  passport_authenticate_jwt_user(

    async function (req, res, next) {
      console.log("dd",req)
    try { 
    
      // const id = req.user.id;
      // const status = req.user.status;
      // let user = await User.findById(id);
      // if (!user) {
      //   return res.status(400).json({
      //     errors: [
      //       {
      //         msg: 'User does not exist.',
      //       },
      //     ],
      //   });
      // }
  
      
      // if (Object.keys(req.body).length === 0 && !req.file) {
      //   return res.status(400).json({ msg: "No parameters to change" });
      // }
      // const { oldpassword, newpassword, confirmpassword } = req.body;
      // const username = user.username
      // const user1 = await User.findOne({ username });
    
      // if (oldpassword) {
      //   const isMatch = await bcrypt.compare(oldpassword, user1.password);

      //   if (!isMatch) {
      //     return res.status(400).json({
      //       errors: [
      //         {
      //           msg: 'Incorrect Old Password.',
      //         },
      //       ],
      //     });
      //   }
      // }
      
      
 
      //  // Encrypt password
      //  const salt = await bcrypt.genSalt(10);
      //  user1.password = await bcrypt.hash(newpassword, salt);
      //  // Change Status
      //  user1.status = "ACTIVE"
      //  user = await user1.save();

    
      // res.json(user);

 ///////////////////////////////////////////////////////////////////////LOG
 userLog.info(
  'User Change his Current Password!',
 {
  FirstName: `${user.firstName}`,
  LastName: `${user.lastName}`,
  Username: `${user.username}`,
  UserID: `${user._id}`,
  Password: `${user.password}`,
  Avatar: `${user.avatar}`
});
////////////////////////////////////////////////////////////////////////LOG

    } catch (err) {
      console.error(err.stack);
      res.status(500).send("Server error");
    }
  }
  )
);






//////////////////////////////////////////////////////////////////////////////////////User Updated his own Account

// @route  PUT api/users/me
// @desc   update  own account
// @access private
router.put(
  "/me",
  upload.single("avatar"),

  [
    check("username", "Username is required!!!")
      .optional({ nullable: true })
      .not().isEmpty(),
  ],

  [
    check('currentpassword', 'Current Passwordis is required')
    .optional({ nullable: true })
    .not().isEmpty(),
  ],

  passport_authenticate_jwt_user(async function (req, res, next) {
    try {
     
      req.body = JSON.parse(req.body.body);
      const { username, firstName, lastName, status, currentpassword, newpassword, confirmnewpassword } = req.body;
      const id = req.user.id;
      let user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ msg: "User does not exist" });
      }
      if (Object.keys(req.body).length === 0 && !req.file) {
        return res.status(400).json({ msg: "No parameters to change" });
      }
      if (currentpassword) {
        const isMatch = await bcrypt.compare(currentpassword, user.password);

        if (!isMatch) {
          return res.status(400).json({ msg: "Incorrect Current Password." });
        }
      }

   
      
      const user1 = await User.findOne({ username });
      if (user1 && user1.id !== user.id) {
        return res.status(400).json({ msg: "Username already taken." });
      }
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
      if (!newpassword && confirmnewpassword) {return res.status(400).json({ msg: "Enter your new password." });}
      if (newpassword && !confirmnewpassword) {return res.status(400).json({ msg: "Confirm your new password." });}
      if( newpassword && confirmnewpassword) {
      if (newpassword !== confirmnewpassword) {
        return res.status(400).json({ msg: "Passwords do not match." });
      } else {
          // Encrypt password
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(newpassword, salt);
          user = await user.save();
      }
      }

      user = await User.findByIdAndUpdate(
        id,
        { $set: { username, firstName, lastName, avatar, status} },
        { new: true }
      );
      //console.log(req);
     //await password.save();
    
      res.json(user);

 ///////////////////////////////////////////////////////////////////////LOG
 userLog.info(
  'User Updated Own Account!',
 {
  FirstName: `${user.firstName}`,
  LastName: `${user.lastName}`,
  Username: `${user.username}`,
  UserID: `${user._id}`,
  Password: `${user.password}`,
  Avatar: `${user.avatar}`
});
////////////////////////////////////////////////////////////////////////LOG

    } catch (err) {
      console.error(err.stack);
      res.status(500).send("Server error");
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



// function to custom  error message
function passport_authenticate_jwt_user(callback) {
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









//////////////////////////////////////////////////////////////////////////////////////New User Created Sign Up Not Used in the APP

// router.post(
//   "/",
//   [
//     check("firstName", "First name is required").not().isEmpty(),
//     check("lastName", "Last name is required").not().isEmpty(),
//     check("username", "Please include a username").not().isEmpty(),
//     check("role", "Please include a valid role")
//       .optional({ nullable: true })
//       .isIn(Role),
//     check("status", "Please include a valid status")
//       .optional({ nullable: true })
//       .isIn(Status),
//     check("password", "Password must be at least 8 characters long").isLength({
//       min: 8,
//     }),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { firstName, lastName, username, password, role, status } = req.body;

//     try {


//       // See if user exists
//       let user = await User.findOne({ username });
//       if (user) {
//         return res
//           .status(400)
//           .json({ errors: [{ msg: "Username already exists" }] });
//       }
//       const avatar = gravatar.url(username, {
//         s: "200",
//         r: "pg",
//         d: "mm",
//       });

//       user = new User({
//         firstName,
//         lastName,
//         username,
//         password,
//         avatar,
//         role: "USER",
//         status: "STANDBY",
  
//       });


//      /* var x = false;
//       if (!x) {
//         user = new User({
//           firstName,
//           lastName,
//           username,
//           password,
//           avatar,
//           role: "ADMIN",
//           status: undefined,
//         }); 
//         x=true;
//       } else 
//       {user = new User({
//         firstName,
//         lastName,
//         username,
//         password,
//         avatar,
//         role: "USER",
//         status: undefined,
//       });
    
//       }*/

//      // Get users gravatar
//      /* const avatar = gravatar.url(username, {
//         s: "200",
//         r: "pg",
//         d: "mm",
//       });
//       user = new User({
//         firstName,
//         lastName,
//         username,
//         password,
//         avatar,
//         role: undefined,
//         status: undefined,
//       }); */
      
//       /*let a = User.findOne({ role }) ;
     
//        if (a == "ADMIN") 
//           {
//          user.role = "USER";
//           }
//      */
      
//       // Encrypt password
//       const salt = await bcrypt.genSalt(10);
//       user.password = await bcrypt.hash(password, salt);
//       user = await user.save();
//       // return res.send("user registred");
//       // Return jsonwebtoken
//       const payload = {
//         user: {
//           id: user.id,
//           role: user.role,
//         },
//       };

//       jwt.sign(
//         payload,
//         config.get("jwtSecret"),
//         { expiresIn: 360000 },
//         (err, token) => {
//           if (err) throw err;
//           res.json({ token });
//         }
//       );
//     ///////////////////////////////////////////////////////////////////////LOG
//       userLog.info(
//         'User Created!',
//        {
//         FirstName: `${user.firstName}`,
//         LastName: `${user.lastName}`,
//         Username: `${user.username}`,
//         UserID: `${user._id}`,
//         Password: `${user.password}`,
//         Avatar: `${user.avatar}`
//       });
//     ////////////////////////////////////////////////////////////////////////LOG
    
//     } catch (err) {
//       console.error(err.message);
//       return res.status.send("Server error");
//     }
//   }

// );