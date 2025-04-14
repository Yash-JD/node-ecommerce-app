const db = require("../config/db");

module.exports.getAllProducts = async (req, res) => {
  try {
    const [result] = await db.execute("SELECT * FROM products");
    res.send({
      products: result,
    });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({
      message: "Cannot find product, please try again later",
    });
  }
};

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
    // console.error(error);
    return res.status(500).json({
      message: "Cannot add product, please try again later",
    });
  }
};

module.exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [product] = await db.execute("SELECT * FROM products WHERE id = ?", [
      id,
    ]);
    if (product.length > 0) {
      res.status(200).send({
        data: product[0],
      });
    } else {
      res.status(400).json({
        message: "Such product doesnot exists",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Cannot get product, please try again later",
    });
  }
};

module.exports.updateProduct = (req, res) => {};

module.exports.deleteProduct = (req, res) => {};
