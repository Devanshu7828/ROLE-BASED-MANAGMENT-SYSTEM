const express = require("express");
const router = express.Router();
const httpError = require("http-errors");

router.get("/", (req, res) => {
  res.render("homepage");
});

module.exports = router;
