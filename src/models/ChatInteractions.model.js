const { createpool } = require("../config/db.config")
const FileUser = require("./File.model")

class ChatInteraction{
    constructor(iduser,idmessage,interactionmen,contentMessage,urlFile,public_id){
        this.iduser=iduser
        this.idmessage=idmessage,
        this.interactionmen=interactionmen
        this.contentMessage=contentMessage
        this.file=new FileUser(null,urlFile,public_id)


    }
    setFile=(urlFile,public_id)=>{
        this.file=new FileUser(null,urlFile,public_id)
    } 
    

    addMessage=async(pool)=>{
     const [exists] =await pool.execute(`select idmessage from mesagge where idmessage=? and (iduserone=? or idusertwo=?)  `,[this.idmessage,this.iduser,this.iduser])  
        if(exists.length==0){
            throw new Error("No existe el mensaje")
        }
     const [result]=await pool.execute(`insert into sendmessage(idmessage,idusersend,conentMessage) values(?,?,?)`,[this.idmessage,this.iduser,this.contentMessage])
     this.interactionmen=result.insertId
        if(result.insertId==0){
            throw new Error("No se agrego el mensaje")
        }
        
        if(this.file.urlfile!=null){
           await this.file.saveFile(pool)
            const [resulttwo]=await pool.execute(`insert into sendmessageMedia(idmessageSend,idfile) values(?,?)`,[this.interactionmen,this.file.idfile])
            if(resulttwo.insertId==0){
                throw new Error("No se agrego el archivo")
            }
        }

        const [resultthree]=await pool.execute(`update mesagge set update_at=? where idmessage=?`,[new Date(),this.idmessage])
        if(resultthree.affectedRows==0){
            throw new Error("No se actualizo el mensaje")
        }
        
    }
  
   initializeChat=async(idusertwo)=>{
         const pool=await createpool()
            pool.connect()
         const [result]=await pool.execute(`insert into mesagge(iduserone,idusertwo) values(?,?)`,[this.iduser,idusertwo])
         this.idmessage=result.insertId
        pool.end()
         if(result.insertId==0){
              throw new Error("No se agrego el mensaje")
         }
    
   }


comprobateExistMessage=async()=>{
    const pool=await createpool()
    pool.connect()
    const [result]=await pool.execute(`select idmessage from mesagge where idmessage=?`,[this.idmessage])
    pool.end()
    if(result.length!=0){
        return true
    }
    return false
    
   }
   deleteSpecificMessage=async(iduserAdmin,iduserFriend)=>{
    const pool=await createpool()
    pool.connect()
    const [resulttwo]=await pool.execute("select idmessage from mesagge  where  iduserone=? and idusertwo=?",[iduserAdmin,iduserFriend])
    const [resulthre]=await pool.execute("select idmessage from mesagge  where iduserone=? and idusertwo=?",[iduserFriend,iduserAdmin])
    let idmessage=null
    if(resulttwo.length!=0){
        idmessage=resulttwo[0].idmessage

    }
    if(resulthre.length!=0){
        idmessage=resulthre[0].idmessage
    }

    const [result]=await pool.execute(`delete from mesagge where idmessage=?`,[idmessage])
    pool.end()
    if(result.affectedRows==0){
        throw new Error("No se elimino el mensaje")
    }
    return true
}

}


module.exports=ChatInteraction