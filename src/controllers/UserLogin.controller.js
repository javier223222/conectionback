const { pool } = require("../config/db.config")
const { getToken } = require("../config/jwt.config")
const bcrypt = require('bcryptjs');
const login=async(req,res)=>{
    try{
        const {usernameoremail,passworduser}=req.body
        const [rows,field]=await pool.execute('SELECT * FROM user where username=? or mail=?',[usernameoremail,usernameoremail])
        console.log(rows[0])
        if(!rows){
           return res.status(404).json({
            success:false,
            message:"Usuario no encotrado"
           })
        }
       
        const {username,mail,password,status}=rows[0]
        const [result]=await pool.query(`select namemajor from majorofuniversity ma 
                                 inner join dataaboutmajor dama on
                                  ma.idmajoruniver=dama.idmajoruniver and username=?`,[username])
        console.log(result)
        console.log(username+status)
        let token=null
        if(result!=[]){
            const {namemajor}=result[0]
            token=await getToken({username,mail,namemajor})
        }else{
            token=await getToken({username,mail})
        }
     
    
       
        console.log(token)
        bcrypt.compare(passworduser, password, (err, result)=> {
            if(err) throw err;
           if(result && status !="UNIVERIFIED"  ){
               return res.json({
                   success:true,
                   resultt:{
                       result:result,
                       
                       token:token
                   }
                })
           
           }else{
               return res.json({
                   success:false,
                   msg:"el usuario no esta verificado"
               })
           }
       });

    

    }catch(e){
        res.status(500).json({
            success:false,
            message:"Error al iniciar sesion",
            error:e
          })
    }
    
    
      
}


module.exports={
    login
}