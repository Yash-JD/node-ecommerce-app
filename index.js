const express = require("express");
require("dotenv").config();
const authRoute = require("./routes/auth.route");

const app = express();

app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded form data

app.use("/api/auth", authRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
