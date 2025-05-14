const db = require("../config/db");
const { fetchImages, mergeImagesWithProducts } = require("../utils/helpers");

module.exports.getAllWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const [result] = await db
      .execute(
        "SELECT wishlist.id, products.id, products.name, products.description, products.price,products.quantity FROM wishlist INNER JOIN products ON wishlist.product_id = products.id WHERE wishlist.user_id=?",
        [userId]
      )
      .catch((error) => {
        return res.status(400).send({
          success: false,
          message: "Error in getAllWishlist query execution.",
        });
      });

    if (result.length > 0) {
      const images = await fetchImages(result); // if products in wishlist exists then get all their images

      // merge image-urls with result
      const products = mergeImagesWithProducts(result, images);

      return res.status(200).send({
        success: true,
        wishlist: result,
      });
    } else {
      res
        .status(404)
        .send({ success: false, message: "No such product exists." });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Unable to get wishlist. Please try again later.",
    });
  }
};

module.exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    // check if product is already in wishlist
    const [data] = await db.execute(
      "SELECT id from wishlist WHERE product_id=? AND user_id=?",
      [productId, userId]
    );

    if (data.length > 0)
      return res
        .status(406)
        .send({ success: true, message: "Product already in wishlist" });

    await db
      .execute("INSERT INTO wishlist(product_id, user_id) VALUES (?,?)", [
        productId,
        userId,
      ])
      .then(() => {
        return res
          .status(201)
          .send({ success: true, message: "Product added to wishlist." });
      })
      .catch((error) => {
        return res.status(400).send({
          success: false,
          message: "Error in addToWishlist query execution.",
        });
      });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Unable to add to wishlist. Please try again later.",
    });
  }
};

module.exports.deleteWishlistById = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    await db
      .execute("DELETE FROM wishlist WHERE product_id=? AND user_id=?", [
        productId,
        userId,
      ])
      .then(() => {
        return res
          .status(201)
          .send({ success: true, message: "Wishlist deleted." });
      })
      .catch((error) => {
        return res.status(400).send({
          success: false,
          message: "Error in deleteWishlistById query execution.",
        });
      });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Unable to add to wishlist. Please try again later.",
    });
  }
};

module.exports.findInWishlistByProductId = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;

    // check if product is in wishlist
    const [data] = await db.execute(
      "SELECT id from wishlist WHERE product_id=? AND user_id=?",
      [productId, userId]
    );

    if (data.length > 0)
      return res.status(200).send({ success: true, product: data });
    else {
      return res.status(404).send({
        success: false,
        message: "Product not found in wishlist",
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Unable to find product in wishlist. Please try again later.",
    });
  }
};
