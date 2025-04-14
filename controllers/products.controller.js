const db = require("../config/db");

module.exports.getAllProducts = (req, res) => {};

module.exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, category, imageUrl } = req.body;

    if ((!name, !description, !price, !category, !imageUrl)) {
      res.status(204).send({
        message: "fields cannot be empty",
      });
    }

    // insert into category table
    const [categoryData] = await db.execute(
      "INSERT INTO category(category) VALUES (?)",
      [category]
    );

    // insert into products table
    const query =
      "INSERT INTO products(name, description, price, category_id, imageUrl) VALUES (?, ?, ?, ?, ?)";
    const data = [name, description, price, categoryData.insertId, imageUrl];

    await db.execute(query, data);
    res.status(201).send({
      message: "Product added successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Cannot add product, please try again later",
      error,
    });
  }
};

module.exports.getProduct = (req, res) => {};

module.exports.updateProduct = (req, res) => {};

module.exports.deleteProduct = (req, res) => {};
