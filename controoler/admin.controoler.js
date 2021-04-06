const User = require("../models/user.model");
const mongoose = require("mongoose");
const { roles } = require("../utils/constant");


function userControoler() {
  return {
    async allUsers(req, res) {
      try {
        const users = await User.find();

        res.render("./user/manageUser", { users });
      } catch (error) {
        console.log(error);
      }
    },
    async specificUser(req, res) {
      try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
          req.flash("error", "Invalid Id");
          res.redirect("/admin/users");
          return;
        }

        const person = await User.findById(id);
        console.log(person);
        res.render("./user/profile", { person });
      } catch (error) {
        console.log(error);
      }
    },
    async updateRole(req, res) {
      console.log(req.body);

      const { id, role } = req.body;

      // // CHECKING FOR ID AND ROLE IN REQ BODY
      if (!id || !role) {
        req.flash("error", "Invalid Request");
        return res.redirect("back");
      }

      // // CHECK FOR VALID MONGOOSE OBJECT ID

      if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash("error", "Invalid id");
        res.redirect("back");
        return;
      }
      // CHECK FOR VALID ROLE
      const rolesArray = Object.values(roles);
      if (!rolesArray.includes(role)) {
        req.flash("error", "Invalid Role");
        res.redirect("back");
        return;
      }
      // ADMIN CANT REMOVE HIMSELF AS AN ADMIN
      if (req.user.id === id) {
        req.flash("error", "Admin Cant Remove them self from Admin");
        res.redirect("back");
        return;
      }
      // FINALLY UPDATE THE USER
      const user = await User.findByIdAndUpdate(
        id,
        { role: role },
        { new: true, runValidators: true }
      );

      req.flash("info", `update role for ${user.email}to ${user.role}`);
      res.redirect("back");
    },
    async deleteUser(req, res) {
     try {
       
       const { id } = req.params;
       User.deleteOne({ _id: id }).then((result) => {
        req.flash('deleted','User Deleted ')
         res.redirect('back')
       }).catch((err) => {
         console.log('Unable to delete:- ',err);
       })
     } catch (error) {
       console.log(error);
     }
     

    }
  };
}

module.exports = userControoler;
