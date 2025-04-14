const express = require("express");
const {
  getAllProducts,
  updateProduct,
  deleteProduct,
  addProduct,
  getProductById,
} = require("../controllers/products.controller");
const { checkAuth, checkRole } = require("../middlewares/auth.middleware");
const router = express.Router();

router.route("/").get(getAllProducts).post(checkAuth, checkRole, addProduct);
router
  .route("/:id")
  .get(getProductById)
  .patch(checkAuth, checkRole, updateProduct)
  .delete(checkAuth, checkRole, deleteProduct);

module.exports = router;
