const { createpool } = require("../config/db.config")

class Interest{
    constructor(idmajor){
        this.idmajor=idmajor

    }

    getAllInterest=async()=>{
        const pool=await createpool()
        pool.connect()
        const [result]=await pool.execute(`select * from expertoorinterest where idmajor=?`,[this.idmajor])
        pool.end()
        return result
    }
}

module.exports=Interest