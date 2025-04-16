const db = require("../config/db");
const { uploadFileToCloudinary } = require("../utils/helpers");

module.exports.getAllProducts = async (req, res) => {
  try {
    const [result] = await db.execute("SELECT * FROM products");
    res.send({
      products: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Cannot find product, please try again later",
    });
  }
};

module.exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const user_id = req.user.id;
    const image = req.file;

    if (!name || !description || !price || !category || !image) {
      return res.status(204).json({
        message: "fields cannot be empty",
      });
    }

    // insert into category table
    const [categoryData] = await db.execute(
      "INSERT INTO category(category) VALUES (?)",
      [category]
    );

    // upload image to cloudinary
    const imageUrl = await uploadFileToCloudinary(image, "e-commerce");
    // console.log(imageUrl.secure_url);
    if (!imageUrl) {
      return res.status(400).json({
        message: "Failed to upload image to Cloudinary",
      });
    }

    // insert into products table
    const query =
      "INSERT INTO products(name, description, price, category_id, imageUrl, seller_id) VALUES (?, ?, ?, ?, ?, ?)";
    const data = [
      name,
      description,
      price,
      categoryData.insertId,
      imageUrl.secure_url,
      user_id,
    ];

    await db.execute(query, data);
    return res.status(201).send({
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
      return res.status(200).send({
        data: product[0],
      });
    } else {
      return res.status(400).json({
        message: "Such product doesnot exists",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Cannot get product, please try again later",
    });
  }
};

module.exports.updateProduct = async (req, res) => {
  try {
    // create query and data to be updated
    let query = `UPDATE products SET `;
    let data = [];
    for (let i in req.body) {
      query += i + "=?, ";
      data.push(req.body[i]);
    }

    // check if there is image to be updated ?
    const image = req.file;
    if (image) {
      // upload image to cloudinary
      const imageUrl = await uploadFileToCloudinary(image, "e-commerce");
      // console.log(imageUrl.secure_url);
      if (!imageUrl) {
        return res.status(400).json({
          message: "Failed to upload image to Cloudinary",
        });
      }
      query += "imageUrl=?  ";
      data.push(imageUrl.secure_url);
    }

    // remove extra comma & space
    query = query.slice(0, -2);

    query += " WHERE id=?";
    data.push(req.params.id);

    // console.log({ query });

    await db.execute(query, data);
    return res.status(200).json({
      message: "Data updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Cannot update product, please try again later",
    });
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    await db
      .execute("DELETE FROM products WHERE id = ?", [productId])
      .then(() => {
        return res.status(200).send({
          message: "Product deleted successfully.",
        });
      });
  } catch (error) {
    return res.status(500).json({
      message: "Cannot delete product, please try again later",
    });
  }
};
