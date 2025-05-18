const db = require("../config/db");

module.exports.getAllOrders = async (req, res) => {
  try {
    const personId = req.user.id;
    const { role } = req.user;

    let query = "";
    if (role == "user") {
      query +=
        "SELECT orders.id, products.name as product_name, products.description, products.price, orders.quantity, orders.total_amount FROM ((orders INNER JOIN users ON orders.user_id = users.id) INNER JOIN products ON orders.product_id = products.id) WHERE orders.user_id=?";
    } else {
      query +=
        "SELECT orders.id, users.name as user_name, products.name as product_name, products.description, products.price, orders.quantity, orders.total_amount FROM ((orders INNER JOIN users ON orders.user_id = users.id) INNER JOIN products ON orders.product_id = products.id) WHERE orders.seller_id=?;";
    }

    const [data] = await db.query(query, [personId]);

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
    const { products } = req.body;
    const userId = req.user.id;

    const total_amount = products.reduce((total, product) => {
      return parseInt(product.price) * product.quantity + total;
    }, 0);

    // // check if order is already placed ?
    // const [isOrderPlaced] = await db.query(
    //   "SELECT id FROM orders WHERE user_id=? AND total_amount=?",
    //   [userId, total_amount]
    // );

    // if (isOrderPlaced.length > 0) {
    //   return res
    //     .status(400)
    //     .send({ success: false, message: "order already placed" });
    // }

    // get orderId
    const [order] = await db.query(
      "INSERT INTO orders(user_id, total_amount) VALUES (?,?)",
      [userId, total_amount]
    );

    // then insert all products with orderId
    products.forEach(
      async (item) =>
        await db.query(
          "INSERT INTO orderDetails(order_id, product_id, quantity) VALUES (?,?,?)",
          [order.insertId, item.id, item.quantity]
        )
    );

    // get total quantity from products
    let quanities = [];
    for (let i = 0; i < products.length; i++) {
      let [data] = await db.query("SELECT quantity FROM products WHERE id=?", [
        products[i].id,
      ]);
      quanities.push(data[0].quantity);
    }

    // update quantity in products
    for (let i = 0; i < products.length; i++) {
      let left_quantity = quanities[i] - products[i].quantity;
      left_quantity = left_quantity < 0 ? 0 : left_quantity;
      await db.execute("UPDATE products SET quantity=? WHERE id=?", [
        left_quantity,
        products[i].id,
      ]);
    }

    return res.status(201).send({
      message: "Checkout successfully.",
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
          .catch((err) => res.status(400).send({ message: err }));
      });
  } catch (error) {
    return res.status(500).json({
      message: "Cannot delete order, please try again later",
    });
  }
};
