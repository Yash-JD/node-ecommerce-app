const express = require("express");
const {
  getAllOrders,
  postOrder,
  deleteOrderById,
  getOrderById,
  updateBIllingAddress,
} = require("../controllers/orders.controller");
const { checkAuth, isUser } = require("../middlewares/auth.middleware");
const router = express.Router();

router
  .route("/")
  .get(checkAuth, getAllOrders)
  .post(checkAuth, isUser, postOrder);

router
  .route("/:id")
  .get(checkAuth, isUser, getOrderById)
  .patch(checkAuth, isUser, updateBIllingAddress)
  .delete(checkAuth, isUser, deleteOrderById);

module.exports = router;
