const express = require("express");
const router = express.Router();
const userControoler = require("../controoler/user.controoler");


router.get("/manageUser", userControoler().profile);
router.get("/profile",userControoler().userProfile);

module.exports = router;
