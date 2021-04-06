const User = require("../models/user.model");
const passport = require("passport");
const bcrypt = require("bcryptjs");

function authControoler() {
  return {
    prelogin(req, res) {
      return res.render("./form/login");
    },
    postlogin(req, res, next) {
      passport.authenticate("local", (err, user, info) => {
        if (err) {
          req.flash("error", info.message);
          return next(err);
        }
        if (!user) {
          req.flash("error", info.message);

          return res.redirect("/auth/login");
        }

        req.login(user, (err) => {
          if (err) {
            req.flash("error", info.message);
            return next(err);
          }
          const token = user.generateToken();
          res.cookie("jwt", token, {
            httpOnly: true,
          });

          return res.redirect("/");
        });
      })(req, res, next);
    },
    preregister(req, res) {
      res.render("./form/register");
    },
    async postregister(req, res) {
      try {
        const { name, email, password, confirmpassword } = req.body;

        // const doesExist = await User.findOne({ email });
        // // check if user exist
        // if (doesExist) {
        //   res.send("exist");
        //   return;
        // }
        // check if email exist
        User.exists({ email }, async (err, result) => {
          if (result) {
            req.flash("error", "Email alredy taken");
            req.flash("name", name);
            req.flash("email", email);
            return res.redirect("/auth/register");
          }
        });

        if (password === confirmpassword) {
          const user = await new User({
            name,
            email,
            password,
            confirmpassword,
          });

          const token = user.generateToken();

          res.cookie("jwt", token, {
            httpOnly: true,
          });
          await user.save();
          return res.redirect("/auth/login");
        } else {
          req.flash("passwordError", "Password not match");
          return res.redirect("/auth/register");
        }
      } catch (err) {
        console.log(err);
      }
    },
    logout(req, res) {
      req.logout();
      return res.redirect("/");
    },
    
  };
}

module.exports = authControoler;
