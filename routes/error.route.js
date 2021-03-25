const express = require("express");
const router = express.Router();
const httpError = require("http-errors");

router.use('*', (req, res) => {
  res.render('404')
})
  

  module.exports = router;