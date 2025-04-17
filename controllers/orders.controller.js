const db = require("../config/db");

module.exports.getAllOrders = async (req, res) => {
  try {
    const limit = parseInt(req.body.limit) || 5;

    const query =
      "SELECT orders.id, users.name, products.name, products.description, products.price, products.imageUrl, orders.quantity, orders.total_amount FROM ((orders INNER JOIN users ON orders.user_id = users.id) INNER JOIN products ON orders.product_id = products.id) LIMIT ?";

    const [data] = await db.query(query, limit);
    if (data.length > 0) {
      return res.status(200).send({
        orders: data,
      });
    } else {
      return res.status(404).send({
        message: "No orders placed yet!",
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: "Cannot find orders, please try again later.",
    });
  }
};

module.exports.getUserOrders = async (req, res) => {};

module.exports.postOrder = async (req, res) => {
  try {
    const { productId, quantity, total_amount } = req.body;
    const userId = req.user.id;

    const response = await db.query(
      "INSERT INTO orders(user_id, quantity, total_amount, product_id) VALUES (?,?,?,?)",
      [userId, quantity, total_amount, productId]
    );
    res.status(201).send({
      message: "Order placed successfully.",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Cannot place order, please try again later.",
    });
  }
};

module.exports.getOrderById = async (req, res) => {};

module.exports.getUserOrdersById = async (req, res) => {};

module.exports.deleteOrderById = async (req, res) => {};
