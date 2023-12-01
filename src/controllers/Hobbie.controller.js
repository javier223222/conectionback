const { getTokenData } = require("../config/jwt.config")
const Hobbie = require("../models/Hobbie.model")
const User = require("../models/User.model")


const addhobbie=async(req,res)=>{
    
    try{
     const data=await getTokenData(req.headers.authorization)
     const {iduser}=data.data
     const {namehobbie}=req.body
     const hobbie=new Hobbie(namehobbie,null,null)
     await  hobbie.addHobbie()
     const result=await hobbie.getIdHobbie(namehobbie)
     
     await hobbie.addhobbieofuser(iduser)
     return res.status(200).json({
         success:true,
         message:"Hobbie agregado correctamente"
     
     })
    }catch(e){
     return  res.status(500).json({
         success:false,
         message:"Error al agregar hobbie",
         error:e.message
       })
    }
 }

 const gethobbies=async(req,res)=>{
     try{
       const data=await getTokenData(req.headers.authorization)
       const {iduser}=data.data
       const {username}=req.query
       const user=new User()
       const hobbiesoFUser=new Hobbie(null,null,null)
       if(username){
          const result=await user.checkwithusername(username)
          const {iduser}=result[0]
          const hobbies=await hobbiesoFUser.getAllHobbiesOfUser(iduser)
          return res.status(200).json({
             success:true,
             message:"Hobbies obtenidos correctamente",
             result:hobbies.length==0?[]:hobbies
          })
       }
 
          const hobbies=await hobbiesoFUser.getAllHobbiesOfUser(iduser)
           return res.status(200).json({
             success:true,
             message:"Hobbies obtenidos correctamente",
             result:hobbies.length==0?[]:hobbies
          })
       
 
           
 
        
 
     }catch(e){
     return res.status(500).json({
         success:false,
         message:"Erro al obtener la los intereses o el experto del usuario",
         error:e.message
      })
     }
 }
 const deletehobbies=async(req,res)=>{
     try{
        const data=await getTokenData(req.headers.authorization)
        const {iduser}=data.data
        const{idhobbiesof}=req.query
        const hobbie=new Hobbie(null,null,idhobbiesof)
        await hobbie.deleteHobbie(iduser)
       return res.status(200).json({
         success:true,
         message:"El hobbie fue eliminado correctamente"
        })
     }catch(e){
          return res.status(200).json({
             success:false,
             message:"Error al eliminar el hobbie",
             error:e.message
          })
     }
 }

 module.exports={
        addhobbie,
        gethobbies,
        deletehobbies
 }


