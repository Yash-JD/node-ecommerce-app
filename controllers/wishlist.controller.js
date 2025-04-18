const db = require("../config/db");

module.exports.getAllWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    await db
      .execute(
        "SELECT wishlist.id, products.name, products.description, products.price, products.imageUrl FROM wishlist INNER JOIN products ON wishlist.product_id = products.id WHERE wishlist.user_id=?",
        [userId]
      )
      .then(([result]) => {
        return res.status(200).send({ Wishlist: result });
      })
      .catch((error) => {
        return res
          .status(400)
          .send({ message: "Error in getAllWishlist query execution." });
      });
  } catch (error) {
    return res.status(500).send({
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
      return res.status(406).send({ message: "Product already in wishlist" });

    await db
      .execute("INSERT INTO wishlist(product_id, user_id) VALUES (?,?)", [
        productId,
        userId,
      ])
      .then(() => {
        return res.status(201).send({ message: "Product added to wishlist." });
      })
      .catch((error) => {
        return res
          .status(400)
          .send({ message: "Error in addToWishlist query execution." });
      });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to add to wishlist. Please try again later.",
    });
  }
};

module.exports.deleteWishlistById = async (req, res) => {
  try {
    const { wishlistId } = req.body;
    const userId = req.user.id;

    await db
      .execute("DELETE FROM wishlist WHERE user_id=? AND id=?", [
        userId,
        wishlistId,
      ])
      .then(() => {
        return res.status(201).send({ message: "Wishlist deleted." });
      })
      .catch((error) => {
        return res
          .status(400)
          .send({ message: "Error in deleteWishlistById query execution." });
      });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to add to wishlist. Please try again later.",
    });
  }
};
