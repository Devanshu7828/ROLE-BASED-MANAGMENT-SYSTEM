const LocalStatergy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const passport = require("passport");

function init(passport) {
  passport.use(
    new LocalStatergy(
      { usernameField: "email" },
      async (email, password, done) => {
        // Login
        // Check if email exist in db

        const user = await User.findOne({ email: email });

        if (!user) {
          return done(null, false, {
            message: "No User Found With This ID",
          });
        }

        // bcrypt
        //   .compare(password, user.password)
        //   .then((match) => {
        //     if (match) {
        //       return done(null, user, { message: "Logged in succesfully" });
        //     }
        //     return done(null, false, { message: "Wrong Details" });
        //   })
        //   .catch((err) => {
        //     return done(null, false, { message: "Something went wrong!" });
        //   });
        const isvalid = await user.validPassword(password);
        if (isvalid) {
          const token = await user.generateToken();
          return done(null, user, { message: "Logged in succesfully" });
        } else {
          return done(null, false, { message: "Wrong Details" });
        }
      }
    )
  );

  // This method store user id in session after sucessfully logged in
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    // when we do req.user we get login user the user
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}

module.exports = init;
