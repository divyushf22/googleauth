const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "divyush@f22labs.com",
    pass: "Divyushpoonia1*",
  },
});

const issueToken = (details, expiresInHr = "1h", secretKey = "mysecret") =>
  jwt.sign({ ...details }, secretKey, { expiresIn: expiresInHr });

const verifyToken = (token = "", secretKey = "mysecret") =>
  jwt.verify(token, secretKey);

const sendEmail = (to, subject, text, from = "divyush@f22labs.com") => {
  let mailDetails = {
    from,
    to,
    subject,
    text,
  };

  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log("Error Occurs");
    } else {
      console.log("Email sent successfully");
    }
  });
};

const generateOTP = (min = 1, max = 10) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const isEmailValid = (req, res, next) => {
  if (req.query.type === "email") {
    const email = req.body.email;
    if (!email) {
      return res.status(400).json({ message: "Email missing" });
    }
  }
  next();
};

const isNumberValid = (req, res, next) => {
  if (req.query.type === "number") {
    const number = req.body.number;
    if (!number) {
      return res.status(400).json({ message: "Number missing" });
    } else if (number.length > 10 || number.length < 10) {
      return res.status(400).json({ message: "Invalid number" });
    }
  }
  next();
};

const generateHashedOtp = async (otp) => {
  let salt = await bcrypt.genSalt();
  return await bcrypt.hash(otp.toString(), salt);
};

const comapareOtp = async(userOtp, serverOtp)=>
{
   return await bcrypt.compare(userOtp.toString(), serverOtp);
}

module.exports = {
  generateOTP,
  isEmailValid,
  sendEmail,
  issueToken,
  verifyToken,
  generateHashedOtp,
  isNumberValid,
  verifyToken,
  comapareOtp,
  
};
