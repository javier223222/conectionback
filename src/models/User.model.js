
const { pool } = require("../config/db.config")

class User{
    constructor(name,mail,major){
        this.username=name,
        this.mail=mail,
        this.major=major
    }
    
    static getImage=async()=>{
         
    }

     checkexist= async(username) =>{
        const [result]= await pool.execute("select * from user where username=?",[username])
        return result
    }
     getallimages=async(page,limit,username,skip)=>{
        

        if(page &&limit){
            const [resultid]=await pool.execute(`
            select count(usi.username) as countu  from usersimages usi 
           inner join image i on usi.idimage=i.idimage and username=? `,[username])
           const {countu}=resultid[0]
           const totalpages=Math.ceil(countu/limit)
           const [result]=await pool.execute(`select * from usersimages usi 
           inner join image i on usi.idimage=i.idimage and username=? order by usi.dateofimage desc limit ${limit} offset ${skip}`,[username])
            return {
                
                result,
                totalpages
            }
        }else{
            const [result]=await pool.execute(`select * from usersimages usi 
            inner join image i on usi.idimage=i.idimage and username=? order by usi.dateofimage desc `,[username])
             return {
                 
                 result,
                 
             }   
        }
      
    }

    
}

module.exports=User
