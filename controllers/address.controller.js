const db = require("../config/db");

module.exports.addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pincode, houseNo, streetName, city, state } = req.body;

    await db
      .execute(
        "INSERT INTO address(user_id, pincode, house_no, street_name, city, state) VALUES (?,?,?,?,?,?)",
        [userId, pincode, houseNo, streetName, city, state]
      )
      .then(() => {
        return res.status(201).send({ message: "Address added successfully" });
      })
      .catch((err) => res.status(400).send({ msg: err }));
  } catch (error) {
    return res.status(500).send({
      message: "Unable to save address. Please try again later.",
    });
  }
};

module.exports.editAddress = async (req, res) => {
  try {
    const { addressId } = req.body;

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
      return res.status(201).send({ message: "Address edited successfully" });
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to edit address. Please try again later.",
    });
  }
};

module.exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.body;
    await db.execute("DELETE FROM address WHERE id=?", [addressId]).then(() => {
      return res.status(200).send({
        message: "Address deleted successfully.",
      });
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to delete address. Please try again later.",
    });
  }
};
