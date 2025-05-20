const express = require("express");
const {
  getAllProducts,
  updateProduct,
  deleteProduct,
  addProduct,
  getProductById,
  getAllCategories,
} = require("../controllers/products.controller");

const {
  checkAuth,
  isSeller,
  checkSellerProducts,
} = require("../middlewares/auth.middleware");

const router = express.Router();
const upload = require("../config/multerStorage");

router.get("/categories", checkAuth, isSeller, getAllCategories);

router
  .route("/")
  .get(checkAuth, getAllProducts)
  .post(checkAuth, isSeller, upload, addProduct);

router
  .route("/:id")
  .get(checkAuth, getProductById)
  .patch(checkAuth, isSeller, checkSellerProducts, upload, updateProduct)
  .delete(checkAuth, isSeller, checkSellerProducts, deleteProduct);

module.exports = router;
