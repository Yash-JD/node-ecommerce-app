const db = require("../config/db");
const { fetchImages, mergeImagesWithProducts } = require("../utils/helpers");

module.exports.getAllItems = async (req, res) => {
  try {
    const userId = req.user.id;

    const [data] = await db.query(
      "SELECT cart.id AS cart_id, cart.product_id AS id, products.name, products.description, products.price, cart.quantity FROM cart INNER JOIN products ON cart.product_id = products.id WHERE cart.user_id=?",
      [userId]
    );

    if (data.length > 0) {
      const images = await fetchImages(data); // if products exists then get all their images
      // merge image-urls with result
      mergeImagesWithProducts(data, images);
      return res.status(200).send({ success: true, data: data });
    } else {
      return res
        .status(404)
        .send({ success: false, message: "NO product found" });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Unable to find items in cart. Internal server error.",
    });
  }
};

module.exports.addItem = async (req, res) => {
  try {
    const { productId } = req.body;

    // first check if prouct is already in cart
    const [data] = await db.execute(
      "SELECT * FROM cart WHERE cart.product_id=?",
      [productId]
    );

    if (data.length > 0) {
      return res.status(400).send({
        success: false,
        message: "Product already exists in cart.",
      });
    } else {
      const userId = req.user.id;
      await db
        .execute("INSERT INTO cart(user_id,product_id) VALUES(?,?)", [
          userId,
          productId,
        ])
        .then(() => {
          return res
            .status(201)
            .send({ success: true, message: "Product added to cart" });
        })
        .catch((err) => {
          return res.status(400).send({ success: false, message: err.message });
        });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Unable to add items to cart. Internal server error.",
    });
  }
};

module.exports.updateItemQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const productId = req.params.id;
    const userId = req.user.id;

    await db
      .query("UPDATE cart SET quantity=? WHERE user_id=? AND product_id=?", [
        quantity,
        userId,
        productId,
      ])
      .then(() => {
        return res
          .status(200)
          .send({ success: true, message: "Quantity updated." });
      })
      .catch((err) => {
        return res.status(500).send({ success: false, message: err.message });
      });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Unable to update items to cart. Internal server error.",
    });
  }
};

module.exports.deleteItemById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    // check if user product exists in cart
    const [data] = await db.execute(
      "SELECT id FROM cart WHERE user_id=? AND product_id=?",
      [userId, productId]
    );

    if (data.length == 0) {
      return res.status(400).send({
        success: false,
        message: "No such product found in cart to delete.",
      });
    } else {
      await db
        .execute("DELETE FROM cart WHERE user_id=? AND product_id=?", [
          userId,
          productId,
        ])
        .then(() => {
          return res
            .status(200)
            .send({ success: true, message: "Product removed from cart." });
        })
        .catch((err) => {
          return res.status(400).send({ success: false, message: err.message });
        });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Unable to delete items to cart. Internal server error.",
    });
  }
};

module.exports.getItemById = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;

    const [data] = await db.query(
      "SELECT id AS wishlist_id, product_id AS id, user_id FROM cart WHERE user_id=? AND product_id=?",
      [userId, productId]
    );

    if (data.length > 0) {
      const images = await fetchImages(data); // if products exists then get all their images
      const product = mergeImagesWithProducts(data, images);
      return res.status(200).send({ success: true, product: product });
    } else {
      return res.send({ success: false, message: "NO product found" });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Unable to fetch items from cart. Internal server error.",
    });
  }
};
