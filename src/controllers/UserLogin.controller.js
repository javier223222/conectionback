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
        const {username,email,password,status}=rows[0]
        console.log(username+status)
        const token=await getToken({username,email})
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