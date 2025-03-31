const db = require("../config/db");
const bcrypt = require("bcrypt");

module.exports.signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // check if data is valid
    if (!username || !password || !email) {
      return res.status(400).json({
        message: "invalid syntax",
      });
    }

    // check if user already exists
    const [existingUser] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0)
      return res.status(400).json({
        msg: "User already exists.",
      });

    // insert into database
    const hashPass = await bcrypt.hash(password, 10);

    const query =
      "INSERT INTO users(name, email, password, role) VALUE (?,?,?,?)";
    const data = [username, email, hashPass, role];
    const result = db.execute(query, data);
    return res.status(201).json({
      msg: "User created successfullly.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "User cannot be registered, please try again later",
    });
  }
};
