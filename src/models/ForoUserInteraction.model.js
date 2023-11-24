const { createpool } = require("../config/db.config")
const FileUser = require("./File.model")


class ForoUserInteraction{

    constructor(idForo,iduser,contentOfInteraction,idOfComment,urlmediofinteraction,publicurl){
        this.idForo=idForo,
        this.iduser=iduser,
        this.contentOfInteraction=contentOfInteraction,
        this.idOfComment=idOfComment
        this.file=new FileUser(null,urlmediofinteraction,publicurl)

    }
    forojoin=async()=>{
        const pool=await createpool()
        pool.connect()
        const [result]=await pool.execute(`select iduser from usersinforo where idforo=? and iduser=? and deleted!=1`,[this.idForo,this.iduser])
        if(result.length>0){
          throw new Error("Ya estas unido al foro")
        }
        const [resulttwo]=await pool.execute(`select iduser from usersinforo where idforo=? and deleted=1 `,[this.idForo])
        if(resulttwo.length>0){
          await pool.execute(`update usersinforo set deleted=0 where iduser=? and idforo=?`,[this.iduser,this.idForo])
          pool.end()
          return true
        }
  
        await pool.execute(`insert into usersinforo(idforo,iduser) values(?,?)`,[this.idForo,this.iduser])
        pool.end()
      }
  
      forosOfUser=async()=>{
        const pool=await createpool()
        pool.connect()
        const [result]=await pool.execute(`select idforo  from usersinforo where iduser=? and deleted!=1 order by created_at desc`,[this.iduser])
        pool.end()
  
       return result
      }
  
      deleteMemberOfForo=async()=>{
        const pool=await createpool()
        pool.connect()
        await pool.execute(`update usersinforo set deleted=1 where iduser=? and idforo=?`,[this.iduser,this.idForo])
        pool.end()
      }
     sendeInteraction=async(pool)=>{
      const [result]=await pool.execute(`select iduser from usersinforo where idforo=? and iduser=?`,[this.idForo,this.iduser])
      if(result.length==0){
        throw new Error("No estas unido al foro")
      }
      const [resulttwo]=await pool.execute(`insert into usercommentforo(idforo,iduser,bodyofpublication) values(?,?,?)`,[this.idForo,this.iduser,this.contentOfInteraction])
      const idOfComment=resulttwo.insertId
      this.idOfComment=idOfComment
      if(resulttwo.insertId==0){
        throw new Error("No se pudo agregar la interaccion")
      }
      if(this.file.urlfile!=null){
        console.log("dd")

        const idfile= await this.file.saveFile(pool)
        console.log(idfile)
      
   if(idfile==0){
    throw new Error("no se pudo guardar el archivo de la interaccion")
   }
   
   const [addfile]=await pool.execute('insert into commentmediaforo(iduserintera,idfile) values(?,?)',[this.idOfComment,this.file.idfile])
   if(addfile.insertId==0){
    throw new Error("no se puedo guardar el archivo")
   }
      }

 
  



    }
    getMediOfUserInteraction=async()=>{
      const pool=await createpool()
      pool.connect()
      const [result]=await pool.execute(`select  comf.idcommentMediaForo, comf.iduserintera, comf.idfile,fi.urlfile
      from commentmediaforo comf inner join files fi on comf.idfile=fi.idfile and iduserintera=?`,[this.idOfComment])
      pool.end()
      return result
    }
    
}
module.exports=ForoUserInteraction