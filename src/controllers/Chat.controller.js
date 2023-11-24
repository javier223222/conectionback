const { getTokenData } = require("../config/jwt.config")
const Chat = require("../models/Chat.model")
const User = require("../models/User.model")

const getAllChatMember=async(req,res)=>{
  try{
    const users=new User()
    const data=await getTokenData(req.headers.authorization)
    const {iduser}=data.data
    const chat=new Chat(iduser,null,null)
  
    const result=await chat.getAllChatMember()
    for (let i = 0; i < result.length; i++) {
        for(let key in result[i]){
           result[i][key]==iduser?delete result[i][key]:null
           const {username}=await users.getnameProfileannombre(result[i]?.iduserone||result[i]?.idusertwo)
           const imagenOduser=await users.getallimagesprofile(result[i]?.iduserone||result[i]?.idusertwo,'Profile')
            const {urlfile}=imagenOduser.length>0?imagenOduser[0]:{urlfile:null}
            result[i]={...result[i],username,imageuser:urlfile}
        }
         
     }
     
     return res.status(200).json({
       success:true,
       message:"Mensajes obtenidos",
       result
     })

  }catch(e){
    return res.status(500).json({
      success:false,
      message:"Error al obtener los mensajes del usuario",
      error:e.message
    })
  }
}

const getMessages=async(req,res)=>{
  try{
    
    const {idmessage}=req.query
    const chat=new Chat(null,null,idmessage)
    const result=await chat.gettallmessageOfSpecificChat()
    const user=new User()
    for (let i = 0; i < result.length; i++) {
      let element = result[i];
      const {name,apellidop,apellidom,username}=await user.getnameProfileannombre(element.idusersend)
      const imageUser= await user.getallimagesprofile(element.idusersend,'Profile')
      const {urlfile}=imageUser[0]
      element={...element,name,apellidop,apellidom,username,imageuser:urlfile}
      result[i]=element
    }
    return res.status(200).json({
      success:true,
      message:"Mensajes obtenidos",
      result
    })
  }catch(e){
    return res.status(500).json({
      success:false,
      message:"Error al obtener los mensajes",
      error:e.message
    })
  }
}

const getMediaOfChat=async(req,res)=>{
  try{
    const {idmessage}=req.query
    const chat=new Chat(null,null,idmessage)
    const result=await chat.getAllMedioOfSpecificMessage()
    return res.status(200).json({
      success:true,
      message:"Archivos obtenidos",
      result
    })
  }catch(e){
    return res.status(500).json({
      success:false,
      message:"Error al obtener los archivos",
      error:e.message
    })
  }
}


module.exports={
    getAllChatMember,
    getMessages,
    getMediaOfChat
}