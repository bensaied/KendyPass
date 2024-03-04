const passport = require("passport");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const LocalStrategy = require("passport-local").Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const User = require("./models/User");
const config = require("config");
const bcrypt = require("bcryptjs");

// passport-jwt strategy for protected routes : Admin only
passport.use(
  "admin",
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get("jwtSecret"),
    },
    function (jwt_payload, done) {
      User.findOne(
        { id: jwt_payload.user.id, role: "ADMIN" },
        function (err, user) {
          if (err) {
            return done(null, false);
          }
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
            // or you could create a new account
          }
        }
      );
    }
  )
);
// passport-jwt strategy for protected routes :  user or admin
passport.use(
  "user",
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get("jwtSecret"),
    },
    function (jwt_payload, done) {
      User.findById(jwt_payload.user.id, function (err, user) {
        if (err) {
          return done(null, false);
        }
        //console.log(user.email);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
          // or you could create a new account
        }
      }).select("-password");
    }
  )
);
// passport-local strategy to authenticate users using an username and password
passport.use(
  new LocalStrategy(
    {
      // or whatever you want to use
      usernameField: "username", // define the parameter in req.body that passport can use as username and password
      passwordField: "password",
    },
    function (username, password, done) {
      User.findOne({ username }, async function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false);
        }
        return done(null, user);
      });
    }
  )
);
