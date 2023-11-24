const { createPool } = require("mysql2")
const { uploadImage } = require("../config/cloundinary.config")
const { getTokenData } = require("../config/jwt.config")
const fs=require("fs-extra")
const ForoUserInteraction = require("../models/ForoUserInteraction.model")
const { createpool } = require("../config/db.config")
const { pusher } = require("../config/pusher.config")
const Friend = require("../models/Friend.model")
const User = require("../models/User.model")

const forojoin=async(req,res)=>{
    try{
        const data=await getTokenData(req.headers.authorization)
        const {iduser}=data.data
        const {idforo}=req.body
        const foros=new ForoUserInteraction(idforo,iduser,null,null)
        await foros.forojoin()
        return res.status(200).json({
            success:true,
            message:"Unido al foro"
        })

    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Error al unirse al foro",
            error:e.message
        })
    
    }
}

const forosOfUser=async(req,res)=>{
    try{
        const data=await getTokenData(req.headers.authorization)
        const {iduser}=data.data
        const foros=new ForoUserInteraction(null,iduser,null,null)
        const result=await foros.forosOfUser()
        return res.status(200).json({
            success:true,
            message:"Foros obtenidos",
            result
        })
    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Error al obtener los foros",
            error:e.message
        })
    
    }
}
const deleteMemberOfForo=async(req,res)=>{
  try{
     const data=await getTokenData(req.headers.authorization)
      const {iduser}=data.data
      const {idforo}=req.body
     const foros=new ForoUserInteraction(idforo,iduser,null,null)
     await foros.deleteMemberOfForo()
     return res.status(200).json({ 
            success:true,
            message:"Usuario eliminado del foro"
     })
  }catch(e){
    return res.status(500).json({
        success:false,
        message:"Error al eliminar al usuario del foro",
        error:e.message
    
    })

  }
}
const addInteractioninForo=async(req,res)=>{
    const pool=await createpool()

    try{
        pool.beginTransaction()
    const {idforo,contentOfInteraction}=req.body
    const data=await getTokenData(req.headers.authorization)
    const {iduser}=data.data
    const user=new User()
    const {name,apellidop,apellidom,username}=await user.getnameProfileannombre(iduser)
    const imageUser= await user.getallimagesprofile(iduser,'Profile')
    const {urlfile}=imageUser.length==0?{urlfile:null}:imageUser[0]
    const friend=new Friend()

    if(req.files?.mediaInteractionForo){
        console.log("ddd")
        const imageur=await uploadImage(req.files.mediaInteractionForo.tempFilePath)
        const foros=new ForoUserInteraction(idforo,iduser,contentOfInteraction,null,imageur.secure_url,imageur.public_id)

        await foros.sendeInteraction(pool)
        await fs.unlink(req.files.mediaInteractionForo.tempFilePath)
        
    
        await pusher.trigger(`${idforo}foro`,"message",{
            iduserintera:foros.idOfComment,
            idforo:idforo,
            iduser:iduser,
            imagenuser:urlfile,
            name,
            apellidop,
            apellidom,
            username,
            created_at:new Date(),
            bodyofpublication:contentOfInteraction,
            urlfile:foros.file.urlfile,
             
             
        })
        pool.commit()
        return res.status(200).json({
            success:true,
            message:"Interaccion agregada"
        })
        
    }
    const foros=new ForoUserInteraction(idforo,iduser,contentOfInteraction,null,null,null)
    await foros.sendeInteraction(pool)
   
    
    
    await pusher.trigger(`${idforo}foro`,"message",{
        
        iduserintera:foros.idOfComment,
        idforo:idforo,
        iduser:iduser,
        imagenuser:urlfile,
        name,
        apellidop,
        apellidom,
        username,
        created_at:new Date(),
        bodyofpublication:contentOfInteraction,
        urlfile:null,
   })




   pool.commit()
    return res.status(200).json({
        success:true,
        message:"Interaccion agregada"
    })

    }catch(e){
        pool.rollback()
        return res.status(500).json({
            success:false,
            message:"Error al agregar la interaccion",
            error:e.message
        
        })
    }
}
const getmediOfInractionUser=async(req,res)=>{
    try{
        const {iduserinter}=req.query
        const foro=new ForoUserInteraction(null,null,null,iduserinter,null,null)
        const result=await foro.getMediOfUserInteraction()
        return res.status(200).json({
            success:true,
            message:"media obtenida correctamente",
            result
        })

    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Error al obtner la media del usuario"
        })
    }
}


module.exports={
    forojoin,
    forosOfUser,
    deleteMemberOfForo,
    addInteractioninForo,
    getmediOfInractionUser
}