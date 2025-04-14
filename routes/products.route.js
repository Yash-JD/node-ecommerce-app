const express = require("express");
const {
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  addProduct,
} = require("../controllers/products.controller");
const { checkAuth } = require("../middlewares/auth.middleware");
const router = express.Router();

router.route("/").get(getAllProducts).post(checkAuth, addProduct);
router
  .route("/:id")
  .get(getProduct)
  .patch(checkAuth, updateProduct)
  .delete(checkAuth, deleteProduct);

module.exports = router;
