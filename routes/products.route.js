const express = require("express");
const {
  getAllProducts,
  updateProduct,
  deleteProduct,
  addProduct,
  getProductById,
} = require("../controllers/products.controller");
const {
  checkAuth,
  checkRole,
  checkSellerProducts,
} = require("../middlewares/auth.middleware");
const router = express.Router();

router.route("/").get(getAllProducts).post(checkAuth, checkRole, addProduct);
router
  .route("/:id")
  .get(getProductById)
  .patch(checkAuth, checkRole, checkSellerProducts, updateProduct)
  .delete(checkAuth, checkRole, checkSellerProducts, deleteProduct);

module.exports = router;
