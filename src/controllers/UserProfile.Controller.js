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
    const {username,email}=data.data
    const [rows,field]=await pool.execute("select * from user where username=?",[username])
    if(rows==[]){
        res.status(404).json({
            success:false,
            message:"El usuario no existe"
        })
    }

}


}

const getprofileImageb=async(req,res)=>{


    const data=await getTokenData(req.headers.authorization)
    const {username}=req.query
    // if(username==null){
    //     res.status(404).json({
    //         success:false,
    //         message:"Erro al obtener el usuario"
    //     })
    // }
    if(username){
        const [rows,field]=await pool.execute(`select usi.dateofimage,i.urlimage from usersimages usi 
        inner join image i on usi.idimage=i.idimage and usi.username=?  and usi.typeofimage=?
        ORDER BY usi.dateofimage desc limit 1`,[username,'perfilimage'])
        console.log(rows)
        if(rows==[]){
            res.status(404).json({
                success:false,
                message:"El usuario no tiene una imagen"
            })
        }
        res.status(200).json({
            success:true,
            message:"imagen obtenida correctamente",
            urlprofile:rows[0].urlimage,
            dateofimage:rows[0].dateofimage
        })
    }else if(data){
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

        const [result]=await pool.query(`select usi.dateofimage,i.urlimage from usersimages usi 
        inner join image i on usi.idimage=i.idimage and usi.username=?  and usi.typeofimage=?
        ORDER BY usi.dateofimage desc limit 1`,[username,'perfilimage'])
        console.log(result)
        if(rows==[]){
            res.status(404).json({
                success:false,
                message:"El usuario no tiene una imagen"
            })
        }
        res.status(200).json({
            success:true,
            message:"imagen obtenida correctamente",
            urlprofile:result[0].urlimage,
            dateofimage:result[0].dateofimage
        })

    }
   

 
}

   
module.exports={
    addimageprofile,
    getprofileImageb
}