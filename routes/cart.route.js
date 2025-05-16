const express = require("express");
const { checkAuth, isUser } = require("../middlewares/auth.middleware");
const {
  getAllItems,
  addItem,
  deleteItemById,
  updateItemQuantity,
  getItemById,
} = require("../controllers/cart.controller");
const router = express.Router();

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
