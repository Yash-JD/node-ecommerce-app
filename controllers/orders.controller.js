const db = require("../config/db");

module.exports.getAllOrders = async (req, res) => {
  try {
    const personId = req.user.id;
    const { role } = req.user;

    // let query = "";
    // if (role == "seller") {
    //   const query =
    //     "SELECT orders.id, products.name as product_name, products.description, products.price, orders.total_amount FROM ((orders INNER JOIN orderDetails ON orders.id = orderDetails.order_id) INNER JOIN products ON orderDetails.product_id = products.id) WHERE orders.user_id=?";
    // }

    // for user
    const query =
      "SELECT id, total_amount FROM orders WHERE user_id=? AND status='complete'";

    const [data] = await db.query(query, [personId]);

    const orderDetail = [];

    for (const order of data) {
      const productOrdered = [];
      const [data2] = await db.query(
        "select product_id, quantity, shipping_address_id from orderDetails where order_id=?",
        [order.id]
      );

      for (const product of data2) {
        const [data3] = await db.query(
          "select name, price from products where id=?",
          [product.product_id]
        );

        productOrdered.push({
          ...data3[0],
          quantity_ordered: product.quantity,
        });
      }

      let shipping_address = null;
      if (data2.length > 0) {
        const [data4] = await db.query(
          "select user_name, house_no, street_name, city, state, pincode from address where id=?",
          [data2[0].shipping_address_id]
        );
        shipping_address = data4[0];
      }

      orderDetail.push({
        ...order,
        products_ordered: productOrdered,
        shipping_address: shipping_address,
      });
    }

    return res.status(200).send({
      success: true,
      orderDetails: orderDetail,
    });

    // const [data] = await db.query(query, [personId]);

    // if (data.length > 0) {
    //   return res.status(200).send({
    //     orders: data,
    //   });
    // } else {
    //   return res.status(404).send({
    //     message: "No orders placed yet!",
    //   });
    // }
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

    // check if order is already placed ?
    const [isOrderPlaced] = await db.query(
      "SELECT id, total_amount FROM orders WHERE user_id=? AND total_amount=?",
      [userId, total_amount]
    );

    if (isOrderPlaced.length > 0) {
      const [isOrderPlaced2] = await db.query(
        "SELECT * FROM orderDetails WHERE order_id=?",
        [isOrderPlaced[0].id]
      );

      if (isOrderPlaced2.length == products.length) {
        return res.send({
          orderDetails: isOrderPlaced[0],
          success: false,
          message: "order already placed",
        });
      }
    }

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
      success: true,
      orderDetails: order.insertId,
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

module.exports.updateBIllingAddress = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { addressId } = req.body;

    await db.query(
      "UPDATE orderDetails SET shipping_address_id=? WHERE order_id=?",
      [addressId, orderId]
    );

    return res.status(200).send({
      message: "Billing address updated successfully.",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Cannot update billing address, please try again later.",
    });
  }
};
