const db = require("../config/db");

module.exports.getAllOrders = async (req, res) => {
  try {
    const limit = parseInt(req.body.limit) || 5;
    const personId = req.user.id;
    const { role } = req.user;

    let query = "";
    if (role == "user") {
      query +=
        "SELECT orders.id, products.name as product_name, products.description, products.price, products.imageUrl, orders.quantity, orders.total_amount FROM ((orders INNER JOIN users ON orders.user_id = users.id) INNER JOIN products ON orders.product_id = products.id) WHERE orders.user_id=? LIMIT ?";
    } else {
      query +=
        "SELECT orders.id, users.name as user_name, products.name as product_name, products.description, products.price, products.imageUrl, orders.quantity, orders.total_amount FROM ((orders INNER JOIN users ON orders.user_id = users.id) INNER JOIN products ON orders.product_id = products.id) WHERE orders.seller_id=? LIMIT ?;";
    }

    const [data] = await db.query(query, [personId, limit]);

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
      message: "Error executing query, please try again later.",
    });
  }
};

module.exports.postOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const [data] = await db.query(
      "SELECT price, seller_id, quantity FROM products WHERE id=?",
      [productId]
    );
    const total_amount = quantity * data[0].price;

    await db
      .query(
        "INSERT INTO orders(user_id, quantity, total_amount, product_id, seller_id) VALUES (?,?,?,?,?)",
        [userId, quantity, total_amount, productId, data[0].seller_id]
      )
      .then(async () => {
        // update quantity in products
        const left_quantity = data[0].quantity - quantity;
        left_quantity < 0 ? 0 : left_quantity;

        await db
          .execute("UPDATE products SET quantity=? WHERE id=?", [
            left_quantity,
            productId,
          ])
          .then(() => {
            return res.status(201).send({
              message: "Order placed successfully.",
            });
          });
      })
      .catch(() => {
        return res
          .status(400)
          .send({ message: "Error in executing postOrder query." });
      });
  } catch (error) {
    return res.status(500).send({
      message: "Cannot place order, please try again later.",
    });
  }
};

module.exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.body;
    const { id } = req.user;

    const query =
      "SELECT orders.id, products.name as product_name, products.description, products.price, products.imageUrl, products.quantity, orders.quantity, orders.total_amount FROM ((orders INNER JOIN users ON orders.user_id = users.id) INNER JOIN products ON orders.product_id = products.id) WHERE orders.id=? AND orders.user_id=?";

    const [data] = await db.query(query, [orderId, id]);

    if (data.length > 0) {
      return res.status(200).send({
        orders: data,
      });
    } else {
      return res.status(404).send({
        message: "No such order placed yet!",
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: "Error executing query, please try again later.",
    });
  }
};

module.exports.deleteOrderById = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user.id;

    //first get quantity from orders
    const [data] = await db.execute(
      "SELECT quantity, product_id FROM orders WHERE id=? AND user_id=?",
      [orderId, userId]
    );

    await db
      .execute("DELETE FROM orders WHERE id=? AND user_id=?", [orderId, userId])
      .then(async () => {
        // update quantity in products
        await db
          .execute("UPDATE products SET quantity=? WHERE id=?", [
            data[0].quantity,
            data[0].product_id,
          ])
          .then(() => {
            return res.status(200).send({
              message: "Order deleted successfully.",
            });
          })
          .catch((err) => res.status(400).send({ msg: err }));
      });
  } catch (error) {
    return res.status(500).json({
      message: "Cannot delete order, please try again later",
    });
  }
};
