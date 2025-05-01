const express = require("express");
const { checkAuth, checkUserRole } = require("../middlewares/auth.middleware");
const {
  getAllItems,
  addItem,
  deleteItemById,
  updateItemQuantity,
} = require("../controllers/cart.controller");
const router = express.Router();

router
  .route("/")
  .get(checkAuth, getAllItems)
  .post(checkAuth, checkUserRole, addItem);

router
  .route("/:id")
  .patch(checkAuth, checkUserRole, updateItemQuantity)
  .delete(checkAuth, checkUserRole, deleteItemById);

module.exports = router;
