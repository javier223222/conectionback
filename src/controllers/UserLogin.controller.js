const { serialize } = require("cookie");
const { pool } = require("../config/db.config")
const { getToken } = require("../config/jwt.config")
const bcrypt = require('bcryptjs');
const login=async(req,res)=>{
    try{
        const {usernameoremail,passworduser}=req.body
        console.log(req.cookies)
        const [rows,field]=await pool.execute('SELECT * FROM user where username=? or mail=?',[usernameoremail,usernameoremail])
        console.log(rows[0])
        if(rows==undefined){
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
        let serialized=null
        if(result!=[]){
            const {namemajor}=result[0]
            
            token=await getToken({username,mail,namemajor})
            serialized= serialize("tokenUser",token,{
                httpOnly:true,
                secure:process.env.NODE_ENV =='production',
                sameSite:process.env.NODE_ENV=='production'?"none":"lax",
                maxAge:60 * 60 * 24 ,
                path:'/'
            })
        }else{
            token=await getToken({username,mail})
            serialized= serialize("tokenUser",token,{
                httpOnly:true,
                secure:process.env.NODE_ENV=='production'?"none":"lax",
                sameSite:"none",
                maxAge:60 * 60 * 24  ,
                path:'/'
            })
        }
     
    
       
        console.log(token)
        bcrypt.compare(passworduser, password, (err, result)=> {
            if(err) throw err;
           if(result && status !="UNIVERIFIED"  ){
            
            res.setHeader('Set-Cookie',serialized)
               return res.status(200).json({
                   success:true,
                //    resultt:{
                //        result:result,
                       
                //        token:token
                //    }
                })
           
           }else{
               return res.status(200).json({
                   success:false,
                   msg:"el usuario no verificado"
               })
           }
       });

    

    }catch(e){
        res.status(200).json({
            success:false,
            message:"nombre de usuario o correo o password invalidos",
           
          })
    }
    
    
      
}


module.exports={
    login
}
