const { createpool } = require("../config/db.config")

class ImagesUser{
    constructor(username){
    this.username=username
    }
    getAllImages=async(page,limit,skip)=>{
        const pool=await createpool()
        pool.connect()
       if(page &&limit){
          const [contador]=await pool.execute(`call contadorDeImagenes(?)`,[this.username])
       
          const {countu}=contador[0][0]
          
        //    const [resultid]=await pool.execute(`
        //    select count(usi.iduser) as countu  from users_media  usi 
        //              inner join files i on usi.idfile=i.idfile and iduser=? and usi.typeofimage!='File' and i.deleted!=1  `,[this.username])
        //   const {countu}=resultid[0]
          const totalpages=Math.ceil(countu/limit)
          const [result]=await pool.execute(`select usi.idmediauser,usi.iduser,usi.idfile,usi.created_at,i.urlfile,i.publicid
           from users_media usi 
          inner join files i on usi.idfile=i.idfile and iduser=? and usi.typeofimage!='File' and i.deleted!=1 order by usi.created_at desc limit ${limit} offset ${skip}`,[this.username])
          pool.end()
           return {
               totalImage:countu,
               page:page,
               result,
               totalpages
           }
       }else{
           const [result]=await pool.execute(`call listarImagenesOuser(?);`,[this.username])

            pool.end()
            return {
                
                result:result[0],
                
            }   
       }
       
    }


}

module.exports=ImagesUser