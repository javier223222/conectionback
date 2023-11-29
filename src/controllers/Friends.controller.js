const { createpool } = require("../config/db.config")
const { getTokenData } = require("../config/jwt.config")
const User=require("../models/User.model")
const Friend = require("../models/Friend.model")
const ChatInteraction = require("../models/ChatInteractions.model")
const Chat = require("../models/Chat.model")

const deleteFriend=async(req,res)=>{
    try{
      const {idfrienship,idfriendtodelete}=req.query
      const data=await getTokenData(req.headers.authorization)
      const {iduser}=data.data
      const user=new User()
      const chat=new ChatInteraction(null,null,null,null,null,null)
      await user.deleteFriend(idfrienship)
      await chat.deleteSpecificMessage(iduser,idfriendtodelete)
      

        return res.status(200).json({
            success:true,
            message:"Amigo eliminado correctamente"
        })

    }catch(e){
       return res.status(500).json({ 
            success:false,
            message:"Error al eliminar el amigo",
            error:e.message
        })
    }
}

const sendFriendRequest=async(req,res)=>{
    const pool=await createpool()
    try{ 
    pool.beginTransaction()
    const {iduserfrie}=req.body
    const data=await getTokenData(req.headers.authorization)
    const {iduser}=data.data
    const user=new User()
    await user.sendFriendRequest(iduser,iduserfrie,pool)
    await pool.commit()
    return res.status(200).json({
        success:true,
        message:"Solicitud de amistad enviada correctamente"
    })

    }catch(e){
        await pool.rollback()
      return res.status(500).json({
            success:false,
            message:"Error al enviar la solicitud de amistad",
            error:e.message
        })
    }
}
const acceptFriendRequest=async(req,res)=>{
    const pool=await createpool()
    try{
       await pool.beginTransaction()
        const {iduserNeFriend}=req.body
        const data=await getTokenData(req.headers.authorization)
        const {iduser}=data.data
        const user=new User()
        await user.acceptFriendRequest(iduser,iduserNeFriend,pool)
        await pool.commit()
        return res.status(200).json({
            success:true,
            message:"Solicitud de amistad aceptada correctamente"
        })
    }catch(e){
        await pool.rollback()
        return res.status(500).json({
            success:false,
            message:"Error al aceptar la solicitud de amistad",
            error:e.message
        })
    }

}
const deleteRequestFriend=async(req,res)=>{
    try{
      const {idusede}=req.query
      const data=await getTokenData(req.headers.authorization)
     const {iduser}=data.data
     const user=new User()
     await user.deleteRequestFriend(iduser,idusede)
     return res.status(200).json({
            success:true,
            message:"Solicitud de amistad eliminada correctamente"
     })
        
    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Error al eliminar la solicitud de amistad",
            error:e.message
        })
    }
}

const getRequestFriends=async(req,res)=>{
    try{
       const data=await getTokenData(req.headers.authorization)
       const {iduser}=data.data
       const user=new User()
       const result=await user.getRequestFriends(iduser)
       if(result.length==0){
        return res.status(200).json({
            success:true,
            message:"Solicitudes obtenidas correctamente",
            result:result
           })

       }
       for (let i = 0; i < result.length; i++) {
          const {name,apellidop,apellidom,username,iduser}=await user.getnameProfileannombre(result[i].idSender)
          const imageUser= await user.getallimagesprofile(result[i].idSender,'Profile')
        const {urlfile}=imageUser.length==0?{urlfile:null}:imageUser[0].urlfile
            result[i]={...result[i],name,apellidop,apellidom,username,urlfile}
            const {namemajor}=await user.getmajor(result[i].idSender)
            result[i]={...result[i],namemajor,iduserres:iduser}
        
       }
       
       return res.status(200).json({
        success:true,
        message:"Solicitudes obtenidas correctamente",
        result:result
       })
    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Error al traer tu solicitudes",
            error:e.message
        })
    }

}
const getallfriendprofile=async(req,res)=>{
    try{

    
    const data=await getTokenData(req.headers.authorization)
    const {usernametwo}=req.query
    const {page,limit}=req.query
    const skip=(page-1) * limit
    let response={
        message:"se obtuvieron correctamente los amigos",
       
       }
    if(usernametwo){
        const usert=new User(usernametwo,null,null)
        const friend=new Friend()
        const rows=await usert.checkwithusername(usernametwo)
        const {iduser}=rows[0]
        if(rows.length==0){
           return res.status(404).json({
                success:false,
                message:"El usuario no existe"
            })

        }
        console.log("dd")
        const result=await friend.getallfriend(page,limit,iduser,skip)
        for (let i = 0; i < result.result.length; i++) {
            for(let key in result.result[i]){
               result.result[i][key]==iduser?delete result.result[i][key]:null
            }
            console.log(result.result[i]?.idfriendone?result.result[i].idfriendone:result.result[i].idfriendtwo)
            const { name,apellidop,apellidom,username }=await usert.getnameProfileannombre(result.result[i]?.idfriendone?result.result[i].idfriendone:result.result[i].idfriendtwo)
            console.log(name)
             const imageUser= await usert.getallimagesprofile(result.result[i].idfriendone||result.result[i].idfriendtwo,'Profile')
              const {namemajor}=await usert.getmajor(result.result[i].idfriendone||result.result[i].idfriendtwo)
             
             const {urlfile}=imageUser.length==0?{urlfile:null}:imageUser[0] 
             result.result[i]={...result.result[i],name,apellidop,apellidom,username,urlfile,namemajor}
         }
         
        response={
          ...response,
          ...result
        }
       
        
       return res.status(200).json(response)
       
    
    }
     
        const {iduser}=data.data
        const user=new User()
        const friend=new Friend()
        const friends=await friend.getallfriend(page,limit,iduser,skip)
        console.log(friends)
        for (let i = 0; i < friends.result.length; i++) {
            
           for(let key in friends.result[i]){
              friends.result[i][key]==iduser?delete friends.result[i][key]:null
           }
           console.log(friends.result[i])
           const { name,apellidop,apellidom,username, }=await user.getnameProfileannombre(friends.result[i]?.idfriendone?friends.result[i].idfriendone:friends.result[i].idfriendtwo)
           
           const imageUser= await user.getallimagesprofile(friends.result[i]?.idfriendone?friends.result[i].idfriendone:friends.result[i].idfriendtwo,'Profile')
           const {namemajor}=await user.getmajor(friends.result[i].idfriendone||friends.result[i].idfriendtwo)
         
           const {urlfile}=imageUser.length==0?{urlfile:null}:imageUser[0]
           friends.result[i]={...friends.result[i],name,apellidop,apellidom,username,urlfile,namemajor}
        }
        
        
        response={
            ...response,
            ...friends,
            currentPage:page
        }
        
       return res.status(200).json(response)
    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Error al obtener todos los amigos",
            error:e.message
        })
    }

    

}

const getallSendRequest=async(req,res)=>{
    try{
       const data=await getTokenData(req.headers.authorization)
       const {iduser}=data.data
       const friend=new Friend()
       const result=await friend.getSolicitudesMandadas(iduser)
       return res.status(200).json({
           success:true,
           message:"Solicitudes enviadas obtenidas correctamente",
           result:result
       })
    }catch(e){
        return res.status(500).json({  
            success:false,
            message:"Error al obtener las solicitudes enviadas",
            error:e.message
        
        })
    }
}

const deleteSendRequest=async(req,res)=>{
    try{
        const {idrecives}=req.query
        const data=await getTokenData(req.headers.authorization)
        const {iduser}=data.data
        const friend=new Friend()
        await friend.deleteSolicitudRequest(iduser,idrecives)
        return res.status(200).json({
            success:true,
            message:"Solicitud enviada eliminada correctamente"
        })

    }catch(e){
   return res.status(500).json({
         success:false,
         message:"Error al eliminar la solicitud enviada",
         error:e.message
    
   })
    }
}
const getSpecificFriend=async(req,res)=>{
    try{
      const {idfriend}=req.query
      
     const data=await getTokenData(req.headers.authorization)
    const {iduser}=data.data
    const friend=new Friend()
    const chat =new Chat()
    const result=await friend.getSpecificFriend(iduser,idfriend)
  
    const idmessage=await chat.getSpecficiChat(iduser,idfriend)
    return res.status(200).json({
        success:true,
        message:"Amigo obtenido correctamente",
        result:result,
        idmessage
    })
    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Error al obtener el amigo",
            error:e.message
        })

    }
}
const getSpecificRequest=async(req,res)=>{
    try{
      const {idfriend}=req.query
      const data=await getTokenData(req.headers.authorization)
      const {iduser}=data.data
      const friend=new Friend()
        const result=await friend.getSpecificRequest(iduser,idfriend)
        return res.status(200).json({
            success:true,
            message:"Solicitud obtenida correctamente",
            result:result
        })

    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Error al obtener la solicitud",
            error:e.message
        })
    }
}

const getSpecificRequestSideSeeFr=async(req,res)=>{
     try{
        
        const {idfriend}=req.query
        const data=await getTokenData(req.headers.authorization)
        const {iduser}=data.data
        const friend=new Friend()
        const result=await friend.getSpecificRequestSideSeeFr(iduser,idfriend)
        return res.status(200).json({
            success:true,
            message:"Solicitud obtenida correctamente",
            result:result
        })
     }catch(e){
            return res.status(500).json({
                success:false,
                message:"Error al obtener la solicitud",
                error:e.message
            })
     }
}

module.exports={
    deleteFriend,
    sendFriendRequest,
    acceptFriendRequest,
    deleteRequestFriend,
    getRequestFriends,
    getallfriendprofile,
    getallSendRequest,
     deleteSendRequest,
     getSpecificFriend,
    getSpecificRequest,
    getSpecificRequestSideSeeFr
}
