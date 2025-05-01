const express = require("express");
const { checkAuth, isUser } = require("../middlewares/auth.middleware");
const {
  getAllWishlist,
  addToWishlist,
  deleteWishlistById,
} = require("../controllers/wishlist.controller");
const router = express.Router();

router
  .route("/")
  .get(checkAuth, isUser, getAllWishlist)
  .post(checkAuth, isUser, addToWishlist);
router.delete("/:id", checkAuth, isUser, deleteWishlistById);

module.exports = router;
