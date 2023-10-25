
const { pool } = require("../config/db.config")

class User{
    constructor(name,mail,major){
        this.username=name,
        this.mail=mail,
        this.major=major
    }
    
     getImage=async()=>{
         
    }

    addimage=async(username,code,type)=>{
        const result=await pool.execute("insert into usersimages(username,idimage,typeofimage) values(?,?,?)",[username,code,type])
        return result
    }
     checkexist = async(username) =>{
        const [result]= await pool.execute("select * from user where username=?",[username])
        return result
    }
    getallpublications=async(username)=>{
        const [result]=await pool.execute("select idppublicacion from  publicacion p where username=? and categoriapublicacion!=?",[username,"notas"])

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
    getallfriend=async(page,limit,username,skip)=>{
        if(page &&limit){
            const [resultid]=await pool.execute(`SELECT count(fri.idfriend) ascountfriendas FROM
             friendoffriend fri where 
             fri.friendone=? or fri.friendtwoo=?`,[username,username])
           const {ascountfriendas}=resultid[0]
           const totalpages=Math.ceil(ascountfriendas/limit)
           const [result]=await pool.execute(`SELECT * FROM friendoffriend 
           fri where fri.friendone=? or fri.friendtwoo=? order by fri.idfriend desc limit ${limit} offset ${skip}`,[username,username])
            return {
                
                result,
                totalpages
            }
        }else{
            const [result]=await pool.execute(`SELECT * FROM friendoffriend 
            fri where fri.friendone=? or fri.friendtwoo=?  `,[username,username])
             return {
                 
                 result,
                 
             }   
        }
    }



    
}

module.exports=User
