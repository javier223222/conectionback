
const {  createpool } = require("../config/db.config")

class User{
    constructor(name,mail,major){
        this.username=name,
        this.mail=mail,
        this.major=major
    }
    
    createUser=async(username,nombre,apellidop,apellidom,fechanacimiento,password,sexo,correo,code)=>{
        const poltwo=await createpool()
        poltwo.connect()
        await poltwo.execute("insert into users(username,name,apellidop,apellidom,birthday,password,gender,email,code) values(?,?,?,?,?,?,?,?,?)",[username,nombre,apellidop,apellidom,fechanacimiento,password,sexo,correo,code])
        poltwo.end()
    }
    getnameProfileannombre=async(iduser)=>{
     const pool=await createpool()
     pool.connect()
      const [result] =await pool.execute("select name,apellidop,apellidom,iduser,username from users where iduser=?",[iduser])  
      const results=result[0]
      pool.end()
      return results
    }
    getmajor=async(iduser)=>{
        const pool=await createpool()
      pool.connect()
       const [result]=await pool.execute(`SELECT ma.namemajor,numersemster  
       FROM dataaboutmajor dm inner join major ma on dm.idmajor=ma.idmajor and dm.iduser=?`,[iduser])
       const results=result[0]
     pool.end()
       return results
    }
     getImage=async()=>{
         
    }
     
    getallimagesprofile=async(iduser,type)=>{
        const pool=await createpool()
        pool.connect()
       const [result]=await pool.execute(`select usi.idmediauser, f.urlfile,f.publicid,f.created_at from users_media  usi
            inner join files f on usi.idfile=f.idfile and usi.iduser=? and usi.typeofimage=? and usi.deleted !=1
            ORDER BY usi.created_at desc limit 1 ;`,[iduser,type]) 
        pool.end()
             
            return result
    }

    getallinterest=async(idmajor)=>{
       const pool=await createpool()
       pool.connect()
        const [result]=await pool.execute("select * from expertoorinterest where idmajor=?",[idmajor])
        pool.end()
        return result
    }
    addhobbie=async(hobbie)=>{
      const pool=await createpool()
      pool.connect()
      await pool.execute("insert into hobbies(namehobbie) values(?)",[hobbie])
       
      pool.end()
    }
    getidhobbie=async(hobbie)=>{
        const pool=await createpool()
        pool.connect()
        const [result]=await pool.execute("select idhobbie from hobbies where namehobbie=?",[hobbie])
        pool.end()
        return result
    }
    addhobbieofuser=async(iduser,idhobbie)=>{
        const pool=await createpool()
        pool.connect()
        await pool.execute("insert into  hobbiesof(iduser,idhobbie) values(?,?)",[iduser,idhobbie])
        pool.end()
        
    }

    deletehobbie=async(iduser,idhobbie)=>{
        const pool=await createpool()
        pool.connect()
        await pool.execute("delete from hobbiesof where iduser=? and idhobbiesof=?",[iduser,idhobbie])
        pool.end()

         
    }

    getallhobiesForUser=async(iduser)=>{
        const pool=await createpool()
        pool.connect()
        const [result]= await pool.execute(`select hof.idhobbiesof,hof.idhobbie,hof.iduser,h.namehobbie from 
         hobbies h inner join hobbiesof hof on h.idhobbie=hof.idhobbie and iduser=?`,[iduser])
        pool.end()
         return result
    }
    
    addInterestOrExpert=async(idineterestorexpert,iduser,expert)=>{
        const pool=await createpool()
        pool.connect()
        await pool.execute("insert into select_expert_or_interes(idineterestorexpert,iduser,experot) values(?,?,?)",[idineterestorexpert,iduser,expert])
        pool.end()

    }
    deleteinteresOrExpert=async(iduser,idineterestorexpert)=>{
        const pool=await createpool()
        pool.connect()
        await pool.execute("delete from select_expert_or_interes where iduser=? and idselectexperorinterest=?",[iduser,idineterestorexpert])
         pool.end()
    }
    getexpert=async(iduser)=>{
        const pool=await createpool()
        pool.connect()
        const [result]=await pool.execute(`SELECT idselectexperorinterest,namefininteorexpert FROM expertoorinterest ei inner join select_expert_or_interes sei
        on ei.idineterestorexpert=sei.idineterestorexpert and  iduser=? and  sei.experot=? order by ei.idineterestorexpert desc `,[iduser,1])
        pool.end()
        return result
    }

    getInterest=async(iduser)=>{
        const pool=await createpool()
        pool.connect()
        const [result]=await pool.execute(`SELECT idselectexperorinterest,namefininteorexpert FROM expertoorinterest ei inner join select_expert_or_interes sei
        on ei.idineterestorexpert=sei.idineterestorexpert and iduser=? and sei.experot=? order by ei.idineterestorexpert desc `,[iduser,0])
        pool.end()
        return result
    }

    

    saveFile=async(urlfile,idpublic)=>{
        const pool=await createpool()
        pool.connect()
        await  pool.execute("insert into files(urlfile,publicid) values(?,?)",[urlfile,idpublic])
        pool.end()
         
    }
    getidfile=async(urlfile)=>{
        const pool=await createpool()
        pool.connect()
        const [result]=await pool.execute("select idfile from files where urlfile=?",[urlfile])
         pool.end()
        return result
    }
    getDescription=async(iduser)=>{
        const pool=await createpool()
        pool.connect()
        const [result]=await pool.execute("select description from perfildescription where iduser=?",[iduser])
        pool.end()
        return result
    }

    addimage=async(idfile,iduser,type)=>{
        const pool=await createpool()
        pool.connect()
        await pool.execute("insert into users_media(idfile,iduser,typeofimage) values(?,?,?)",[idfile,iduser,type])
        pool.end()
         

    }
    updateName=async(name,iduser)=>{
        const pool=await createpool()
        pool.connect()
         await pool.execute("update users set name=?,updated_at=? where iduser=?",[name,new Date(),iduser])
        pool.end()
    }
    updateApellidoP=async(apellidop,iduser)=>{
        const pool=await createpool()
        pool.connect()
        await pool.execute("update users set apellidop=?,updated_at=? where iduser=?",[apellidop,new Date(),iduser])
        pool.end()
         
    }
    updateApellidoM=async(apellidom,iduser)=>{
        const pool=await createpool()
        pool.connect()
        await pool.execute("update users set apellidom=?,updated_at=? where iduser=?",[apellidom,new Date(),iduser])   
        pool.end()
        
    }
     
     checkexist = async(username,email) =>{
        const pool=await createpool()
        
         pool.connect()
        const [result]= await pool.execute("select iduser  from users where (username=? or email=? ) and deleted!=1",[username,email])
        pool.end()
        return result
    }
    checkexitsdescription=async(iduser)=>{
        const pool=await createpool()
        pool.connect()
        const [result]=await pool.execute("select iduser from perfildescription where iduser=?",[iduser])
         pool.end()
        return result
    }
    updateDescription=async(description,iduser)=>{
        const pool=await createpool()
        pool.connect()
        await pool.execute("update perfildescription set description=?,update_at=? where iduser=?",[description,new Date(),iduser])
        pool.end()
         
    }
    checkwithusername=async(username)=>{
        const pool=await createpool()
        pool.connect()
        const [result]=await pool.execute("select iduser  from users where username=? and deleted!=1",[username])
        pool.end()
        return result
    }
    addDescription=async(description,iduser)=>{
        const pool=await createpool()
        pool.connect()
        await pool.execute("insert into perfildescription(description,iduser) values(?,?)",[description,iduser])
        pool.end()
         

    }
    checkexistwithid=async(iduser)=>{}
    checkexistdelet =async(username,email)=>{
        const pooltwo=await createpool()
        pooltwo.connect()
        const [result]= await pooltwo.execute("select * from users where ( username=? or email=? ) and deleted=1",[username,email])
        pooltwo.end()
         
        return result
    }
    selectAllInformationLogins=async(usernameoremail)=>{
       const pooltwo=await createpool()
       pooltwo.connect()
        const [result]=await pooltwo.execute('SELECT username,email,password,status,iduser FROM users where (username=? or email=?) and deleted!=1 and status="VERIFIED"',[usernameoremail,usernameoremail])
        pooltwo.end()
        return result
    }
    selectAllmajorLogin=async(iduser)=>{
        const poltwo=await createpool()
        poltwo.connect()
        const [result] =await poltwo.execute(`select namemajor,ma.idmajor from major ma 
        inner join dataaboutmajor dama on
         ma.idmajor=dama.idmajor and dama.iduser=?`,[iduser])
        poltwo.end() 
        return result
    }
    updatepassword=async(hash,date,iduser)=>{
        const pool=await createpool()
        pool.connect()
        pool.query("UPDATE users SET password=?,updated_at=? where iduser=? ",[hash,date,iduser])
        pool.end()
       
    }
   
    addmajor=async(iduser,namemajor)=>{
        const pool=await createpool()
        pool.connect()
        const [result]=await pool.execute("select idmajor from major where namemajor=?",[namemajor])
        const {idmajor}=result[0]
        const [resultwo]=await pool.execute("insert into dataaboutmajor(iduser,idmajor) values(?,?)",[iduser,idmajor])
        pool.end()
        return resultwo
    }
    updateSemester=async(iduser,semester)=>{
        const pool=await  createpool()
        pool.connect()
        await pool.execute("update dataaboutmajor set numersemster=? where iduser=?",[semester,iduser])
        pool.end()
    }
  
    changepassword=async(username,hash)=>{
        const pool=await createpool()
          pool.connect()
        const [result]= await pool.execute(`select * from users where username=? `,[username])
        console.log(result[0])
        const [update]=await pool.execute("update users SET password=? where iduser=?",[hash,result[0].iduser])
         pool.end()
        return update
        
    }

    updataVerified=async(iduser)=>{
    const pool=await createpool()
    pool.connect()
     await pool.execute("UPDATE users SET status=?,updated_at=? where iduser=?",['VERIFIED',new Date(),iduser])
      pool.end()
    }

    
    deleteuserOrSave=async(deleteorno,iduser)=>{
        const pool=await createpool()
        pool.connect()
        if(deleteorno){
            await pool.execute('UPDATE users SET deleted=?,updated_at=?,deleted_at=? where iduser=?',[deleteorno,new Date(),new Date(),iduser])
            
        }else{
            await pool.execute('UPDATE users SET deleted=?,updated_at=?,deleted_at=? where iduser=?',[deleteorno,new Date(),new Date(),iduser])
             
        }
        pool.end()
       
    }

   getallimages=async(page,limit,username,skip)=>{
        
         const pool=await createpool()
         pool.connect()
        if(page &&limit){
            const [resultid]=await pool.execute(`
            select count(usi.iduser) as countu  from users_media  usi 
                      inner join files i on usi.idfile=i.idfile and iduser=? and usi.typeofimage!='File' and i.deleted!=1  `,[username])
           const {countu}=resultid[0]
           const totalpages=Math.ceil(countu/limit)
           const [result]=await pool.execute(`select * from users_media usi 
           inner join files i on usi.idfile=i.idfile and iduser=? and usi.typeofimage!='File' and i.deleted!=1 order by usi.created_at desc limit ${limit} offset ${skip}`,[username])
           pool.end()
            return {
                totalImage:countu,
                page:page,
                result,
                totalpages
            }
        }else{
            const [result]=await pool.execute(`select * from users_media usi 
            inner join files i on usi.idfile=i.idfile and iduser=? and usi.typeofimage!='File' and i.deleted!=1 order by usi.created_at  desc `,[username])
             pool.end()
             return {
                 
                 result,
                 
             }   
        }
        
      
    }

    getallfriend=async(page,limit,iduser,skip)=>{
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



 addSocialMedia=async(iduser,link,idsocialMedia)=>{
    const pool=await createpool()
    pool.connect()
    await pool.execute("insert into socialmediofuser(iduser,usrlsocialmedia,idsocialmedia) values(?,?,?)",[iduser,link,idsocialMedia])
    pool.end()
 }
  

 getSocialMedia=async(iduser)=>{
    const pool=await createpool()
    pool.connect()
    const [result]=await pool.execute(`select smu.idsocialmediofuser,smu.idsocialmedia,smu.usrlsocialmedia,sm.nameofsocialmedia from 
    socialmediofuser smu inner join socialmedia sm on smu.idsocialmedia=sm.idsocialmedia and smu.iduser=? `,[iduser])
    pool.end()
    return result
 }
    
 deleteSocialMedia=async(iduser,idsocialmediofuser)=>{
    const pool=await createpool()
    pool.connect()
    await pool.execute("delete from socialmediofuser where iduser=? and idsocialmediofuser=?",[iduser,idsocialmediofuser])

    pool.end()
    
 }

 updateSocialMedia=async(iduser,idsocialmediofuser,link)=>{
    const pool=await createpool()
    pool.connect()
    await pool.execute("update socialmediofuser set usrlsocialmedia=? where iduser=? and idsocialmediofuser=?",[link,iduser,idsocialmediofuser])
    pool.end()
 }
 getOptionsSocialMedia=async()=>{
  const pool=await createpool()
  pool.connect()
 const [result]= await pool.execute(`select idsocialmedia,nameofsocialmedia from socialmedia`)
 pool.end()
 return result

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
  const [resulttwo]=  await pool.execute("insert into friends(idfriendone,idfriendtwo) values(?,?)",[idSender,idrecives])
  await pool.execute(`insert into mesagge(iduserone,idusertwo) values(?,?)`,[idSender,idrecives])
  await pool.execute("delete from sendfriendship where idSender=? and idrecives=?",[idSender,idrecives])

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
   const [result]= await pool.execute(`select idsendFriendShip,idrecives,idSender,create_at from sendfriendship where idrecives=?`,[iduser])
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

deleteSolicitudRequest=async(idrecives,idsender)=>{
    const pool=await createpool()
    pool.connect()
    await pool.execute(`select`)
}
}

module.exports=User
