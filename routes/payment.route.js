const express = require("express");
const { checkAuth, isUser } = require("../middlewares/auth.middleware");
const {
  addAddress,
  editAddress,
  deleteAddress,
} = require("../controllers/address.controller");
const {
  checkPaymentStatus,
  makePayment,
} = require("../controllers/payment.controller");
const router = express.Router();

// address route
router.route("/address").post(checkAuth, isUser, addAddress);
router
  .route("/address/:id")
  .patch(checkAuth, isUser, editAddress)
  .delete(checkAuth, isUser, deleteAddress);

// payment route
router
  .route("/payment")
  .get(checkPaymentStatus)
  .post(checkAuth, isUser, makePayment);

module.exports = router;
