const express = require("express");
const router = express.Router();
const adminControoler = require('../controoler/admin.controoler')


router.get('/users',adminControoler().allUsers)
router.get('/user/:id',adminControoler().specificUser)
router.post('/update-role',adminControoler().updateRole)
router.get('/user/delete/:id',adminControoler().deleteUser)

module.exports = router;
