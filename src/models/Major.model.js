const { createpool } = require("../config/db.config")

class Major{
    constructor(namemajor){
        this.namemajor=namemajor

    }

    getMajor=async(iduser)=>{
       const pool=await createpool()
       pool.connect()
       const [result]=await pool.execute(`SELECT ma.namemajor,numersemster  
       FROM dataaboutmajor dm inner join major ma on dm.idmajor=ma.idmajor and dm.iduser=?`,[iduser])
       const results=result[0]

       pool.end()
       return results
    }
    addMajor=async(iduser)=>{
        const pool=await createpool()
        pool.connect()
        const [result]=await pool.execute("select idmajor from major where namemajor=?",[this.namemajor])
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


}

module.exports=Major
