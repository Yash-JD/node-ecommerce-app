const db = require("../config/db");

module.exports.getAllAddress = async (req, res) => {
  try {
    const userId = req.user.id;

    const [response] = await db.execute(
      "SELECT * FROM address WHERE user_id=?",
      [userId]
    );

    if (response.length > 0) {
      return res.status(200).send({
        success: true,
        addresses: response,
      });
    } else {
      return res.status(400).send({
        success: false,
        message: "No address found",
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: "Unable to add address. Please try again later.",
    });
  }
};

module.exports.addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { user_name, pincode, house_no, street_name, city, state } = req.body;

    await db
      .execute(
        "INSERT INTO address(user_id, pincode, house_no, street_name, city, state, user_name) VALUES (?,?,?,?,?,?,?)",
        [userId, pincode, house_no, street_name, city, state, user_name]
      )
      .then(() => {
        return res.status(201).send({
          success: true,
          message: "Address added successfully",
        });
      })
      .catch((err) =>
        res.status(400).send({
          success: false,
          message: err,
        })
      );
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Unable to save address. Please try again later.",
    });
  }
};

module.exports.editAddress = async (req, res) => {
  try {
    const addressId = req.params.id;

    // create query and data to be updated
    let query = `UPDATE address SET `;
    let data = [];
    for (let i in req.body) {
      if (i == "addressId") continue;
      query += i + "=?, ";
      data.push(req.body[i]);
    }
    // remove extra comma & space
    query = query.slice(0, -2);

    query += " WHERE id=?";
    data.push(addressId);

    // console.log({ query });

    await db.execute(query, data).then(() => {
      return res
        .status(201)
        .send({ success: true, message: "Address edited successfully" });
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Unable to edit address. Please try again later.",
    });
  }
};

module.exports.deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    await db.execute("DELETE FROM address WHERE id=?", [addressId]).then(() => {
      return res.status(200).send({
        success: true,
        message: "Address deleted successfully.",
      });
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Unable to delete address. Please try again later.",
    });
  }
};
