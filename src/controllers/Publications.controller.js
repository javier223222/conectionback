const User=require("../models/User.model")

const Publication =require("../models/Publication.Model")
const {getTokenData}=require("../config/jwt.config")
const { createpool } = require("../config/db.config")
const { uploadImage } = require("../config/cloundinary.config")
const FileUser=require("../models/File.model")
const fs=require("fs-extra");
const Friend = require("../models/Friend.model")
const { quickSort } = require("../helpers")

const getpublications=async(req,res)=>{
  

   try{
    const data=await getTokenData(req.headers.authorization)
    
    const {page,limit,username,type,idcategoria}=req.query
    const publicaciones=new Publication()
    const usert=new User()
    const skip=(page-1) * limit
    
    let response={
        message:`se obtuvieron las ${type} correctamente`,
       
       }

    if(username){
      
        const rows=await usert.checkwithusername(username)
        
        if(rows.length==0){
           return res.status(404).json({
                success:false,
                message:"El usuario no existe"
            })

        }
        
        const {iduser}=rows[0]
        console.log(iduser)

        const result=await publicaciones.getallpublications(page,limit,iduser,skip,idcategoria)
        
        response={
          ...response,
          page:page,

          ...result
        }

        return res.status(200).json(response)
        
     
       
    
    }else if(data){
       
        const {iduser}=data.data
       
      
        const friends=await publicaciones.getallpublications(page,limit,iduser,skip,idcategoria)
        
        response={
            ...response,
            page:page,
            ...friends
        }
        return res.status(200).json(response)
    }
    
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
     const publicaciones=new Publication(idpublicacion,null,null,null,null)
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
       const publicaciones=new Publication(idpublicacion)
       const comments=await publicaciones.getcommentofpubication()
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
        const publicaciones=new Publication(idpublicacion)
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

const addPublication=async(req,res)=>{
    const pool=await createpool()

    try{
        await pool.beginTransaction()
        const data=await getTokenData(req.headers.authorization)
        const {iduser}=data.data
        const {idtypeofprivacy,idcategoria,cuerpodelapublicacion,typeofPulicacion,tipoDecategoria}=req.body
        const publicacion=new Publication(null,iduser,idtypeofprivacy,idcategoria,cuerpodelapublicacion,tipoDecategoria?tipoDecategoria:null,typeofPulicacion?typeofPulicacion:null)
       await publicacion.addPublication(pool)
        if(req.files?.filesPublication){
            const imagen=await uploadImage(req.files.filesPublication.tempFilePath)
            const fileofuse=new FileUser(null,imagen.secure_url,imagen.public_id)
            await fileofuse.saveFile(pool)
            
            const comprobatea=/.xbm$|.tif$|.jfif$|.icc$|.tiff$|.gif$|.svg$|.webp$|.svgz$|.jpg$|.jpeg$|.png$|.bmp$|.pjp$|.apng$|.pjpeg$|.avif$/
            if(comprobatea.test(req.files.filesPublication.name)){
                const idmediUser= await fileofuse.saveFileInUser(pool,iduser,"Image")
                await publicacion.addMediaPublication(pool,idmediUser)
                await fs.unlink(req.files.filesPublication.tempFilePath)

            } else{
              const idmediuser=await fileofuse.saveFileInUser(pool,iduser,"File")
              await publicacion.addMediaPublication(pool,idmediuser)
              await fs.unlink(req.files.filesPublication.tempFilePath)
            }

            
        }
        await pool.commit()
        return res.status(200).json({
            success:true,
            message:"Publicacion agregada correctamente"
        })
      

    }catch(e){ 
     await pool.rollback()
     return res.status(500).json({
        success:false,  
        error:e.message,
        message:"Error al agregar la publicacion"
     })
    }
}
const updateBodyOfPub=async(req,res)=>{
    try{
      const {idpublicacion,neBody}=req.body
      const publication=new Publication(idpublicacion,null,null,null,neBody)
        await publication.updatebodyOfPublication()
        return res.status(200).json({
            success:true,
            message:"Cuerpo de la publicacion actualizado correctamente"
        })
    }catch(e){
       return res.status(500).json({
            success:false,
            error:e.message,
            message:"Error al actualizar el cuerpo de la publicacion"
        
       })

    }

}

const updateprivacyOfPublication=async(req,res)=>{
     try{
        const {idpublicacion,idtypeofprivacy}=req.body
        const publication=new Publication(idpublicacion,null,idtypeofprivacy,null,null)
        await publication.updateprivacyOfPublication()
        return res.status(200).json({
            success:true,
            message:"Privacidad de la publicacion actualizada correctamente"
        })
     }catch(e){
        return res.status(500).json({
            success:false,
            error:e.message,
            message:"Error al actualizar la privacidad de la publicacion"
        })
     }
}

const updatecateOfPublications=async(req,res)=>{
    try{
    const {idpublicacion,idcategoria}=req.body
    const publication=new Publication(idpublicacion,null,null,idcategoria,null)
    await publication.updatecateOfPublications()
    return res.status(200).json({
        success:true,
        message:"Categoria de la publicacion actualizada correctamente"
    
    })
    }catch(e){
     return res.status(500).json({
        success:false,
        error:e.message,
        message:"Error al actualizar la categoria de la publicacion"
     
     })
    }
}

const updateMediaPublication=async(req,res)=>{
     const pool=await createpool()
     pool.beginTransaction()
    try{
      const data=await getTokenData(req.headers.authorization)
      const {iduser}=data.data
      const {idpublicacion,idmediaUserbe,idfilebe,publicidb}=req.body
     const publication=new Publication(idpublicacion,null,null,null,null)
     if(req.files?.nefilesPublication){
        const imagen=await uploadImage(req.files.nefilesPublication.tempFilePath)
        const fileofuse=new FileUser(null,imagen.secure_url,imagen.public_id)
        await fileofuse.saveFile(pool)
        const comprobatea=/.xbm$|.tif$|.jfif$|.icc$|.tiff$|.gif$|.svg$|.webp$|.svgz$|.jpg$|.jpeg$|.png$|.bmp$|.pjp$|.apng$|.pjpeg$|.avif$/
        if(comprobatea.test(req.files.nefilesPublication.name)){
            const idmediUser= await fileofuse.saveFileInUser(pool,iduser,"Image")
            await publication.updateMediaPublication(pool,idmediUser)
            await fs.unlink(req.files.nefilesPublication.tempFilePath)
            fileofuse.setidfile(idfilebe)
            fileofuse.setpublicid(publicidb)
            await fileofuse.fisciDeleted(pool,idmediaUserbe)


        } else{
          const idmediuser=await fileofuse.saveFileInUser(pool,iduser,"File")
          await publication.updateMediaPublication(pool,idmediuser)
          await fs.unlink(req.files.filesPublication.tempFilePath)
          fileofuse.setidfile(idfilebe)
          fileofuse.setpublicid(publicidb)
          await fileofuse.fisciDeleted(pool,idmediaUserbe)
        }


     }
     
     

      pool.commit()
      return res.status(200).json({
          success:true,
          message:"Media de la publicacion actualizada correctamente"
      })
    }catch(e){
        pool.rollback()
        return res.status(500).json({
            success:false,
            error:e.message,
            message:"Error al actualizar la media de la publicacion"
        })
    
    }
}

const deletedMediaPublication=async(req,res)=>{
    const pool=await createpool()
    try{
        pool.beginTransaction()
        const {idmediauser,idpublicacion,idfile,public_id}=req.body
        const publication=new Publication(idpublicacion,null,null,null,null)
        const fileofuse=new FileUser(idfile,null,public_id)
        await publication.deletedMediaPublication(pool,idmediauser)
        
        await fileofuse.fisciDeleted(pool,idmediauser)
        pool.commit()
        return res.status(200).json({
            success:true,
            message:"Media de la publicacion eliminada correctamente"
        })
    }catch(e){
        pool.rollback()
        return res.status(500).json({
            success:false,
            error:e.message,
            message:"Error al eliminar la media de la publicacion"
        })
    }
}
const deletePublication=async(req,res)=>{
    const pool=await createpool()
    
    try{
      const {idpublicacion}=req.query
       await pool.beginTransaction()
      const publication=new Publication(idpublicacion,null,null,null,null)
      await publication.deleteLogicPublication(pool)
      await pool.commit()
     return res.status(200).json({
        success:true,
        message:"Publicacion eliminada correctamente"
     })
    
   
    }catch(e){
        await pool.rollback()
      return res.status(500).json({
        success:false,
        error:e.message,
        message:"Error al eliminar la publicacion"
      })

    }

}

const getAllFriendPublications=async(req,res,)=>{
    try{
    const data=await getTokenData(req.headers.authorization)
    const {iduser}=data.data
    const publicacion=new Publication(null,null,null,null,null)
    const friend=new Friend()
    const result=await friend.getallfriend(null,null,iduser,null)
    const user=new User()
    let totalpages=0
    const {page,limit}=req.query
    const skip=(page-1)*limit
    let allMyFriendsPubli=[]
    const interest=await user.getInterest(iduser)
    
    for (let i = 0; i < result.result.length; i++) {
        for(let key in result.result[i]){
           result.result[i][key]==iduser?delete result.result[i][key]:null
        }
       
      
     
         
     }
     
    
     if(result.result.length==0){
      let allPubliInterest=[]

       
        for (let i = 0; i < interest.length; i++) {
            const element = interest[i];
            const publi=await publicacion.getAllPublicationsForInterest(element.idineterestorexpert)
            if(publi.length!=0){
                allPubliInterest=[...new Set([...allPubliInterest,...publi])]
            }
            
        }

        allPubliInterest=quickSort(allPubliInterest)
        totalpages=Math.ceil(allPubliInterest.length/limit)

        return res.status(200).json({
            success:true,
            message:"Publicaciones de tus amigos obtenidas correctamente",
            result:allPubliInterest.slice(skip,page==1?limit:limit+1),
            totalPublicaciones:allPubliInterest.length,
            currentPage:page,
            totalpages
        })





        


     }




     for (let i = 0; i < result.result.length; i++) {
        publicacion.setIduser(result.result[i].idfriendone||result.result[i].idfriendtwo)
        console.log(result.result[i].idfriendone||result.result[i].idfriendtwo)

        const publiOfMyfrien=await publicacion.getAllGeneralPublications() 
        console.log(publiOfMyfrien)
        if(publiOfMyfrien.length!=0){
            console.log(publiOfMyfrien.length)
            for (let y = 0; y < publiOfMyfrien.length; y++) {
                const {username}=await user.getnameProfileannombre(result.result[i].idfriendone||result.result[i].idfriendtwo)
                const imagenOduser=await user.getallimagesprofile(result.result[i].idfriendone||result.result[i].idfriendtwo,'Profile')
                console.log(result.result[i].idfriendone||result.result[i].idfriendtwo)
                const {urlfile}=imagenOduser.length>0?imagenOduser[0]:{urlfile:null}
                publiOfMyfrien[i]={...publiOfMyfrien[i],username,imageuser:urlfile}
                
            }
        }
        
        if(publiOfMyfrien.length!=0){
         
            allMyFriendsPubli=[...new Set([...allMyFriendsPubli,...publiOfMyfrien])]
        }
        
        
       
        
     }

     if(allMyFriendsPubli.length==0){
        let allPubliInterest=[]

       
        for (let i = 0; i < interest.length; i++) {
            const element = interest[i];
            const publi=await publicacion.getAllPublicationsForInterest(element.idineterestorexpert)
            if(publi.length!=0){
                allPubliInterest=[...new Set([...allPubliInterest,...publi])]
            }
            
        }
        allPubliInterest=quickSort(allPubliInterest)
        totalpages=Math.ceil(allPubliInterest.length/limit)

        return res.status(200).json({
            success:true,
            message:"Publicaciones de tus amigos obtenidas correctamente",
            result:allPubliInterest.slice(skip,page==1?limit:limit+1),
            totalPublicaciones:allPubliInterest.length,
            currentPage:page,
            totalpages
        })


     }

    allMyFriendsPubli=quickSort(allMyFriendsPubli)
    console.log(allMyFriendsPubli)
   totalpages=Math.ceil(allMyFriendsPubli.length/limit)
   console.log(skip)
   console.log(totalpages)
   console.log(limit)
   
    return res.status(200).json({
        success:true,
        message:"Publicaciones de tus amigos obtenidas correctamente",
        result:allMyFriendsPubli.slice(skip,page==1?limit:limit+1),
        totalPublicaciones:allMyFriendsPubli.length,
        currentPage:page,
        totalpages
    })
    }catch(e){
        return res.status(500).json({

            success:false,
            message:"Error al obtener las publiucaciones de tus amigos",
            error:e.message
        })
    }


}
const addLike=async(req,res)=>{
    const pool=await createpool()
    try{
        pool.beginTransaction()
        const {idpublicacion}=req.body
        console.log(idpublicacion)
        const data=await getTokenData(req.headers.authorization)
        const {iduser}=data.data
        const publicacion=new Publication(idpublicacion,null,null,null,null)
        await publicacion.addLikePublicationOrUnLike(pool,iduser)

        pool.commit()

        return res.status(200).json({
            success:true,
            message:"Like agregado correctamente"
        })
    }catch(e){
        pool.rollback()
        return res.status(500).json({
            success:false,
            message:"Error al agregar el like",
            error:e.message
        })
    }
}

const addMessage=async(req,res)=>{
    const pool=await createpool()
    try{
        pool.beginTransaction()
        const {idpublicacion,comment}=req.body
        const data=await getTokenData(req.headers.authorization)
        const {iduser}=data.data
        const publicacion=new Publication(idpublicacion,null,null,null,null)
        await publicacion.addCommentPublication(pool,iduser,comment)
        pool.commit()

        return res.status(200).json({
            success:true,
            message:"Mensaje agregado correctamente"
        })
    }catch(e){
        pool.rollback()
        return res.status(500).json({
            success:false,
            message:"Error al agregar el mensaje",
            error:e.message
        })
    }
}


module.exports={
    getpublications,
    getmediaPublications,
    comments,
    commentmedia,
    likesofpublications,
    addPublication,
    updateBodyOfPub,
    updateprivacyOfPublication,
    updatecateOfPublications,
    updateMediaPublication,
    deletedMediaPublication,
    deletePublication,
    getAllFriendPublications,
    addLike,
    addMessage,
    addMessage
}