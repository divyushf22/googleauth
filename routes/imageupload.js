const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const connection = require('./connection');
const multer = require('multer');
const path = require('path');
const verifytoken = require('./verifytoken');
const jwt = require("jsonwebtoken");

// middleware used for file uplading
const fileUpload = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb)
        {    
            // destination folder is uplaod
            cb(null, "uploads"); 
        },
        filename: function(req,file,cb)
        {
            // extractiong file name
            let name = file.originalname;
            let id = req.params.id;


            // splitting file name and the extension extendsion[0] = filename && extension[1] = extension
            let extension = name.split(".");
            let newName = extension[0] + Date.now() + "." + extension[1];

            
            let query2 = "UPDATE customers SET image_name = ? WHERE id = ?"
                connection.query(query2, [newName, id], (error, results)=>{
                    if(error)
                    {
                       console.log("Error updating file name")
                    }
                })

            cb(null,newName);
        }
    })
  // form field name = user_file
}).single("name");


router.all("/divyush", (req,res)=>{
    res.send("Hii");
    
})

// upload file api
router.post('/:id', fileUpload, async(req,res)=>{
       res.status(201).json({message:"File uploaded successfully"});
} )


// get file api ,  Taking id of the user and find the corresponding user's image_url
router.get('/:id', verifytoken , async(req,res)=>{
   
     
       let id1= req.params.id
   
        const query2 = `SELECT image_name FROM customers WHERE id = ?`;

            connection.query(query2, [id1], async (error, results) => {
                if (error) {
                    console.error('Error executing query:', error);
                } else {
                    if (results.length > 0) {
                        const user = results[0];
                        let imagename = user.image_name;

                        res.sendFile(path.join(__dirname,"../uploads",imagename ));

                    } else {
                        res.json({ message: "No user found"});
                    }
                }
            })
})


module.exports = router;