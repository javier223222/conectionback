const { getTokenData } = require("../config/jwt.config")
const SocialMedia = require("../models/SocialMedia.model")
const User = require("../models/User.model")


const getSocialMediaOptions=async(req,res)=>{
    try{ 
       const socialmedia=new SocialMedia(null,null,null)
       const result =await socialmedia.getOptionsSocialMedia()
       return res.status(200).json({
        success:true,
        message:"Opciones de redes sociales obtenidas correctamente",
        result:result.length==0?[]:result
       })

    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Error al obtener las opciones de redes sociales",
            error:e.message
        
        })
    }
}

const addSocialMedia=async(req,res)=>{
    try{
         const {idoption,link}=req.body
         const data=await getTokenData(req.headers.authorization)
         const {iduser}=data.data
        const socialmedia=new SocialMedia(idoption,null,link)
        await socialmedia.addSocialMedia(iduser)
        return res.status(200).json({
            success:true,  
            message:"Red social agregada correctamente"
        })

    }catch(e){
      return res.status(500),json({
        success:false,
        message:"Error al agregar la red social",
      })
    }
}

const getSocialMediaofUser=async(req,res)=>{

    try{
      const data=await getTokenData(req.headers.authorization)
      const {iduser}=data.data
      const {username}=req.query
      let result=null;
    const user=new User()
    const socialmedia=new SocialMedia(null,null,null)
    if(username){
        const rows=await user.checkwithusername(username)
        const {iduser}=rows[0]
        result=await socialmedia.getSocialMedia(iduser)
    }else{
        result=await socialmedia.getSocialMedia(iduser)

    }

     

    return res.status(200).json({
        success:true,
        message:"Redes sociales obtenidas correctamente",
        result
    })
    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Error al obtener las redes sociales",
            error:e.message
        })
    }
}
const updateSocialmedia=async(req,res)=>{
    try{
      const {idsocialmedia,nelink}=req.body
      const data=await getTokenData(req.headers.authorization)
      const {iduser}=data.data
      const socialmedia=new SocialMedia(null,idsocialmedia,nelink)
      await socialmedia.updateSocialMedia(iduser)
      return res.status(200).json({
            success:true,
            message:"Red social actualizada correctamente"
      })
    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Error al actualizar la red social",
            error:e.message
        })

    }
}

const deleteSocialMedia=async(req,res)=>{
    try{
        const {idsocialmedia}=req.query
        const data=await getTokenData(req.headers.authorization)
        const {iduser}=data.data
        const socialmedia=new SocialMedia(null,idsocialmedia,null)
        await socialmedia.deleteSocialMedia(iduser)
        return res.status(200).json({
            success:true,
            message:"Red social eliminada correctamente"
        })

    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Error al eliminar la red social",
            error:e.message
        })
    }
}


module.exports={
    getSocialMediaOptions,
    addSocialMedia,
    getSocialMediaofUser,
    deleteSocialMedia,
    updateSocialmedia
}
