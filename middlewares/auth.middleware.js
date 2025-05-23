const { verifyToken } = require("../utils/helpers");
const db = require("../config/db");

module.exports.checkAuth = (req, res, next) => {
  const userUid = req.headers.authorization;

  // check if cookies with token exists
  if (!userUid || !userUid.startsWith("Bearer "))
    return res.status(401).json({
      message: "Unauthorised! Please login first.",
    });

  try {
    const verifyedUser = verifyToken(userUid.split(" ")[1]);
    req.user = {
      id: verifyedUser.id,
      name: verifyedUser.name,
      email: verifyedUser.email,
      role: verifyedUser.role,
    };
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

module.exports.isUser = (req, res, next) => {
  const { role } = req.user;
  if (role === "user") next();
  else
    return res.status(403).json({
      message: "Unauthorised!, only accessed by user.",
    });
};

module.exports.isSeller = (req, res, next) => {
  const { role } = req.user;
  if (role === "seller") next();
  else
    return res.status(403).json({
      message: "Unauthorised!, only accessed by seller.",
    });
};

module.exports.checkLogin = (req, res, next) => {
  const userUid = req.cookies?.uid;

  // check if user is already logged in
  if (userUid && verifyToken(userUid))
    return res.status(302).send({
      message: "Already logged In.",
      action: "Please logout first.",
    });

  next();
};

module.exports.checkSellerProducts = async (req, res, next) => {
  try {
    const productId = req.params.id;

    // check if seller has any product listed or not
    const [listProducts] = await db.execute(
      "SELECT * FROM products WHERE seller_id = ? AND id = ?",
      [req.user.id, productId]
    );

    // if seller has its any prouducts listed then update/delete it
    if (listProducts.length > 0) {
      next();
    } else {
      // deny to update the product
      return res.status(403).json({
        message: `Unauthorised to ${req.method} product: ${productId}`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: `Internal server error at ${req.method} product`,
    });
  }
};
