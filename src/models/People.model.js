const { createpool } = require("../config/db.config");

class People{
    constructor(name){
        this.name = name;
    }
    searchPeople = async () => {
        const pool=await createpool()
        pool.connect()
        const [result]=await pool.query(`SELECT username,iduser,name,apellidop,apellidom
         FROM users WHERE MATCH(username, name,apellidop,apellidom) AGAINST (?)
      `,[this.name])
      console.log(result)
        pool.end()
        return result
    }
}

module.exports=People