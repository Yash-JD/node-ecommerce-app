const express = require("express");
const router = express.Router();

const { checkAuth, isUser } = require("../middlewares/auth.middleware");

const {
  makePayment,
  renderProductPage,
  addPaymentToDB,
} = require("../controllers/payment.controller");

// router.get("/", renderProductPage);
router.post("/createOrder", checkAuth, makePayment);
router.post("/paymentSuccess", checkAuth, addPaymentToDB);

module.exports = router;
