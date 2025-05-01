const express = require("express");
const {
  getAllOrders,
  postOrder,
  deleteOrderById,
  getOrderById,
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
  .delete(checkAuth, isUser, deleteOrderById);

module.exports = router;
