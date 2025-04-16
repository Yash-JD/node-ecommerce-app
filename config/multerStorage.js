const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");
// const fs = require("fs");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: "./images/",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + path.extname(file.originalname));
//   },
// });

// if (!fs.existsSync("./images")) {
//   fs.mkdirSync("./images");
// }

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "e-commerce",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 800, height: 600, crop: "limit" }],
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 },
}).single("imageUrl");

module.exports = upload;
