const mysql2=require("mysql2/promise")
const pool=mysql2.createPool({
    host:process.env.HOST,
    user:process.env.USERMYSQL,
    password:process.env.PASSWORDMYSQL,
    database:process.env.DB,
    port:process.env.PORTMYSQL
})

module.exports={
    pool
}
