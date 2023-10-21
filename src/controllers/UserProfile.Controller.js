const { pool } = require("../config/db.config")
const { getTokenData } = require("../config/jwt.config")
const { v4: uuidv4 } = require('uuid');

const fs=require("fs-extra");
const { uploadImage } = require("../config/cloundinary.config");
const addimageprofile=async(req,res)=>{
  try{
     console.log(req.headers)
    const data=await getTokenData(req.headers.authorization)
    console.log(data)
    if(data==null){
        res.status(404).json({
            success:false,
            message:"Erro al obtner el token"
        })
    }
    const {username,email}=data.data
    const [rows,field]=await pool.execute("select * from user where username=?",[username])
    if(rows==[]){
        res.status(404).json({
            success:false,
            message:"El usuario no existe"
        })
    }
    const code=uuidv4()
    if(req.files?.imagenprofile){
        const imageur=await uploadImage(req.files.imagenprofile.tempFilePath)
        console.log(imageur)
        const insert=await pool.execute("insert into image values(?,?,?)",[code,imageur.secure_url,imageur.public_id])
        const insertima=await pool.execute("insert into usersimages(username,idimage,typeofimage) values(?,?,?)",[username,code,"perfilimage"])
        await fs.unlink(req.files.imagenprofile.tempFilePath)
        return res.status(200).json({
            success:true,
            message:"Imagen agregada correctamente"
        })
    }
    return res.status(404).json({
        success:false,
        message:"No se agrego ninguna foto"
    })
    

}catch(e){
    res.status(500).json({
        success:false,
        message:"No se pudo agregar la imagen",
        error:e
    })
}

    
}

module.exports={
    addimageprofile
}