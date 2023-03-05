const jwt=require('jsonwebtoken');

const verifyToken=async(req,res,next)=>{
 const token = req.headers.authorization;
 if(!token){
    return res.status(403).send("A token is required for authentication");
 }

    const decoded = jwt.verify(token,process.env.JSON_TOKEN_KEY);  
    req.user=decoded;

 return next();
}
module.exports={
    verifyToken,
}