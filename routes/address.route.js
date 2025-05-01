const express = require("express");
const router = express.Router();

const {
  addAddress,
  editAddress,
  deleteAddress,
} = require("../controllers/address.controller");
const { isUser, checkAuth } = require("../middlewares/auth.middleware");

router.route("/address").post(checkAuth, isUser, addAddress);

router
  .route("/address/:id")
  .patch(checkAuth, isUser, editAddress)
  .delete(checkAuth, isUser, deleteAddress);

module.exports = router;
