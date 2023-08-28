const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('./connection');
const jwt = require('jsonwebtoken');


const {generateOTP, sendEmail, generateHashedOtp, issueToken, isEmailValid, verifyToken, isNumberValid, comapareOtp} = require('../utils');

let jwtSecretKey = "mysecret";

router.post('/login', isEmailValid, isNumberValid, async (req, res) => {
   
    let type = req.query.type; 
 
    if(type == "email")
    {  
 
      let email = req.body.email;
      let otp = generateOTP(100000,999999);
      let hashedOtp =  await generateHashedOtp(otp);
      console.log("hashed otp = ",hashedOtp);
      sendEmail(email, "OTP", `Your 6 digit otp is ${otp}`);

      let data = {
        email: email,
        otp:hashedOtp
      }
      
      let token = issueToken(data, "10m", jwtSecretKey);
      res.status(200).json({token});
    }

    else if(type == "number")
    {
      let number = req.body.number; 
      let otp = generateOTP(100000,999999);
      console.log("number otp -> ", otp);
      let hashedOtp = await generateHashedOtp(otp);

      let data = {
        number:number,
        otp:hashedOtp
      }

      let token = issueToken(data, "10m", jwtSecretKey);
      res.status(200).json({token});

    } 
    else
    {
      json.send({message: "google login"});
    }       
})

router.post('/login/verify', async (req,res)=>{
    
    let userOtp = req.body.otp;
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: 'Access denied. Token missing.' });
    
    let type = req.query.type; 
 
        const decoded = verifyToken(token, jwtSecretKey);
        const serverOtp = decoded.otp;
        const otpMatch = await comapareOtp(userOtp, serverOtp);

        if (otpMatch) {
            console.log("OTP matched.");
            res.status(200).json({ message: "OTP matched." }); // Example response
        } else {
            console.log("OTP does not match.");
            return res.status(400).json({ message: 'Invalid OTP.' });
        }
    

})

module.exports = router;

