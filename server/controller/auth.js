const {db}=require('../dbConnection');
const bcrypt= require('bcrypt');
const {validationResult}= require('express-validator');
const jwt = require("jsonwebtoken");
/*
@param
{
    "username":"sushan",
    "password":"sushan123",
    "email":"sushanmhrzn277@gmail.com",
    "address":"lagan"
}
*/
const register=async(req,res)=>{
    //Checking a valid username ,email, password and
    console.log("From register");
    const errors =validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()}); 
    }

    //Checking if user already exists
    const sql="Select * from user where email=? and username=?"
    db.query(sql,[req.body.email,req.body.username],(err,data)=>{
        if (err) 
        return res.json(err)
        if(data.length) return res.status(409).json("User already exists");
        
     //Using bycrpyt for hashing the password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password,salt);

    const q="INSERT INTO user(username,password,email,address) VALUES (?)";
    const values=[
        req.body.username,
        hash,
        req.body.email,
        req.body.address,
    ]

    db.query(q,[values],(err,data)=>{
        if (err) return res.json(err)
        return res.status(200).json("User has been created");    
    })
});
}



/*
@param
{
"email":"sushanmhrzn277@gmail.com",
"password":"sushan123"
}
*/

const login=async(req,res)=>{

    const errors =validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()}); 
    }
    
    //Checking if user exists in the database my using the email
    const q="Select * from user where email=?"
    db.query(q,[req.body.email],(err, data)=>{
        if(err) return res.json(err)
        if(data.length==0) return res.status(404).json("User not found");

        //Checking the current password with the hashed password in dataBase
        const isPasswordCorrect=bcrypt.compareSync(req.body.password,data[0].password);
        if(!isPasswordCorrect) return res.status(400).json("Wrong email or password!");

        // return res.status(200).send("Welcome to our home page")
        const token=jwt.sign({
            id:data[0].id
        },
        process.env.JSON_TOKEN_KEY,
        {
            expiresIn:"1h",
        }
        );
        return res.status(200).json({token:token,
        user:data[0]});
    });
}
module.exports={
    register,
    login,
}