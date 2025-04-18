const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const nodemailer = require("nodemailer");

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
      return '!#$%^&*(),?":{}|<>@.'.includes(x);
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

module.exports.generateOTP = async (sender_mail) => {
  try {
    const sender = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_SENDER_ID,
        pass: process.env.GMAIL_SENDER_PASS,
      },
    });
    const otp = Math.floor(Math.random() * 999999 + 100000);
    const receiver = {
      from: process.env.GMAIL_SENDER_ID,
      to: sender_mail,
      subject: "Verification OTP",
      text: `${otp}`,
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

module.exports.uploadFileToCloudinary = async (file, folder) => {
  const options = {
    folder: folder,
    resource_type: "auto",
  };

  // if (quality) options.quality = quality;

  return await cloudinary.uploader.upload(file.path, options);
};
