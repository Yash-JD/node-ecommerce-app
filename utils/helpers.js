const jwt = require("jsonwebtoken");
const db = require("../config/db");

module.exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};
