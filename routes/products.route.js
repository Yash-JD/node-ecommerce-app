const express = require("express");
const {
  getAllProducts,
  updateProduct,
  deleteProduct,
  addProduct,
  getProductById,
} = require("../controllers/products.controller");
const { checkAuth } = require("../middlewares/auth.middleware");
const router = express.Router();

router.route("/").get(getAllProducts).post(checkAuth, addProduct);
router
  .route("/:id")
  .get(getProductById)
  .patch(checkAuth, updateProduct)
  .delete(checkAuth, deleteProduct);

module.exports = router;
