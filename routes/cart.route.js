const express = require("express");
const { checkAuth, isUser } = require("../middlewares/auth.middleware");
const {
  getAllItems,
  addItem,
  deleteItemById,
  updateItemQuantity,
} = require("../controllers/cart.controller");
const router = express.Router();

router.route("/").get(checkAuth, getAllItems).post(checkAuth, isUser, addItem);

router
  .route("/:id")
  .patch(checkAuth, isUser, updateItemQuantity)
  .delete(checkAuth, isUser, deleteItemById);

module.exports = router;
