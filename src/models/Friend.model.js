const { createpool } = require("../config/db.config")


class Friend{
    constructor(){
                 
    }
    deleteFriend=async(iidfriendShip)=>{
        const pool=await createpool()
        pool.connect()
        await pool.execute("delete from friends where idfriendship=?",[iidfriendShip])  
        pool.end()
        
    }


     
    sendFriendRequest=async(iduser,idfriend,pool)=>{
        
       const [result]= await pool.execute("select idSender,idrecives from sendfriendship where idrecives=? and idSender=? ",[iduser,idfriend])
       const [resutlTwo]= await pool.execute("select idSender,idrecives from sendfriendship where idrecives=? and idSender=? ",[idfriend,iduser])
        if(result.length>0 || resutlTwo.length>0){
             throw new Error("Ya se envio la solicitud")
        }
      const [resultthree]=await pool.execute("select idfriendship from friends where idfriendone=? and idfriendtwo=? ",[iduser,idfriend])
      const [resultfour]=await pool.execute("select idfriendship from friends where idfriendone=? and idfriendtwo=? ",[idfriend,iduser])
        if(resultthree.length>0 || resultfour.length>0){
            throw new Error("Ya son amigos")
        }
        
        await pool.execute("insert into sendFriendShip(idSender,idrecives) values(?,?)",[iduser,idfriend])
        
    }
    acceptFriendRequest=async(iduser,idfriend,pool)=>{
        
    
      const [result]=  await pool.execute("select idSender,idrecives from sendfriendship where idrecives=? and idSender=? ",[iduser,idfriend])
      const {idSender,idrecives}=result[0]
      await pool.execute("delete from sendfriendship where idSender=? and idrecives=?",[idSender,idrecives])
    const [resulttwo]=  await pool.execute("insert into friends(idfriendone,idfriendtwo) values(?,?)",[idSender,idrecives])
    if(resulttwo.insertId==0){
        throw new Error("No se agregro la publicacion")
    }
    return true
      
        
    }
    
    deleteRequestFriend=async(iduser,idfriend)=>{
        const pool=await createpool()
        pool.connect()
        await pool.execute("delete from sendfriendship where idrecives=? and idSender=? ",[iduser,idfriend])
        pool.end()
    }
    getRequestFriends=async(iduser)=>{
        const pool=await createpool()
        pool.connect()
       const [result]= await pool.execute(`select idrecives,idSender,create_at from sendfriendship where idrecives=?`,[iduser])
       pool.end()
       return result
    }
    getSolicitudesMandadas=async(iduser)=>{
        const pool=await createpool()
        pool.connect()
        const [result]=await pool.execute(`select   idrecives,idSender,create_at  from  sendfriendship where idSender=?  `,[iduser])
        pool.end()
        return result
    
    
    }
    
    deleteSolicitudRequest=async(idsender,idrecives)=>{
        const pool=await createpool()
        pool.connect()
        await pool.execute(`delete from sendfriendship where idSender=? and idrecives=?`,[idsender,idrecives])
        pool.end()
    }

    getallfriend= async(page,limit,iduser,skip)=>{
        const pool=await createpool()
        pool.connect()
        if(page &&limit){
            const [resultid]=await pool.execute(`select count(idfriendship) as friends from 
            friends where (idfriendone=? or idfriendtwo=?)`,[iduser,iduser])
            
           const {friends}=resultid[0]
           const totalpages=Math.ceil(friends/limit)
           const [result]=await pool.execute(`select * from friends f where idfriendone=? or idfriendtwo=? order by created_at  desc limit ${limit} offset ${skip}`,[iduser,iduser])
            pool.end()
            return {
                totalfriends:friends,
                page:page,
                result,
                totalpages
            }
        }else{
            const [result]=await pool.execute(`select * from friends f where idfriendone=? or idfriendtwo=? `,[iduser,iduser])
             pool.end()
             return {
                 
                 result,
                 
             }   
        }
    }
   getSpecificFriend=async(iduser,idfriend)=>{
    const pool=await createpool()
    pool.connect()
    const [result]=await pool.execute(`select idfriendone,idfriendtwo  from friends where idfriendone=? and idfriendtwo=?`,[iduser,idfriend])
    const [resulttwo]=await pool.execute(`select idfriendone,idfriendtwo  from friends where idfriendone=? and  idfriendtwo=?`,[idfriend,iduser])
    pool.end()
    if(result.length>0 || resulttwo.length>0){
        if(result.length>0){
            return result
        }else{
            return resulttwo
        }
    }else{
        return []
    }
   
   }

   
   getSpecificFriendShip=async(iduser,idfriend)=>{
     
    const pool=await createpool()
    pool.connect()
    const [result]=await pool.execute(`select idfriendship from friends where idfriendone=? and idfriendtwo=?`,[iduser,idfriend])
    const [resulttwo]=await pool.execute(`select idfriendship from friends where idfriendone=? and idfriendtwo=?`,[idfriend,iduser])
    if(result.length>0 || resulttwo.length>0){
        if(result.length>0){
            return result
        }else{
            return resulttwo
        }
   }
   pool.end()

   }

   getSpecificRequest=async(iduser,idfriend)=>{
     const pool=await createpool()
     pool.connect()
     const [result]=await pool.execute(`select idsendFriendShip,idSender,idrecives from sendfriendship where idSender=? and idrecives=?`,[iduser,idfriend])
     pool.end()
        return result
   }

   getSpecificRequestSideSeeFr=async(iduser,idfriend)=>{
     const pool=await createpool()
     pool.connect()
     const [result]=await pool.execute(`select idsendFriendShip,idSender,idrecives from sendfriendship where idSender=? and idrecives=?`,[idfriend,iduser])
     pool.end()

     return result
   }

}
module.exports=Friend