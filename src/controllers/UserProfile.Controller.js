const { pool } = require("../config/db.config")
const { getTokenData } = require("../config/jwt.config")
const { v4: uuidv4 } = require('uuid');

const fs=require("fs-extra");
const { uploadImage } = require("../config/cloundinary.config");
const addimageprofile=async(req,res)=>{
  try{
     console.log(req.headers)
     const {type}=req.body
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
        const insertima=await pool.execute("insert into usersimages(username,idimage,typeofimage) values(?,?,?)",[username,code,type])
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

const getprofileImageb=async(req,res)=>{
   
    try{

  

    const data=await getTokenData(req.headers.authorization)
    const {username}=req.query
    const {type}=req.body
    // if(username==null){
    //     res.status(404).json({
    //         success:false,
    //         message:"Erro al obtener el usuario"
    //     })
    // }
    if(username){
        const [rows,field]=await pool.execute(`select usi.dateofimage,i.urlimage from usersimages usi 
        inner join image i on usi.idimage=i.idimage and usi.username=?  and usi.typeofimage=?
        ORDER BY usi.dateofimage desc limit 1`,[username,type])
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
        ORDER BY usi.dateofimage desc limit 1`,[username,type])
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
    
console.log("dd")
}catch(e){
    res.status(500).json({
        success:false,
        message:"Erro al recibir imagenes",
        error:e
    })
  
}

 
}
const adddescription=async(req,res)=>{
    try{
        console.log(req.headers)
        const {description}=req.body
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
     const [result]=await pool.query("select * from perfildescription where username=?",[username])
     console.log(result)
     if(result!=[]){
        res.status(404).json({
            success:false,
            message:"El usuario ya tiene descripcion",
            
        })
    //   await  pool.execute(`UPDATE perfildescription 
    //    set description=? where username=? `,[description,username])
    //    res.status(200).json({
    //     success:true,
    //     message:"La descripcion del usuario fue actualizada correctamente"
    //    })
     }else{

        await pool.execute(`insert into perfildescription(username,description)
                          values(?,?)  `,[username,description])
        res.status(200).json({
            success:true,
            message:"La descripcion del usuario fue agregado correctamente"
           })
     }
    }catch(e){
        res.status(500).json({
            success:false,
            message:"No se pudo agregar la descripcion",
            error:e
        })
    }


}

const updatedescription=async(req,res)=>{
    try{
        console.log(req.headers)
        const {description}=req.body
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
     const [result]=await pool.query("select * from perfildescription where username=?",[username])
     console.log(result)
     if(result==[]){
        res.status(404).json({
            success:false,
            message:"El usuario no tiene descripcion",
            
        })
  
     }else{

        await  pool.execute(`UPDATE perfildescription 
        set description=? where username=? `,[description,username])
        res.status(200).json({
         success:true,
         message:"La descripcion del usuario fue actualizada correctamente"
        })
     }
    }catch(e){
        res.status(500).json({
            success:false,
            message:"No se pudo actualizar la descripcion",
            error:e
        })
    }

}

const getdescription=async(req,res)=>{
    try{
        const data=await getTokenData(req.headers.authorization)
        const {username}=req.query
        if(username){
            const [rows,field]=await pool.execute("select * from user where username=?",[username])
            if(rows==[]){
                res.status(404).json({
                    success:false,
                    message:"El usuario no existe"
                })
    
            }
            const [result]=await pool.execute(`
             select description 
             from perfildescription
             where username=?
            `,[username])
            const {description}=result[0]
            res.status(200).json({
                success:true,
                description
            })
        }else if(data!=null){
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
            const [result]=await pool.execute(`
             select description 
             from perfildescription
             where username=?
            `,[username])
            const {description}=result[0]
            res.status(200).json({
                success:true,
                description
            })


        }else{
            res.status(401).json({
                success:false,
                description:"No se enviaron ningun datos"
            })
        }

    }catch(e){
     res.status(500).json({
        success:false,
        message:"Erro al obtener la descripcion"
     })
    }
}
   
module.exports={
    addimageprofile,
    getprofileImageb,
    adddescription,
    updatedescription,
    getdescription
}