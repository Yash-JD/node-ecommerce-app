const { verifyToken } = require("../utils/verifyToken");

module.exports.checkAuth = (req, res, next) => {
  const userUid = req.cookies?.uid;

  // check if cookies with token exists
  if (!userUid) return res.redirect("/pages/login");

  try {
    const verifyedUser = verifyToken(userUid);
    req.user = verifyedUser;
    next();
  } catch (error) {
    return res.redirect("/pages/login");
  }
};

module.exports.checkLogin = (req, res, next) => {
  const userUid = req.cookies?.uid;

  // check if user is already logged in
  if (userUid && verifyToken(userUid)) return res.redirect("/pages/home");

  next();
};
