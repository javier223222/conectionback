const { createpool } = require("../config/db.config");
const { get } = require("../routes/UserProfile.route");

class Publication{
  constructor(idpublication,iduser,idtypeofprivacy,idcategoria,cuerpodelapublicacion,tipoDecategoria,typeofPulicacion){
    this.idpublication=idpublication
    this.iduser=iduser,
    this.idtypeofprivacy=idtypeofprivacy,
    this.idcategoria=idcategoria,
    this.cuerpodelapublicacion=cuerpodelapublicacion
    this.tipoDecategoria=tipoDecategoria
    this.typeofPulicacion=typeofPulicacion
     
  }
  setIduser=async(iduser)=>{
   this.iduser=iduser
  }

 addPublication=async(pool)=>{
   
    const [result]=await pool.execute(`insert into
     publicaciones(iduser,idtypeofprivacy,idcategoria,cuerpodelapublicacion,tipoDecategoria,typeofPulicacion) 
     values(?,?,?,?,?,?)`,[this.iduser,this.idtypeofprivacy,this.idcategoria,this.cuerpodelapublicacion,this.tipoDecategoria?this.tipoDecategoria:null,this.typeofPulicacion?this.typeofPulicacion:null])
    if(result.insertId==0){
        throw new Error("No se agregro la publicacion")
    }
    this.idpublication=result.insertId
    return result.insertId
 }
 
 addMediaPublication=async(pool,idmediauser)=>{
        const [result]=await pool.execute(`insert into image_of_publication(idmediauser,idpublicacion) values(?,?)`,[idmediauser,this.idpublication])
        if(result.insertId==0){
            throw new Error("No se agrego el archivo")
        }
        return result.insertId
 }
 updatebodyOfPublication=async()=>{
  const pool=await createpool()
  pool.connect()
    const [result]=await pool.execute(`update publicaciones set cuerpodelapublicacion=?,updated_at=? where idpublicacion=?`,[this.cuerpodelapublicacion,new Date(),this.idpublication])
  pool.end()
 }
updateprivacyOfPublication=async()=>{
        const pool=await createpool()
        pool.connect()
        const [result]=await pool.execute(`update publicaciones set idtypeofprivacy=?,updated_at=? where idpublicacion=?`,[this.idtypeofprivacy,new Date(),this.idpublication])
        pool.end()
}

updateMediaPublication=async(pool,idmediauser)=>{
    const [result]=await pool.execute(`update image_of_publication set idmediauser=? where idpublicacion=?`,[idmediauser,this.idpublication])
    if(result.affectedRows==0){
        throw new Error("No se pudo actualizar la imagen")
    }
    return true
}


deletedMediaPublication=async(pool,idmediauser)=>{
    const [result]=await pool.execute(`delete from image_of_publication where idmediauser=? and idpublicacion=?`,[idmediauser,this.idpublication])
    if(result.affectedRows==0){
        throw new Error("No se pudo eliminar la imagen")
    }
    return true
}
addLikePublicationOrUnLike=async(pool,iduser)=>{
    const [resulttwo]=await pool.execute(`select iduser from likes where iduser=? and idpublicacion=?`,[iduser,this.idpublication])
    if(resulttwo.length>0){
        const [result]=await pool.execute(`delete from likes where iduser=? and idpublicacion=?`,[iduser,this.idpublication])
        if(result.affectedRows==0){
            throw new Error("No se pudo eliminar el like")
        }
        return true
    }

    const [result]=await pool.execute(`insert into likes(iduser,idpublicacion) values(?,?)`,[iduser,this.idpublication])
    if(result.insertId==0){
        throw new Error("No se pudo agregar el like")
    }
    return result.insertId
}

addCommentPublication=async(pool,iduser,comment)=>{
    const [result]=await pool.execute(`insert into coments_of_publication(iduser,idpublicacion,connent_Of_Comment) values(?,?,?)`,[iduser,this.idpublication,comment])
    if(result.insertId==0){
        throw new Error("No se pudo agregar el comentario")
    }
    return result.insertId
}
addCommentPublicationMedia=async(pool,idcoment,idfile)=>{
   const [result]=await pool.execute(`insert into media_comment_ofpublications(idcoment,idfile) values(?,?)`,[idcoment,idfile])
    if(result.insertId==0){
        throw new Error("No se pudo agregar el comentario")
    }
    return result.insertId
}

deletedCommentPublication=async(pool,idcoment)=>{
    const [result]=await pool.execute(`delete from coments_of_publication where idcoment=?`,[idcoment])
    const [resulttwo]=await pool.execute(`delete from media_comment_ofpublications where idcoment=?`,[idcoment])

    if(result.affectedRows==0){
        throw new Error("No se pudo eliminar el comentario")
    }
    return true
}


deletePublication=async(pool,iduser)=>{
   const [result]=await pool.execute(`delete from publicaciones where iduser=? and idpublicacion=?`,[iduser,this.idpublication])
   const [resulttwo]=await pool.execute(`
   SELECT  ume.idmediauser FROM image_of_publication
     ip inner join users_media ume on ip.idmediauser=ume.idmediauser 
     and ip.idpublicacion=? and ume.deleted=0  inner join files f on ume.idfile=f.idfile
   `,[this.idpublication])
    const {idmediauser}=resulttwo[0]
    const [resultthree]=await pool.execute(`delete from image_of_publication where idpublicacion=?`,[this.idpublication])
    const [resultfour]=await pool.execute(`delete from users_media where idmediauser=?`,[idmediauser])

    if(result.affectedRows==0||resultthree.affectedRows==0||resultfour.affectedRows==0){
         throw new Error("No se pudo eliminar la publicacion")
    }
    return true
}

deleteLogicPublication=async(pool)=>{
    const [result]=await pool.execute(`update publicaciones set deleted=1,deleted_at=? where  idpublicacion=?`,[new Date(),this.idpublication])
    const [resulthree]=await pool.execute(`
    SELECT  ume.idmediauser FROM image_of_publication
      ip inner join users_media ume on ip.idmediauser=ume.idmediauser 
      and ip.idpublicacion=? and ume.deleted=0  inner join files f on ume.idfile=f.idfile
    `,[this.idpublication])
    if(resulthree.length==0){

    }else{
        const {idmediauser}=resulthree[0]
        console.log(idmediauser)
        const [resultfour]=await pool.execute(`update users_media set deleted=1,deleted_at=? where  idmediauser=?`,[new Date(),idmediauser])
       if(resultfour.affectedRows==0){
           throw new Error("No se pudo eliminar la publicacion")
       }
    }

   
    const [resulttwo]=await pool.execute(`update image_of_publication set deleted=1,deleted_at=? where  idpublicacion=?`,[new Date(),this.idpublication])
  
    if(result.affectedRows==0|| resulttwo.affectedRows==0 ){
         throw new Error("No se pudo eliminar la publicacion")
    }
    return true
}

  getallpublications=async(page,limit,iduser,skip,idcategoria)=>{
    const pool=await createpool()
    pool.connect()
    if(page!=undefined &&limit!=undefined){
        const [resultid]=await pool.execute(`select count(idpublicacion) as publications from 
        publicaciones where iduser=? and idcategoria=? and deleted!=1`,[iduser,idcategoria])
       const {publications}=resultid[0]
       const totalpages=Math.ceil(publications/limit)
       const [result]=await pool.execute(`select p.idpublicacion,p.tipoDecategoria,ei.namefininteorexpert,p.typeofPulicacion,p.iduser,p.cuerpodelapublicacion,tp.nameofprivacy,ca.namecategoria,p.created_at from publicaciones p inner join typeofprivacidad tp on p.idtypeofprivacy=tp.idtypeofprivacy and p.iduser=? inner join
       categoria ca on p.idcategoria=ca.idcategoria and ca.idcategoria=? and p.deleted!=1  left join expertoorinterest ei on ei.idineterestorexpert=p.typeofPulicacion order by p.created_at desc  limit ${limit} offset ${skip}`,[iduser,idcategoria])
       console.log(result)
       pool.end()
        return {
            
            result,
            totalpages
        }
    }else{
        
        const [result]=await pool.execute(`select p.idpublicacion,p.tipoDecategoria,ei.namefininteorexpert,p.typeofPulicacion,p.iduser,p.cuerpodelapublicacion,tp.nameofprivacy,ca.namecategoria,p.created_at from publicaciones p inner join typeofprivacidad tp on p.idtypeofprivacy=tp.idtypeofprivacy and p.iduser=? inner join
        categoria ca on p.idcategoria=ca.idcategoria and ca.idcategoria=? and p.deleted!=1  left join expertoorinterest ei on ei.idineterestorexpert=p.typeofPulicacion  order by p.created_at desc `,[iduser,idcategoria])
        pool.end()

         return {
             
             result,
             
         }   
    }
  
}

getAllGeneralPublications=async()=>{
    const pool=await createpool()
    pool.connect()
    const [result]=await pool.execute(`select p.idpublicacion,p.tipoDecategoria,ei.namefininteorexpert,p.typeofPulicacion,p.iduser,p.cuerpodelapublicacion,tp.nameofprivacy,ca.namecategoria,p.created_at from publicaciones p inner join typeofprivacidad tp on p.idtypeofprivacy=tp.idtypeofprivacy and p.iduser=? inner join
    categoria ca on p.idcategoria=ca.idcategoria  and p.deleted!=1 left join expertoorinterest ei on ei.idineterestorexpert=p.typeofPulicacion  order by p.created_at desc `,[this.iduser])
    return result

}

getmediapublication=async()=>{
    const pool=await createpool()
    pool.connect()
    const [result]=await pool.execute(`SELECT  ip.idImageOfPublication,ip.idmediauser,ip.idpublicacion,ip.created_at,ume.iduser,f.urlfile,f.publicid FROM image_of_publication
     ip inner join users_media ume on ip.idmediauser=ume.idmediauser 
     and ip.idpublicacion=? and ume.deleted=0  inner join files f on ume.idfile=f.idfile`,[this.idpublication])
     pool.end()
     return result
}

getcommentofpubication=async()=>{
    const pool=await createpool()
    pool.connect()
    const [result]=await pool.execute(`SELECT coments_of_publication.idcoment,coments_of_publication.idpublicacion,
    coments_of_publication.created_at,coments_of_publication.connent_Of_Comment,
    coments_of_publication.update_at,coments_of_publication.iduser,coments_of_publication.deleted,
    coments_of_publication.deleted_at,users.username
     FROM  coments_of_publication inner join users on users.iduser=coments_of_publication.iduser 
     and coments_of_publication.idpublicacion=?
     order by created_at asc `,[this.idpublication])
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
    const [rows]=await pool.execute(`select idlike,idpublicacion,iduser from likes where idpublicacion=?`,[this.idpublication])
    pool.end()
    return {
        totalikes,
        rows
    }
}




getAllPublicationsForInterest=async(idinterest)=>{
    const pool=await createpool()
    pool.connect()
    const [result]=await pool.execute(`select p.idpublicacion,p.tipoDecategoria,p.typeofPulicacion,p.iduser,p.cuerpodelapublicacion,tp.nameofprivacy,ca.namecategoria,p.created_at from
     publicaciones p inner join typeofprivacidad tp on p.idtypeofprivacy=tp.idtypeofprivacy  inner join
    categoria ca on p.idcategoria=ca.idcategoria  and p.deleted!=1  inner join expertoorinterest ei on ei.idineterestorexpert=p.typeofPulicacion and   p.typeofPulicacion=? order by p.created_at desc`,[idinterest])
    return result
   
}

}

module.exports = Publication;