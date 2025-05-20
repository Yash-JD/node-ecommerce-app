const razorpayInstance = require("../config/razorpay");
const db = require("../config/db");

// module.exports.renderProductPage = (req, res) => {
//   res.render("product");
// };

module.exports.makePayment = async (req, res) => {
  try {
    const { userName } = req.body;
    const amount = req.body.amount * 100;
    const { email } = req.user;
    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    razorpayInstance.orders.create(options, async (err, order) => {
      if (!err) {
        res.status(201).send({
          success: true,
          msg: "Order Created",
          order_id: order.id,
          amount: amount,
          key_id: process.env.RAZORPAY_KEY,
          name: userName,
          email: email,
        });
      } else {
        console.log(err);
        res.status(400).send({
          success: false,
          msg: err?.message || "Order creation failed",
        });
      }
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, msg: "Server error: " + error.message });
  }
};

module.exports.addPaymentToDB = async (req, res) => {
  const { payment_id, order_id, db_order_id } = req.body;

  try {
    // Store these values in DB
    await db.execute(
      "INSERT INTO payment(order_id, razorpay_payment_id, razorpay_order_id) VALUES (?, ?, ?)",
      [db_order_id, payment_id, order_id]
    );

    // Update the order status to 'completed' in the orders table
    await db.execute("UPDATE orders SET status = 'complete' WHERE id = ?", [
      db_order_id,
    ]);

    // empty the cart
    await db.execute("DELETE FROM cart WHERE user_id = ?", [req.user.id]);

    res.status(200).json({ message: "Payment recorded!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save payment" });
  }
};
