const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth.route");
const productsRoute = require("./routes/products.route");
const ordersRoute = require("./routes/orders.route");
const wishlistRoute = require("./routes/wishlist.route");

const app = express();

// express middleware parsers
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: false })); // Parses URL-encoded form data
app.use(cookieParser()); // Parses the cookies

// all endpoints
app.use("/api/auth", authRoute);
app.use("/api/products", productsRoute);
app.use("/api/orders", ordersRoute);
app.use("/api/wishlist", wishlistRoute);

// connection establishment
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("*", (req, res) => {
  res.send("404, Page not found!");
});
