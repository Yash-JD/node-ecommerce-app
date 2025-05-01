const db = require("../config/db");

module.exports.getAllItems = async (req, res) => {
  try {
    const userId = req.user.id;

    const [data] = await db.execute(
      "SELECT cart.id,  products.name, products.description, products.price, cart.quantity,  products.imageUrl, users.name AS seller_name FROM ((cart INNER JOIN users ON cart.user_id = users.id) INNER JOIN products ON cart.product_id = products.id) WHERE cart.user_id=?",
      [userId]
    );

    if (data.length > 0) {
      return res.status(200).send({ data: data });
    } else {
      return res.status(404).send({ message: "NO product found" });
    }
  } catch (error) {
    return res.status(500).send({
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
          return res.status(201).send({ message: "Product added to cart" });
        })
        .catch((err) => {
          return res.status(400).send({ message: err.message });
        });
    }
  } catch (error) {
    return res.status(500).send({
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
        return res.status(200).send({ message: "Quantity updated." });
      })
      .catch((err) => {
        return res.status(500).send({ message: err.message });
      });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to update items to cart. Internal server error.",
    });
  }
};

module.exports.deleteItemById = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    // check if user product exists in cart
    const [data] = await db.execute(
      "SELECT id FROM cart WHERE user_id=? AND product_id=?",
      [userId, productId]
    );

    if (data.length == 0) {
      return res
        .status(400)
        .send({ message: "No such product found in cart to delete." });
    } else {
      await db
        .execute("DELETE FROM cart WHERE user_id=? AND product_id=?", [
          userId,
          productId,
        ])
        .then(() => {
          return res
            .status(200)
            .send({ message: "Product removed from cart." });
        })
        .catch((err) => {
          return res.status(400).send({ message: err.message });
        });
    }
  } catch (error) {
    return res.status(500).send({
      message: "Unable to delete items to cart. Internal server error.",
    });
  }
};
