const { pool } = require("../config/db.config");
const { getTemplate, sendEmail } = require("../config/email.config")
const { getToken, getTokenData } = require("../config/jwt.config")
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const saltRounds = 10;



const createNweUser=async (req,res)=>{
    console.log("ssmsmsnsm")
    try{
        const {username,nombre,apellidop,apellidom,correo,fechanacimiento,sexo,password}=req.body
        console.log(password)
        let encryppaswwor=password
        const code=uuidv4()
       
         const [rows]=await pool.execute("select * from user where  username=? and delete=1",[username])
         if(rows!=[]){
            res.status(400).json({
                message:"Su cuenta fue eliminada puede restaurar"
            })
         }

     

      const insert=  await pool.query(`INSERT INTO user(username,name,apellidop,apellidom,birthday,password,gender,mail,code) VALUES (?,?,?,?,?,?,?,?,?)`,
        [username,nombre,apellidop,apellidom,fechanacimiento,encryppaswwor,sexo,correo,code])
        bcrypt.genSalt(saltRounds, (err, salt)=> {
            bcrypt.hash(password, salt, (err, hash) => {
              if(err) throw err
                  pool.query('UPDATE user SET password=? where username=? ',[hash,username])
               });
           });

          
       
        const token=await getToken({username,correo,code})
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
        error:e
       })
    }
   
    
}

const confirmUser=async(req,res)=>{
   try{
     const {token}=req.params
     console.log(token)
     const data=await getTokenData(token)
     console.log(data)
     if(data==null){
      return res.redirect(process.env.ERRORPAGE)
     }
     const {username,correo,code}= data.data
 
   await  pool.query("UPDATE user SET status=? where username=?",['VERIFIED',username])
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