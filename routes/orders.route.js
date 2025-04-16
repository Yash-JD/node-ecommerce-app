const express = require("express");
const { getAllOrders } = require("../controllers/orders.controller");
const { checkAuth } = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/", checkAuth, getAllOrders);
router.post("/:id");

module.exports = router;
