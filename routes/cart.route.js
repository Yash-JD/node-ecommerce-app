const express = require("express");
const router = express.Router();

const { checkAuth, isUser } = require("../middlewares/auth.middleware");
const {
  getAllItems,
  addItem,
  deleteItemById,
  updateItemQuantity,
  getItemById,
} = require("../controllers/cart.controller");

router
  .route("/")
  .get(checkAuth, getAllItems)
  .post(checkAuth, isUser, addItem)
  .delete(checkAuth, isUser, deleteItemById);

router
  .route("/:id")
  .get(checkAuth, isUser, getItemById)
  .patch(checkAuth, isUser, updateItemQuantity);

module.exports = router;
