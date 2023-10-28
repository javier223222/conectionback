const { comprobateToken } = require("../config/jwt.config")

const verifyToken=async(req,res,next)=>{
    const token=req.headers["x-access-token"]
    try{
       const answer= comprobateToken(token)
       if(answer){
        next()
       }
        res.status(404).json({
            success:false,
            message:"No estas logeado"
        })
       
        
    }catch(e){
       res.status(500).json({
       success:false,
       error:e.message
       })


    }
   
}
module.exports={
    verifyToken
}