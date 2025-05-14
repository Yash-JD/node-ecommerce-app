const express = require("express");
const { checkAuth, isUser } = require("../middlewares/auth.middleware");
const {
  getAllWishlist,
  addToWishlist,
  deleteWishlistById,
  findInWishlistByProductId,
} = require("../controllers/wishlist.controller");
const router = express.Router();

router
  .route("/")
  .get(checkAuth, isUser, getAllWishlist)
  .post(checkAuth, isUser, addToWishlist)
  .delete(checkAuth, isUser, deleteWishlistById);

router.get("/:id", checkAuth, isUser, findInWishlistByProductId);

module.exports = router;
