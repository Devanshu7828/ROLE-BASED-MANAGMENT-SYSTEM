function userControoler() {
  return {
    profile(req, res) {
      res.render("./user/manageUser");
    },
    userProfile(req, res) {
      const person = req.user;
      res.render("./user/profile",{person});
    },
  };
}

module.exports = userControoler;
