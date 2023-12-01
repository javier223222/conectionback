const { pool } = require("../config/db.config");
const { getTemplate, sendEmail } = require("../config/email.config")
const { getToken, getTokenData } = require("../config/jwt.config")
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const User = require("../models/User.model");
const Major = require("../models/Major.model");
const saltRounds = 10;



const createNweUser=async (req,res)=>{
  
    try{
        const {username,nombre,apellidop,apellidom,correo,fechanacimiento,sexo,password,namemajor}=req.body
        const user=new User()
       
        let encryppaswwor=password
        const code=uuidv4()
        const rows= await user.checkexist(username,correo)
         const result=await user.checkexistdelet(username,correo) 
        
         if(rows.length!=0){
           return res.status(200).json({
                success:false,
                message:"La cuenta ya existe"
            })
         }else if(!result.length==0){
           return res.redirect("http://localhost:3000/Register/information")
         }

     
         console.log("jj")
       await user.createUser(username,nombre,apellidop,apellidom,new Date(fechanacimiento),password,sexo,correo,code) 
     
      const resultof=await user.checkexist(username,correo) 
      
      const {iduser}=resultof[0]
        bcrypt.genSalt(saltRounds, (err, salt)=> {
            bcrypt.hash(password, salt, (err, hash) => {
              if(err) throw err
              user.updatepassword(hash,new Date(),iduser)

                  
               });
           });
           
     const major=new Major(namemajor)      


     await major.addMajor(iduser)            


          
       
        const token=await getToken({username,correo,code,iduser})
        const template= getTemplate(username,token)
       await sendEmail(correo,"Confirmacion de cuenta",template)
        return res.status(200).json({
            success:true,
            message:"Registro completado correctamente"
        })



    }catch(e){
       return res.status(500).json({
        success:false,
        message:"El correo o la contrasenia ya existe",
        error:e.message
       })
    }
   
    
}


const confirmUser=async(req,res)=>{
   try{
    const user=new User()
     const {token}=req.params
     console.log(token)
     const data=await getTokenData(token)
     console.log(data)
     if(data==null){
      return res.redirect(process.env.ERRORPAGE)
     }
     const {username,correo,code,iduser}= data.data
     
   await  user.updataVerified(iduser)
   //todo for next js template
    return res.redirect(process.env.LOGINPAGE)
   }catch(e){
    return res.redirect(process.env.ERRORPAGE)
   }

}

module.exports={
    createNweUser,
    confirmUser
}