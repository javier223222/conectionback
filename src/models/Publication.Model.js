const { createpool } = require("../config/db.config");
const { get } = require("../routes/UserProfile.route");

class Publication{
  constructor(idpublication){
    this.idpublication=idpublication
  }

 addPublication=async(iduser,idtypeofprivacy,idcategoria,cuerpodelapublicacion)=>{
    const pool=await createpool()
    pool.connect()
    const [result]=await pool.execute(`insert into
     publicaciones(iduser,idtypeofprivacy,idcategoria,cuerpodelapublicacion) 
     values(?,?,?,?)`,[iduser,idtypeofprivacy,idcategoria,cuerpodelapublicacion])
    
    pool.end()
    return result.insertId
 }
  getallpublications=async(page,limit,iduser,skip,type)=>{
    const pool=await createpool()
    pool.connect()
    if(page!=undefined &&limit!=undefined){
        const [resultid]=await pool.execute(`select count(idpublicacion) as publications from 
        publicaciones where iduser=? and idcategoria`,[iduser])
       const {publications}=resultid[0]
       const totalpages=Math.ceil(publications/limit)
       const [result]=await pool.execute(`select p.idpublicacion,p.created_at,p.cuerpodelapublicacion,tpr.nameofprivacy,ca.namecategoria from publicaciones p inner join typeofprivacidad tpr on p.idtypeofprivacy=tpr.idtypeofprivacy inner join
       categoria ca on p.idcategoria=ca.idcategoria and p.iduser=? and ca.namecategoria=? order by p.created_at; desc limit ${limit} offset ${skip}`,[iduser,type])
       pool.end()
        return {
            
            result,
            totalpages
        }
    }else{
        
        const [result]=await pool.execute(`select p.idpublicacion,p.created_at,p.cuerpodelapublicacion,tpr.nameofprivacy,ca.namecategoria from publicaciones p inner join typeofprivacidad tpr on p.idtypeofprivacy=tpr.idtypeofprivacy inner join
        categoria ca on p.idcategoria=ca.idcategoria and p.iduser=? and ca.namecategoria=?  `,[iduser,type])
        pool.end()

         return {
             
             result,
             
         }   
    }
  
}

getmediapublication=async()=>{
    const pool=await createpool()
    pool.connect()
    const [result]=await pool.execute(`SELECT  ip.idImageOfPublication,ip.idmediauser,ip.idpublicacion,ip.created_at,ume.iduser,f.urlfile,f.publicid FROM image_of_publication
     ip inner join users_media ume on ip.idmediauser=ume.idmediauser 
     and ip.idpublicacion=? inner join files f on ume.idfile=f.idfile`,[this.idpublication])
     pool.end()
     return result
}

getcommentofpubication=async()=>{
    const pool=await createpool()
    pool.connect()
    const [result]=await pool.execute(`SELECT * coments_of_publication where idpublicacion=? order by created_at asc`,[this.idpublication])
    pool.end()
    return result
    
}
getcoomentMedia=async(idcomment)=>{
     const pool=await createpool()
     pool.connect()
     const [result]=await pool.execute(`select  mcop.idcoomentofpublication,mcop.idfile,f.urlfile,f.publicid,mcop.idcoment 
     from media_comment_ofpublications mcop inner join files f on mcop.idfile = f.idfile and mcop.idcoment=?`,[idcomment])
     pool.end()
        return result
}

getlikepublication=async()=>{
    const pool=await createpool()
    pool.connect()
    const [result]=await pool.execute(`
    SELECT count(idlike) as totallikes FROM  likes where idpublicacion=?
    `,[this.idpublication])
    const totalikes=result[0].totallikes
    const [rows]=await pool.execute(`select * from likes where idpublicacion=?`,[this.idpublication])
    pool.end()
    return {
        totalikes,
        rows
    }
}

}

module.exports = Publication;