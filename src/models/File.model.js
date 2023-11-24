const { deleteImage } = require("../config/cloundinary.config")

class FileUser{
    constructor(idfile,urlfile,publicid){
        this.idfile=idfile,
        this.urlfile=urlfile,
        this.publicid=publicid
    }
    setidfile=(idfile)=>{
        this.idfile=idfile
    }
    setpublicid=(publicid)=>{
        this.publicid=publicid
    }
    seturlfile=(urlfile)=>{
        this.urlfile=urlfile
    }
    saveFile=async(pool)=>{
        const [result]=await pool.execute(`insert into files(urlfile,publicid) values(?,?)`,[this.urlfile,this.publicid])
      
        if(result.insertId==0){
            throw new Error("No se pudo guardar el archivo")
        }
        this.idfile=result.insertId
        return result.insertId 

    }

    saveFileInUser=async(pool,iduser,typeofimage)=>{
        const [result]=await pool.execute(`insert into users_media(idfile,iduser,typeofimage) values(?,?,?)`,[this.idfile,iduser,typeofimage])
        if(result.insertId==0){
            throw new Error("No se pudo guardar el archivo")
        }


        return result.insertId 
    }

    logicDeleted=async(pool,idmediauser)=>{
        const [resultwot]=await pool.execute(`update users_media set deleted=1,deleted_at=? where idmediauser=?`,[new Date(),idmediauser])
        const [result]=await pool.execute(`update files set deleted=1,deleted_at=? where idfile=?`,[this.idfile,new Date()])
        

        if(result.affectedRows==0 || resultwot.affectedRows==0){
            throw new Error("No se pudo eliminar el archivo")
        }
        return true
    }
    fisciDeleted=async(pool,idmediauser)=>{

        const [resultwot]=await pool.execute(`delete from users_media where idmediauser=?`,[idmediauser])
        const [result]=await pool.execute(`delete from files where idfile=?`,[this.idfile])
        deleteImage(this.publicid)
        if(result.affectedRows==0 || resultwot.affectedRows==0){
            throw new Error("No se pudo eliminar el archivo")
        }

        return true
    }

    
 






    
}
module.exports=FileUser
