const express = require("express");
const router = express.Router();
const authControoler = require("../controoler/auth.controoler");
const {guest} = require("../middleware/guest");

router.get("/login", guest, authControoler().prelogin);
router.get("/register", guest, authControoler().preregister);
router.post("/login", authControoler().postlogin);
router.post("/register", authControoler().postregister);

router.get("/logout", authControoler().logout);

module.exports = router;
