const express = require("express");
const { checkAuth, isUser } = require("../middlewares/auth.middleware");

const {
  checkPaymentStatus,
  makePayment,
} = require("../controllers/payment.controller");
const router = express.Router();

router
  .route("/payment")
  .get(checkPaymentStatus)
  .post(checkAuth, isUser, makePayment);

module.exports = router;
