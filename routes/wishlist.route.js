const express = require("express");
const { checkAuth, checkUserRole } = require("../middlewares/auth.middleware");
const {
  getAllWishlist,
  addToWishlist,
  deleteWishlistById,
} = require("../controllers/wishlist.controller");
const router = express.Router();

router
  .route("/")
  .get(checkAuth, checkUserRole, getAllWishlist)
  .post(checkAuth, checkUserRole, addToWishlist);
router.delete("/:id", checkAuth, checkUserRole, deleteWishlistById);

module.exports = router;
