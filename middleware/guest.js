const User = require("../models/user.model");
function guest(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }

  return res.redirect("/");
}

function guestUser(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect("/auth/login");
}

async function ensureAdmin(req, res, next) {
  const id = req.user._id;
  const user = await User.findById({ _id: id });

  if (req.user.role === "ADMIN") {
    return next();
  } else {
    req.flash("warning", "You are not Authorized to see this route");
    return res.redirect("/");
  }
}

module.exports = { guest, guestUser, ensureAdmin };
