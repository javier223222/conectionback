const { createpool } = require("../config/db.config")

class Hobbie{
    constructor(hobbie,idhobbie,idhobbieoFuser){
        this.hobbie=hobbie
        this.idhobbie=idhobbie
        this.idhobbieoFuser=idhobbieoFuser
    }
    setIDhobbie=(idhobbie)=>{
        this.idhobbie=idhobbie
    }
    addHobbie=async()=>{
        const pool=await createpool()
        pool.connect()
        await pool.execute(`insert into hobbies(namehobbie) values(?)`,[this.hobbie])
        pool.end()
    }
    getIdHobbie=async()=>{
        const pool=await createpool()
        pool.connect()
        const [result]=await pool.execute("select idhobbie from hobbies where namehobbie=?",[this.hobbie])
        pool.end()
        this.idhobbie=result[0].idhobbie
        return result
    }

    addhobbieofuser=async(iduser)=>{
        const pool=await createpool()
        pool.connect()
        await pool.execute("insert into  hobbiesof(iduser,idhobbie) values(?,?)",[iduser,this.idhobbie])
        pool.end()
        
    }

    deleteHobbie=async(iduser)=>{
        const pool=await createpool()
        pool.connect()
        await pool.execute("delete from hobbiesof where iduser=? and idhobbiesof=?",[iduser,this.idhobbieoFuser])
        pool.end()
    }

    getAllHobbiesOfUser=async(iduser)=>{
        const pool=await createpool()
        pool.connect()
        const [result]= await pool.execute(`select hof.idhobbiesof,hof.idhobbie,hof.iduser,h.namehobbie from 
        hobbies h inner join hobbiesof hof on h.idhobbie=hof.idhobbie and iduser=?`,[iduser])

        pool.end()
        return result
    }



}

module.exports=Hobbie