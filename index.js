const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth.route");
const productsRoute = require("./routes/products.route");
const ordersRoute = require("./routes/orders.route");
const wishlistRoute = require("./routes/wishlist.route");
const cartRoute = require("./routes/cart.route");
const addressRoute = require("./routes/address.route");
const paymentRoute = require("./routes/payment.route");

const app = express();

// express middleware parsers
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: false })); // Parses URL-encoded form data
app.use(cookieParser()); // Parses the cookies

// for payment gateway
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./ejs"));

// prevent cross-origin attack
app.use(
  cors({
    origin: "http://localhost:5173", //  frontend URL
    credentials: true, // allow cookies if needed
  })
);

// all endpoints
app.use("/api/auth", authRoute);
app.use("/api/products", productsRoute);
app.use("/api/orders", ordersRoute);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/cart", cartRoute);
app.use("/api/checkout/address", addressRoute);
app.use("/api/checkout/payment", paymentRoute);

// connection establishment
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("*", (req, res) => {
  res.send("404, Page not found!");
});
