const { pool } = require("../config/db.config")

const query=async(query,data)=>{
     const [result]=await  pool.execute(query,data)
     return result
}