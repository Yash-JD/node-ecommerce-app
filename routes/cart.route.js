const express = require("express");
const router = express.Router();

const { checkAuth, isSeller } = require("../middlewares/auth.middleware");
const {
  getAllItems,
  addItem,
  deleteItemById,
  updateItemQuantity,
} = require("../controllers/cart.controller");

router
  .route("/")
  .get(checkAuth, getAllItems)
  .post(checkAuth, isSeller, addItem);

router
  .route("/:id")
  .patch(checkAuth, isSeller, updateItemQuantity)
  .delete(checkAuth, isSeller, deleteItemById);

module.exports = router;
