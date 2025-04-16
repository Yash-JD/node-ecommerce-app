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
  checkSellerRole,
  checkSellerProducts,
} = require("../middlewares/auth.middleware");

const router = express.Router();
const upload = require("../config/multerStorage");

router
  .route("/")
  .get(getAllProducts)
  .post(
    checkAuth,
    checkSellerRole,
    (req, res, next) => {
      upload(req, res, (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        next(); // Proceed to addProduct
      });
    },
    addProduct
  );

// .get(getAllProducts)
router
  .route("/:id")
  .get(getProductById)
  .patch(
    checkAuth,
    checkSellerRole,
    checkSellerProducts,
    (req, res, next) => {
      upload(req, res, (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        next(); // Proceed to updateProduct
      });
    },
    updateProduct
  )
  .delete(checkAuth, checkSellerRole, checkSellerProducts, deleteProduct);

module.exports = router;
