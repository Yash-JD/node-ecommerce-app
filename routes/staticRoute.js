const express = require("express");
const { checkAuth, checkLogin } = require("../middlewares/auth");
const router = express.Router();

router.get("/products", checkAuth, (req, res) => {
  return res.render("home", req);
});

router.get("/home", checkAuth, (req, res) => {
  return res.render("home", req);
});

router.get("/signup", checkLogin, (req, res) => {
  return res.render("signup");
});

router.get("/login", checkLogin, (req, res) => {
  return res.render("login");
});

module.exports = router;
