const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth.route");
const productsRoute = require("./routes/products.route");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded form data
app.use(cookieParser()); // Parses the cookies

app.use("/api/auth", authRoute);
app.use("/api/products", productsRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("*", (req, res) => {
  res.send("404, Page not found!");
});
