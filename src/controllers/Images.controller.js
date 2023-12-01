const { getTokenData } = require("../config/jwt.config")
const ImagesUser = require("../models/Images.model")
const User = require("../models/User.model")


const getallimagesprofile=async(req,res)=>{
    try{
        const data=await getTokenData(req.headers.authorization)
        const {username}=req.query
        const {page,limit}=req.query
        const skip=(page-1) * limit
        const usert=new User()
        
        let response={
            message:"se obtuvieron correctamente las imagenes",
           
           }
        if(username){
            
           
         
            const rows=await usert.checkwithusername(username)
          
            const {iduser}=rows[0]
            if(rows.length==0){
               return res.status(404).json({
                    success:false,
                    message:"El usuario no existe"
                })
    
            }
            const imageOFuser=new ImagesUser(iduser)
           
            const resultc=await imageOFuser.getAllImages(page,limit,skip)
            response={
               ...response,
               ...resultc
            }
            console.log(rows)
           return res.status(200).json(response)
           
        
        }else if(data){
            
         
            
            const {username,email,namemajor,iduser}=data.data
            const user=new User(username,email,namemajor)
            const images=new ImagesUser(iduser)


           
            const resultc=await images.getAllImages(page,limit,skip)
            console.log(skip)
            console.log(resultc)
            response={
               ...response,
               ...resultc
            }
           return res.status(200).json(response)
        }
    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Erro al obtner las imagenes del usuario",
            error:e.message
         })
    }
    
}

module.exports={
    getallimagesprofile
}