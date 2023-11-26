const { createpool } = require("../config/db.config");


class Chat{
    constructor(iduser,usertwo,idmessage){
        this.iduser = iduser;
        this.usertwo = usertwo;
        this.idmessage = idmessage;

    }

  getAllChatMember=async()=>{
        const pool=await createpool()
        pool.connect()
        const [result]=await pool.execute("select idmessage,iduserone,idusertwo,deleted,created_at,update_at  from mesagge where iduserone=? or iduserTwo=? order by update_at desc ",[this.iduser,this.iduser])
        pool.end()
        return result

  }
  
  gettallmessageOfSpecificChat=async()=>{
      const pool=await createpool()
      pool.connect()
      const [result]=await pool.execute(`select me.idmessage,me.iduserone,me.idusertwo,sem.idmessageSend,sem.created_at,sem.idusersend,sem.conentMessage,sememe.idsendMessageMedia,fi.idfile,fi.urlfile from mesagge me inner join sendmessage sem on me.idmessage=sem.idmessage
      left join sendmessagemedia sememe on sememe.idmessageSend=sem.idmessageSend left join files fi on fi.idfile=sememe.idfile having me.idmessage=?
      order by sem.created_at asc`,[this.idmessage])
      pool.end()
      return result
  }

  getAllMedioOfSpecificMessage=async()=>{
    const pool=await createpool()
    pool.connect()
    const [result]=await pool.execute(`select me.idmessage,fi.idfile,fi.urlfile from mesagge me inner join sendmessage sem on me.idmessage=sem.idmessage
    inner join sendmessagemedia sememe on sememe.idmessageSend=sem.idmessageSend inner join files fi on fi.idfile=sememe.idfile having me.idmessage=?
    order by sem.created_at asc`,[this.idmessage])
    pool.end()
    return result
  }

  getSpecficiChat=async(iduseradmin,iduser)=>{
    const pool=await createpool()
    pool.connect()
    const [result]=await pool.execute(`select idmessage from mesagge where iduserone=? and idusertwo=?`,[iduseradmin,iduser])
    const [resulttwo]=await pool.execute(`select idmessage from mesagge where iduserone=? and idusertwo=?`,[iduser,iduseradmin])

    if(result.length>0 || resulttwo.length>0){
        if(result.length>0){
            return result
        }else{
            return resulttwo
        }
    }
    
    pool.end()
    return result
     
  }

  





   
}
module.exports=Chat