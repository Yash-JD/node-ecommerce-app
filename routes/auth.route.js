const express = require("express");
const {
  signup,
  login,
  logout,
  verifyOTP,
} = require("../controllers/auth.controller");
const { checkAuth, checkLogin } = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/signup", checkLogin, signup);
router.post("/login", checkLogin, login);
router.post("/logout", checkAuth, logout);
router.post("/verify-otp", verifyOTP);

module.exports = router;
