const { createpool } = require("../config/db.config")

class SocialMedia{
    constructor(idsocialmedia,idSocialMediaOfUser,link){
      this.idsocialmedia=idsocialmedia
      this.idSocialMediaOfUser=idSocialMediaOfUser
      this.link=link

    }

    getOptionsSocialMedia=async()=>{
        const pool=await createpool()
        pool.connect()
       const [result]= await pool.execute(`select idsocialmedia,nameofsocialmedia from socialmedia`)
       pool.end()
       return result
    }
    addSocialMedia=async(iduser)=>{
        const pool=await createpool()
        pool.connect()
        await pool.execute("insert into socialmediofuser(iduser,usrlsocialmedia,idsocialmedia) values(?,?,?)",[iduser,this.link,this.idsocialmedia])
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

    deleteSocialMedia=async(iduser)=>{
        const pool=await createpool()
        pool.connect()
        await pool.execute(`delete from socialmediofuser where iduser=? and idsocialmediofuser=?`,[iduser,this.idSocialMediaOfUser])
        pool.end()
    }

    updateSocialMedia=async(iduser)=>{
        const pool=await createpool()
        pool.connect()
        await pool.execute("update socialmediofuser set usrlsocialmedia=? where iduser=? and idsocialmediofuser=?",[this.link,iduser,this.idSocialMediaOfUser])
        pool.end()
    }
    

}

module.exports=SocialMedia