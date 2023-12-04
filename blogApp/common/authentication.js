const jwt=require('jsonwebtoken');

const verifyToken=async(req,res,next)=>{
 const token = req.headers.authorization;
 if(!token){
    return res.status(403).send("A token is required for authentication");
 }
   try{
      const decoded = jwt.verify(token,process.env.JSON_TOKEN_KEY); 
      req.user=decoded;    
   }catch(e){
      return res.json(e);
   }
    
    

 return next();
}
module.exports={
    verifyToken,
}