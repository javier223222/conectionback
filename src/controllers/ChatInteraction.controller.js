
const { uploadImage } = require("../config/cloundinary.config")
const { createpool } = require("../config/db.config")
const { getTokenData } = require("../config/jwt.config")
const { pusher } = require("../config/pusher.config")
const ChatInteraction = require("../models/ChatInteractions.model")
const Friend = require("../models/Friend.model")

const User = require("../models/User.model")
const fs=require("fs-extra")
const addMessage = async (req, res) => {
    const pool=await createpool()
    try{ 
        pool.beginTransaction()
        const {idmessgae,contentmessage,idfriend}=req.body
        const user=new User()
        const data=await getTokenData(req.headers.authorization)
        const {iduser}=data.data
        const chatInteraction=new ChatInteraction(iduser,idmessgae,null,contentmessage,null,null)
        const friend=new Friend()
        const resutl=await chatInteraction.comprobateExistMessage()
        if(!resutl){
          const specficiFriend=await friend.getSpecificFriend(iduser,idfriend)
          if(specficiFriend.length==0){
              return res.status(400).json({
                    success:false,
                    message:"No son amigos"
                
              })

          }
         await  chatInteraction.initializeChat(idfriend)
          
          
          
        }
        const imageUser= await user.getallimagesprofile(iduser,'Profile')
        const {urlfile}=imageUser[0]
        const {name,apellidop,apellidom,username}=await user.getnameProfileannombre(iduser)
        if(req.files?.messageMedia){
            const media=await uploadImage(req.files.messageMedia.tempFilePath)
            chatInteraction.setFile(media.secure_url,media.public_id)
         
            await chatInteraction.addMessage(pool)
            await fs.unlink(req.files.messageMedia.tempFilePath)
           
         
         
            await pusher.trigger(`${chatInteraction.idmessage}message`,"message",{
                idmessage:idmessgae,
                idmessageSend:chatInteraction.interactionmen,
                imageuser:urlfile,
                name,
                apellidop,
                apellidom,
                username,
                urlfile:media.secure_url,
                conentMessage:contentmessage,
                created_at:new Date()

            })
            pool.commit()


            return res.status(200).json({
                success:true,
                message:"Mensaje enviado"
            })
            
            
        }


      
        await chatInteraction.addMessage(pool)

        await pusher.trigger(`${chatInteraction.idmessage}message`,"message",{
               idmessage:idmessgae,
                idmessageSend:chatInteraction.interactionmen,
                imageuser:urlfile,
                name,
                apellidop,
                apellidom,
                username,
                urlfile:null,
                conentMessage:contentmessage,
                created_at:new Date()
        })
        
        pool.commit()
        return res.status(200).json({
            success:true,
            message:"Mensaje enviado"
        })


    }catch(e){
        pool.rollback()
        return res.status(500).json({
            success:false,
            message:"Error al enviar el mensaje",
            error:e.message
        
        })
    }
}



module.exports={
    addMessage
}