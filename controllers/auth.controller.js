const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  validateEmail,
  validatePassword,
  generateOTP,
  verifyToken,
} = require("../utils/helpers");

module.exports.signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // check if data is valid
    if (!username || !password || !email || !role) {
      return res.status(400).json({
        success: false,
        message: "invalid syntax",
      });
    }

    // validate email
    const validEmail = validateEmail(email);
    if (!validEmail) {
      return res.status(400).json({
        success: false,
        message:
          "Email must contain all lowercase, no number domain and no special symbols.",
      });
    }

    // check if user already exists
    const [existingUser] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0)
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });

    //validate password
    const validPassword = validatePassword(password);
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain atleat 8 characters with atleast one Uppercase, one lowercase, one number and one special character.",
      });
    }
    // hash the password
    const hashPass = await bcrypt.hash(password, 10);

    // generate otp
    const response = await generateOTP(email);
    if (response) {
      // make token of otp, email, hashPass
      const payload = {
        otp: response,
        username,
        email,
        hashPass,
        role,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: "2m",
      });

      // send token as response
      return res.status(200).json({
        success: true,
        message: "OTP sent successfully.",
        otpToken: token,
      });

      // //  send token with cookie as response
      // res
      //   .cookie("signupOTP", token, { maxAge: 60000 })
      //   .status(200)
      //   .json({ success: false, message: "OTP sent successfully." });
    } else {
      return res.status(500).json({
        success: false,
        message: "Invalid gmail",
      });
    }
  } catch (error) {
    // console.error(error);
    return res.status(500).json({
      success: false,
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
        success: false,
        message: "Field cannot be empty.",
      });
    }

    // validate email
    const validEmail = validateEmail(email);
    if (!validEmail) {
      return res.status(400).json({
        success: false,
        message:
          "Email must contain all lowercase, no number domain and no special symbols.",
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
          expiresIn: "1d",
        });
        return res.status(200).json({
          success: true,
          message: "Logged in successfully.",
          userData: token,
        });
        // // then send token with cookie as response
        // res
        //   .cookie("uid", token)
        //   .status(200)
        //   .json({ message: "Logged in successfully." });
      } else {
        return res.status(403).json({
          success: false,
          message: "Please enter correct password.",
        });
      }
    } else {
      return res.status(401).json({
        success: false,
        message: "Unauthorised! Please signup first.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "You cannot login now, please try again later",
    });
  }
};

module.exports.logout = (req, res) => {
  // res.clearCookie("uid", { path: "/" });
  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
  // console.log(req.cookies?.uid);
};

module.exports.verifyOTP = async (req, res) => {
  try {
    const userOTP = parseInt(req.body.otp);

    // verify token if it is unchanged ?
    const { otp, username, email, hashPass, role } = verifyToken(
      req.body.serverOTPToken
    );

    // verify otp of frontend and original otp (generate from signup & is in cookie)
    if (userOTP === otp) {
      // insert into database
      const query =
        "INSERT INTO users(name, email, password, role) VALUES (?,?,?,?)";
      const data = [username, email, hashPass, role];
      await db.execute(query, data).then(() => (req.otpToken = {}));
      return res.status(201).json({
        success: true,
        message: `Signed Up successfully!`,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: `Wrong OTP`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot verify otp, please try again later",
    });
  }
};
