const { createpool } = require("../config/db.config")

class Foros{
    constructor(idForo,idmajorForo,iduser,contentOfInteraction){

      this.idForo=idForo,
      this.idmajporForo=idmajorForo
      this.iduser=iduser
      
    }


    getAllForosForMajor=async()=>{
     const pool=await createpool()
     pool.connect()
     const [result]=await pool.execute(`select idforo,namemajor,major.idmajor,nameforo,forodescription,foro.created_at,imageofForo 
     from foro inner join major on major.idmajor=foro.idmajor where major.idmajor=? order by created_at desc `,[this.idmajporForo])
     pool.end()

    return result
    }

    getInformaTionoforo=async()=>{
      const pool=await createpool()
      pool.connect()
      const [result]=await pool.execute(`select forodescription,nameforo,imageofForo
      from foro where idforo=? `,[this.idForo])
      pool.end()
      return result
    }

    getAllpeopleInForo=async()=>{
      
      const pool=await createpool()
      pool.connect()
      const [result]=await pool.execute(`select iduserinforo,idforo,created_at,iduser 
                                        from usersinforo where idforo=? and deleted!=1 order by created_at desc `,[this.idForo])
       pool.end()                                 
       return result                                 

    }
    getAllmediForo=async()=>{
      const pool=await createpool()
      pool.connect()
      const [result]=await pool.execute(`select come.idcommentMediaForo,fi.urlfile from usercommentforo userc inner join commentmediaforo come on userc.iduserintera=come.idcommentMediaForo and userc.idforo=?
      left join files fi on fi.idfile=come.idfile;`,[this.idForo])
       pool.end()                                 
       return result

    }

    getAllInteracionsOfForo=async()=>{
      const pool=await createpool()
      pool.connect()
      const [result]=await pool.execute(`select usco.iduserintera,idforo,iduser,usco.created_at,bodyofpublication,urlfile from usercommentforo usco left join commentmediaforo comefo 
      on usco.iduserintera=comefo.iduserintera left join files fi on comefo.idfile=fi.idfile having idforo=?  order by usco.created_at asc`,[this.idForo])
      pool.end()
      return result
    }


    


}
module.exports=Foros