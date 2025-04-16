const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  validateEmail,
  validatePassword,
  generateOTP,
} = require("../utils/helpers");

module.exports.signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // check if data is valid
    if (!username || !password || !email || !role) {
      return res.status(400).json({
        message: "invalid syntax",
      });
    }

    // validate email
    const validEmail = validateEmail(email);
    if (!validEmail) {
      return res.status(400).json({
        message: "Email must contain all lowercase and no special symbols.",
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

    //validate password
    const validPassword = validatePassword(password);
    if (!validPassword) {
      return res.status(400).json({
        message:
          "Password must contain atleat 8 characters with atleast one Uppercase, one lowercase, one number and one special character.",
      });
    }

    // generate otp
    // const response = await generateOTP(email);
    // if (!response) {
    //   return res.status(500).json({
    //     message: "error in sending otp",
    //   });
    // }

    // insert into database
    const hashPass = await bcrypt.hash(password, 10);

    const query =
      "INSERT INTO users(name, email, password, role) VALUES (?,?,?,?)";
    const data = [username, email, hashPass, role];
    await db.execute(query, data);
    return res.status(201).json({
      msg: `Signed Up successfully!`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "You cannot be registered, please try again later",
    });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // check if data is valid
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Field cannot be empty.",
      });
    }

    // check if the user exists
    const [user] = await db.execute(
      "SELECT * FROM users WHERE email = ? AND role = ?",
      [email, role]
    );
    if (user.length > 0) {
      // verify password & generate jwt token
      const checkPass = await bcrypt.compare(password, user[0].password);
      if (checkPass) {
        const payload = {
          id: user[0].id,
          name: user[0].name,
          email: user[0].email,
          role: user[0].role,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
          expiresIn: "3h",
        });
        // then send token with cookie as response
        res
          .cookie("uid", token)
          .status(200)
          .json({ msg: "Logged in successfully." });
      } else {
        return res.status(403).json({
          msg: "Please enter correct password.",
        });
      }
    } else {
      return res.status(401).json({
        msg: "Unauthorised! Please signup first.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "You cannot login now, please try again later",
    });
  }
};

module.exports.logout = (req, res) => {
  res.clearCookie("uid", { path: "/" });
  return res.status(200).json({ message: "Logged out successfully" });
  // console.log(req.cookies?.uid);
};
