const db = require("../config/db");
const { fetchImages, mergeImagesWithProducts } = require("../utils/helpers");

module.exports.getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const limit = parseInt(req.query.quantity) || 10;

    // if query parameters are there
    if (category) {
      let categories = category.split(",");
      let query = "";
      let result;

      // different '=? & (?)'
      if (categories.length === 1) {
        query +=
          "SELECT products.id, products.name, products.description, products.price, products.quantity, category.category FROM products INNER JOIN category ON products.category_id = category.id WHERE category.category = ? LIMIT ?";
        [result] = await db.query(query, [...categories, limit]);
      } else {
        query +=
          "SELECT products.id, products.name, products.description, products.price, products.quantity, category.category FROM products INNER JOIN category ON products.category_id = category.id WHERE category.category IN (?) LIMIT ?";
        [result] = await db.query(query, [categories, limit]);
      }

      if (result.length > 0) {
        const images = await fetchImages(result); // if products exists then get all their images

        // merge image-urls with result
        const products = mergeImagesWithProducts(result, images);

        return res.status(200).send({
          success: true,
          products: products,
        });
      } else {
        res
          .status(404)
          .send({ success: false, message: "No such product exists." });
      }
    } else {
      const [result] = await db.query(
        "SELECT products.id, products.name, products.description, products.price, products.quantity, category.category FROM products INNER JOIN category ON products.category_id = category.id"
      );

      if (result.length > 0) {
        const images = await fetchImages(result); // if products exists then get all their images

        // merge image-urls with result
        const products = mergeImagesWithProducts(result, images);

        return res.status(200).send({
          success: true,
          products: products,
        });
      } else {
        res
          .status(404)
          .send({ success: false, message: "No such product exists." });
      }
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot find product, please try again later",
    });
  }
};

module.exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.body;
    const user_id = req.user.id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded",
      });
    }

    if (!name || !description || !price || !category || !quantity) {
      return res.status(204).json({
        success: false,
        message: "fields cannot be empty",
      });
    }

    const imagesUrls = req.files.map((file) => file.path); // already Cloudinary URLs
    // console.log(imagesUrls);

    // check if product already exists
    const [isProductExists] = await db.execute(
      "SELECT id FROM products WHERE name=? AND description=? AND price=? AND seller_id=?",
      [name, description, price, user_id]
    );

    if (isProductExists.length > 0) {
      return res.status(208).send({
        success: false,
        message: "Product already exists.",
      });
    }

    // insert into category table
    const [categoryData] = await db.execute(
      "INSERT INTO category(category) VALUES (?)",
      [category]
    );

    // insert details into products table
    const [response] = await db.execute(
      "INSERT INTO products(name, description, price, category_id, seller_id, quantity) VALUES ( ?, ?, ?, ?, ?, ?)",
      [name, description, price, categoryData.insertId, user_id, quantity]
    );

    // then insert images corresponds to productId recently inserted
    const productId = response.insertId;
    for (const img of imagesUrls) {
      await db.execute(
        "INSERT INTO images(product_id, image_urls) VALUES (?,?)",
        [productId, img]
      );
    }

    return res.status(201).send({
      success: true,
      message: "Product added successfully",
    });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({
      success: false,
      message: "Cannot add product, please try again later",
    });
  }
};

module.exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [product] = await db.execute(
      "SELECT products.id, products.name, products.description, products.price, products.quantity, category.category FROM products INNER JOIN category ON products.category_id = category.id HAVING id=?",
      [id]
    );
    if (product.length > 0) {
      const images = await fetchImages(product); // if products exists then get all their images

      // merge image-urls with result
      const details = mergeImagesWithProducts(product, images);

      return res.status(200).send({
        success: true,
        product: details,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Such product doesnot exists",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot get product, please try again later",
    });
  }
};

module.exports.updateProduct = async (req, res) => {
  try {
    // check if there is image to be updated ?
    // const image = req.files;
    // if (image) {
    //   // // upload image to cloudinary
    //   // const imageUrl = await uploadFileToCloudinary(image, "e-commerce");
    //   // console.log(imageUrl.secure_url);
    //   // if (!imageUrl) {
    //   //   return res.status(400).json({
    //   //     message: "Failed to upload image to Cloudinary",
    //   //   });
    //   // }
    //   // query += "imageUrl=?  ";
    //   // data.push(imageUrl.secure_url);
    // }

    // create query and data to be updated
    let query = `UPDATE products SET `;
    let data = [];
    for (let i in req.body) {
      query += i + "=?, ";
      data.push(req.body[i]);
    }

    // remove extra comma & space
    query = query.slice(0, -2);

    query += " WHERE id=?";
    data.push(req.params.id);

    // console.log({ query });

    await db
      .execute(query, data)
      .then(() => {
        return res.status(200).json({
          success: true,
          message: "Data updated successfully.",
        });
      })
      .catch((err) =>
        res.status(400).send({
          success: false,
          message: err,
        })
      );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot update product, please try again later",
    });
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // first delete all details and then images
    await db
      .execute("DELETE FROM images WHERE product_id = ?", [productId])
      .then(async () => {
        await db
          .execute("DELETE FROM products WHERE id=?", [productId])
          .then(() => {
            return res.status(200).send({
              success: true,
              message: "Product deleted successfully.",
            });
          });
      })
      .catch((err) =>
        res.status(400).send({
          success: false,
          message: err,
        })
      );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot delete product, please try again later",
    });
  }
};

module.exports.getAllCategories = async (req, res) => {
  try {
    const [data] = await db.query("SELECT DISTINCT category FROM category", []);
    if (data.length > 0) {
      return res.status(200).send({ success: true, category: data });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot find categories, please try again later",
    });
  }
};
