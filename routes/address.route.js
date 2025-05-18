const express = require("express");
const router = express.Router();

const {
  addAddress,
  editAddress,
  deleteAddress,
  getAllAddress,
} = require("../controllers/address.controller");
const { isUser, checkAuth } = require("../middlewares/auth.middleware");

router
  .route("/")
  .get(checkAuth, isUser, getAllAddress)
  .post(checkAuth, isUser, addAddress);

router
  .route("/:id")
  .patch(checkAuth, isUser, editAddress)
  .delete(checkAuth, isUser, deleteAddress);

module.exports = router;
