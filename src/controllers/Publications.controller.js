const User=require("../models/User.model")
const Publication =require("../models/Publication.Model")
const {getTokenData}=require("../config/jwt.config")
const getpublications=async(req,res)=>{
    const data=await getTokenData(req.headers.authorization)
    const {username}=req.query
    const {page,limit}=req.query
    const publicaciones=new Publication()
    const usert=new User()
    const skip=(page-1) * limit
    const {type}=req.query
    let response={
        message:`se obtuvieron las ${type} correctamente`,
       
       }
   try{
    if(username){
      
        const rows=await usert.checkwithusername(username)
        
        if(rows.length==0){
           return res.status(404).json({
                success:false,
                message:"El usuario no existe"
            })

        }
        const {iduser}=rows[0]

        const result=await publicaciones.getallpublications(page,limit,iduser,skip,type)
        response={
          ...response,
          ...result
        }

       
        
     
       
    
    }else if(data){
       
        const {iduser}=data.data
       
      console.log(iduser)
      console.log(page)
        const friends=await publicaciones.getallpublications(page,limit,iduser,skip,type)
        
        response={
            ...response,
            ...friends
        }
    }
    return res.status(200).json(response)
   }catch(e){
    return res.status(500).json({
        success:false,
        e:e.message,
        message:"Erro al obtener las publicaciones"
     })
   }
}





const getmediaPublications=async(req,res)=>{
    try{
     const {idpublicacion}=req.query
     const publicaciones=new Publication()
     const images=await publicaciones.getmediapublication(idpublicacion)
     return res.status(200).json({
      success:true,
      message:"Media obtenida correctamente",
      result:images
     })

    }catch(e){
        return res.status(500).json({
            success:false,
            error:e.message,
            message:"Error al obtner la media"
        })
    }
}
const comments=async(req,res)=>{
    try{
       const {idpublicacion}=req.query
       const publicaciones=new Publication()
       const comments=await publicaciones.getcommentofpubication(idpublicacion)
       return res.status(200).json({
        success:true,
        message:"Comentarios obtenidos correctamente",
       comments
       })
    }catch(e){
      return res.status(500).json({
            success:false,
            error:e.message,
            message:"Error al obtener los comentarios"
        
      })
    }
       
}

const commentmedia=async(req,res)=>{
    try{
     const {idcomment}=req.query
     const publicacion=new Publication()
     const comments=await publicacion.getcoomentMedia(idcomment)
     return res.status(200).json({
            success:true,
            message:"Media de un comentario obtenido correctamente",
            result:comments
        
     })
    }catch(e){
        return res.status(500).json({
            success:false,
            error:e.message,
            message:"Error al obtener la media de un comentario"
        })
    }
}

const likesofpublications=async(req,res)=>{
    try{
        const {idpublicacion}=req.query
        const publicaciones=new Publication()
        const likes=await publicaciones.getlikepublication(idpublicacion)
      return  res.status(200).json({ 
            success:true,
            message:"Likes de una publicacion obtenidos correctamente",
            ...likes
        })
    }catch(e){
        return res.status(500).json({
            success:false,
            error:e.message,
            message:"Error al obtener los likes de una publicacion"
        })
    }

}
module.exports={
    getpublications,
    getmediaPublications,
    comments,
    commentmedia,
    likesofpublications
}