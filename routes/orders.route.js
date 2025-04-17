const express = require("express");
const {
  getAllOrders,
  postOrder,
  getUserOrdersById,
  deleteOrderById,
} = require("../controllers/orders.controller");
const {
  checkAuth,
  checkSellerRole,
  checkUserRole,
} = require("../middlewares/auth.middleware");
const router = express.Router();

router
  .route("/")
  .get(checkAuth, checkSellerRole, getAllOrders)
  .post(checkAuth, checkUserRole, postOrder);

router.get("/:id", checkAuth, checkUserRole, getUserOrdersById);

router.delete("/:id", checkAuth, checkUserRole, deleteOrderById);

module.exports = router;
