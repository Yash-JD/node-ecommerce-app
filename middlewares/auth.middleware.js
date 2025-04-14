const { verifyToken } = require("../utils/verifyToken");

module.exports.checkAuth = (req, res, next) => {
  const userUid = req.cookies?.uid;

  // check if cookies with token exists
  if (!userUid)
    return res.status(401).json({
      msg: "Unauthorised! Please login first.",
    });

  try {
    const verifyedUser = verifyToken(userUid);
    req.user = verifyedUser;
    next();
  } catch (error) {
    return res.status(500).json({
      msg: "Something went wrong.",
    });
  }
};

module.exports.checkRole = (req, res, next) => {
  const { role } = req.user;
  if (role === "seller") next();
  else
    return res.status(401).json({
      msg: "Unauthorised!",
    });
};

module.exports.checkLogin = (req, res, next) => {
  const userUid = req.cookies?.uid;

  // check if user is already logged in
  if (userUid && verifyToken(userUid))
    return res.status(301).send({
      message: "Already logged In.",
      action: "Please logout first.",
    });

  next();
};
