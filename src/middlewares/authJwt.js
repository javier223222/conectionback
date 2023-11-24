const {  getTokenData } = require("../config/jwt.config")

const verifyToken=async(req,res,next)=>{

    try{
       const answer=await getTokenData(req.headers.authorization)
       if(answer){
       return next()
       }
       return res.status(401).json({
            success:false,
            message:"No estas logeado"
        })
       
        
    }catch(e){
      return res.status(500).json({
       success:false,
       error:e.message
       })


    }
   
}
module.exports={
    verifyToken
}