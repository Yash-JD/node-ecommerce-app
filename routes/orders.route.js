const express = require("express");
const {
  getAllOrders,
  postOrder,
  deleteOrderById,
  getOrderById,
} = require("../controllers/orders.controller");
const { checkAuth, checkUserRole } = require("../middlewares/auth.middleware");
const router = express.Router();

router
  .route("/")
  .get(checkAuth, getAllOrders)
  .post(checkAuth, checkUserRole, postOrder);

router
  .route("/:id")
  .get(checkAuth, checkUserRole, getOrderById)
  .delete(checkAuth, checkUserRole, deleteOrderById);

module.exports = router;
