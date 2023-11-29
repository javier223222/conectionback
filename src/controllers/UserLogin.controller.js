const { serialize } = require("cookie");
const { pool } = require("../config/db.config")
const { getToken } = require("../config/jwt.config")
const bcrypt = require('bcryptjs');
const User = require("../models/User.model");
const login=async(req,res)=>{
      
    try{
      
        const usersr=new User()
        const {usernameoremail,passworduser}=req.body
        if(!usernameoremail || !passworduser){
            return res.status(404).json({
               success:false,
               message:"datos no recibidos"
            })
        }
       
        const rows=await usersr.selectAllInformationLogins(usernameoremail) 
        const deleted=await usersr.checkexistdelet(usernameoremail,usernameoremail) 
         console.log(rows)
         console.log(deleted)
        if(rows.length==0 && deleted.length==0){
           return res.status(400).json({
            success:false,
            message:"username,email or password incorrecto"
           })
        }else if(deleted.length!=0){
            return res.status(400).json({success:false,message:"La cuenta fue eliminada"})
        }
       
        const {username,email,password,status,iduser}=rows[0]
        console.log(username,email,password,status,iduser)
        const result=await usersr.selectAllmajorLogin(iduser)
        console.log(result)
        console.log(username+status)
        let token=null
        let serialized=null
        if(result.length!=0){
            const {namemajor,idmajor}=result[0]
            
            token=await getToken({username,email,namemajor,iduser,idmajor})
            serialized= serialize("tokenUser",token,{
                httpOnly:true,
                secure:process.env.NODE_ENV =='production',
                sameSite:"lax",
                maxAge:60 * 60 * 24 ,
                path:'/'
            })
        }else{
            token=await getToken({username,email,iduser})
            serialized= serialize("tokenUser",token,{
                httpOnly:true,
                secure:process.env.NODE_ENV =='production',
                sameSite:"lax",
                maxAge:60 * 60 * 24  ,
                path:'/'
            })
        }
     
    
       
        console.log(token)
        bcrypt.compare(passworduser, password, (err, result)=> {
            if(err) throw err;
           if(result && status !="UNIVERIFIED" || status!=null ){
            
            res.setHeader('Set-Cookie',serialized)
               return res.status(200).json({
                   success:true,
                //    resultt:{
                //        result:result,
                       
                //        token:token
                //    }
                })
           
           }else if (!result){
               return res.status(400).json({
                   success:false,
                   message:"username,email or password incorrecto"
               })
           }else{
            return res.status(400).json({
                success:false,
                message:"username,email or password incorrecto"
            })
           }
       });
 
 

    }catch(e){
        res.status(200).json({
            success:false,
            message:"nombre de usuario o correo o password invalidos",
            error:e.message
           
          })
    }
    
    
      
}



module.exports={
    login
}
