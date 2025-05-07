const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const nodemailer = require("nodemailer");
const db = require("../config/db");

module.exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};

module.exports.validateEmail = (email) => {
  // check if it contains more than one @
  if (email.indexOf("@") != email.lastIndexOf("@")) return false;

  // check if it contains more than one . after @
  const index = email.indexOf("@");
  const domain = email.slice(index + 1);
  if (domain.indexOf(".") != domain.lastIndexOf(".")) return false;

  // check if it contains capital letters or numbers in domain
  if (/[A-Z]/.test(email) || /[0-9]/.test(domain)) return false;

  //check if email contains any other special characters other than @ and .
  if (
    email.split("").some((x) => {
      return '!#$%^&*(),?":{}|<>'.includes(x);
    })
  )
    return false;
  else return true;
};

module.exports.validatePassword = (password) => {
  // check if it contains atlease capital letters
  if (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    password.split("").some((x) => {
      return '!#$%^&*(),?":{}|<>@.'.includes(x);
    })
  )
    return true;
  else return false;
};

module.exports.generateOTP = async (receiver_mail) => {
  try {
    // sender details
    const sender = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_SENDER_ID,
        pass: process.env.GMAIL_SENDER_PASS,
      },
    });

    // verify mail
    // sender.verify(function (error, success) {
    //   if (error) {
    //     console.log("Error verifying Gmail:", error);
    //     return false;
    //   }
    // });

    // generate otp
    const otp = Math.floor(100000 + Math.random() * 900000);

    // sending mail
    const receiver = {
      from: process.env.GMAIL_SENDER_ID,
      to: receiver_mail,
      subject: "OTP Verification",
      text: `Your otp for gmail verification is ${otp}`,
    };
    const info = await sender.sendMail(receiver);
    // console.log("Email sent:", info.response);
    console.log("otp:", otp);
    return otp;
  } catch (error) {
    console.log("Error:", error);
    return false;
  }
};

// module.exports.uploadFileToCloudinary = async (file, folder) => {
//   const options = {
//     folder: folder,
//     resource_type: "auto",
//   };

//   // if (quality) options.quality = quality;

//   return await cloudinary.uploader.upload(file.path, options);
// };

module.exports.fetchImages = async (products) => {
  try {
    let images = [];

    // loop through each products and get corresponding images
    for (const prd of products) {
      const [urls] = await db.execute(
        "SELECT image_urls FROM images WHERE product_id=?",
        [prd.id]
      );
      images.push(urls);
      // images.push({ ...urls });
      // console.log(images);
    }
    return images;
  } catch (error) {
    return [];
  }
};

module.exports.mergeImagesWithProducts = (result, images) => {
  let count = 0;
  for (const product of result) {
    const eachProductImages = [];
    images[count].forEach((url) => {
      eachProductImages.push(url);
    });
    count++;
    product.imageUrls = eachProductImages;
  }
  return result;
};
