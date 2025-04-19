const express = require("express");
const { checkAuth, checkUserRole } = require("../middlewares/auth.middleware");
const {
  addAddress,
  editAddress,
  deleteAddress,
} = require("../controllers/payment.controller");
const router = express.Router();

router.route("/address").post(checkAuth, checkUserRole, addAddress);
router
  .route("/address/:id")
  .patch(checkAuth, checkUserRole, editAddress)
  .delete(checkAuth, checkUserRole, deleteAddress);

// router.route("/payment").get(checkPaymentStatus).post(makePayment);

module.exports = router;
