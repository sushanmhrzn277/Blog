const {db}=require('../dbConnection');
const bcrypt= require('bcrypt');
const {validationResult}= require('express-validator');
const jwt = require("jsonwebtoken");
const {transporter}=require('../common/nodemailer');
const nodemailer=require('nodemailer');
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
    // console.log("From register");
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

    const q="INSERT INTO user(username,password,email,address,verified) VALUES (?)";
    const values=[
        req.body.username,
        hash,
        req.body.email,
        req.body.address,
        false
    ]

    db.query(q,[values],(err,data)=>{
        if (err) return res.json(err)
        // return res.status(200).json("User has been created");
        sendOtpVerification(req,res);  
    })
});
}

const sendOtpVerification =async(req,res)=>{
    let otp=(Math.floor(1000 + Math.random() * 9000)).toString();
    // console.log(typeof(otp))
    // console.log(otp)
    console.log(otp);
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth : {
            user:process.env.GMAIL_ACC,
            pass:process.env.GMAIL_PASSWORD
        }
    })
    let mail={
        from: process.env.GMAIL_ACC,
        to: req.body.email,
        subject:"Verify your email",
        html:'<p> Enter <b> '+ otp +'</b> in the app to verify your email address and complete the process</p>'
    };
    // console.log(req.body.email);
    const salt = bcrypt.genSaltSync(10);
    // console.log(typeof(salt))
    const hashOtp = bcrypt.hashSync(otp,salt);
    // console.log(hashOtp);
    var q="Select * from user where email=?";
    // console.log(Date.now(),Date.now()*3600000);
    let createdAt=new Date().getTime();
    let expiresAt=new Date(createdAt + 2 * 60* 60*1000).getTime();
    // console.log("Created date and expiry date are"+createdAt+",,,"+expiresAt)
    db.query(q,req.body.email,(err,data)=>{
        if(err) return res.json(err);
        const q="Insert into otpTable(userid,otp,createdAt,expiresAt) Values(?)";
        const values=[
            data[0].id,
            hashOtp,
            createdAt,
            expiresAt
        ]
        db.query(q,[values],(err,data)=>{
            if(err) return res.json(err)
            transporter.sendMail(mail,(err,result)=>{
                if(err) return res.json(err);
            })
        }) 
    return res.send({message:"Please check your email for verfication",user:data[0]});
    })
 
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
        if(data[0].verified==false) return res.status(401).json("Please confirm the otp provided on your mail first");
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



const verifyOtp= async(req,res)=>{
    let {userId ,otp}=req.body;
    if(!userId || !otp){
        return res.status(404).send("No data");
    }else{
        const q="Select * from otpTable where userId=?";
        db.query(q,[userId],async (err,data)=>{
            if (err) return res.send(err);
            if(data.length<=0){
                return res.status(409).send("User already exists or you havent signup");
            }else{
                const expiresAt=data[0].expiresAt;
                const hashedOtp=data[0].otp;
                // console.log(hashedOtp);
                if(expiresAt <= new Date().getTime){
                    const q="Delete from otpTable where userId=?"
                     db.query(q,[userId],(err,data)=>{
                        if (err) return res.status(498).send("The code has already expired");
                        return res.send("The code has already expired");
                    })
                }else{
                    const validOtp=  bcrypt.compareSync(otp,hashedOtp);
                    // console.log(hashedOtp+" ============ "+ hashOtp)
                    // console.log("ValidOtp==="+validOtp);
                    if(!validOtp){
                       return res.status(401).send("The code is not valid");
                    }else{
                        const q="Update user set verified=? where id=?";
                        db.query(q,[true,userId],(err,data)=>{
                            if(err) return res.send(err);
                            const q="Delete from otpTable where userId=?"
                            db.query(q,[userId],(err,data)=>{
                                if(err) return res.send(err);
                                return res.status(200).send("Mail verified successfully");
                            })
                        })
                    }
                }
            }
        })
    }
}
module.exports={
    register,
    login,
    sendOtpVerification,
    verifyOtp,
}