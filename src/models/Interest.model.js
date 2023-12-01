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
    getpeoplewithSameInter=async(namemajor,expertOrInterest)=>{
        const pool=await createpool()
        pool.connect()
        const [result]=await pool.execute(`SELECT countInterestOrExpert(?,?) as totalsameinterest`,[namemajor,expertOrInterest])
        pool.end()
        return result
    }
    getActiveUserForMajor=async(namemajor)=>{
        const pool=await createpool()
        pool.connect()
        const [result]=await pool.execute(`SELECT contar_usuarios_activos_por_carrera(?) as totalactivos`,[namemajor])
        pool.end()
        return result

    }


}

module.exports=Interest