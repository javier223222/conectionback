
const { getTokenData } = require("../config/jwt.config")
const { v4: uuidv4 } = require('uuid');

const fs=require("fs-extra");
const { uploadImage } = require("../config/cloundinary.config");

const User = require("../models/User.model");
const { json } = require("sequelize");
const { createpool } = require("../config/db.config");




const updatename=async(req,res)=>{
    try{
        const user=new User()
      const data=await getTokenData(req.headers.authorization)
      const {iduser}=data.data
      const {name}=req.body
        await user.updateName(name,iduser)
        return res.status(200).json({
            success:true,
            message:"Usuario actualizado correctamente"
        })
    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Error al actualizar el usuario"

        })

    }
}
const getinformation=async(req,res)=>{
    try{
        const data=await getTokenData(req.headers.authorization)
        const {username}=req.query
        const user=new User()
        if(username){
            const result=await user.checkwithusername(username)
            const {iduser}=result[0]
            const userinfo=await user.getnameProfileannombre(iduser)
            const usermajor=await user.getmajor(iduser)
            
            return res.status(200).json({
                success:true,
                message:"Informacion obtenida correctamente",
                ...userinfo,
                ...usermajor
            })
        }
        const {iduser}=data.data
        const userinfo=await user.getnameProfileannombre(iduser)
        const usermajor=await user.getmajor(iduser)
       
        return res.status(200).json({
            success:true,
            message:"Informacion obtenida correctamente",
            ...userinfo,
            ...usermajor
        
        })
    }catch(e){
     return res.status(500).json({
        success:false,
        message:"error al obtener la informacion",
        error:e.message
    
     })
    }
}
const getInformacionById=async(req,res)=>{
    try{
      const {iduser}=req.query
      const user=new User()
      const userinfo=await user.getnameProfileannombre(iduser)
      const usermajor=await user.getmajor(iduser)
        return res.status(200).json({
            success:true,
            message:"Informacion obtenida correctamente",
            ...userinfo,
            ...usermajor
        
        })
    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Error al obtener los datos del usuario",
        })
    }
}

const updateapellidop=async(req,res)=>{
    try{
     const user=new User()
     const data=await getTokenData(req.headers.authorization)
     const {iduser}=data.data
     const {apeliidop}=req.body
     await user.updateApellidoP(apeliidop,iduser)
     return res.status(200).json({
        success:true,
        message:"Usuario actualizado correctamente"
     })
    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Error al actualizar el usuario",
            error:e.message
        })
    }
}
const updataApellidoM=async(req,res)=>{
    try{
        const user=new User()
        const data=await getTokenData(req.headers.authorization)
        const {iduser}=data.data
        const {apeliidom}=req.body
        await user.updateApellidoM(apeliidom,iduser)
        return res.status(200).json({
            success:true,
            message:"Usuario actualizado correctamente"
        })

    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Error al actualizar el usuario"
        })
    }
}
const deleteprofile= async (req,res)=>{
    try{
        const user=new User()
        const data=await getTokenData(req.headers.authorization)
        const {iduser}=data.data
     
        await user.deleteuserOrSave(1,iduser)
       
      return  res.status(200).json({
            success:true,
            message:"Cuenta eliminada correctamente"

        })
     
    }catch(e){
    return res.status(500).json({
        success:false,
        message:"Error al eliminar la cuenta",
        error:e.message
     })
    }
}

const addimageprofile=async(req,res)=>{
  try{
     
     const {type}=req.body

    const data=await getTokenData(req.headers.authorization)
    
    const {iduser}=data.data
    const usert=new User()
   
    if(req.files?.imagenprofile){
        
        const imageur=await uploadImage(req.files.imagenprofile.tempFilePath)
        
        await usert.saveFile(imageur.secure_url,imageur.public_id)
        const imageurl= await usert.getidfile(imageur.secure_url)
        const {idfile}=imageurl[0]
        
        
        await usert.addimage(idfile,iduser,type)
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
   return res.status(500).json({
        success:false,
        message:"No se pudo agregar la imagen",
        error:e.message
    })
}
}

const getprofileImageb=async(req,res)=>{
   
    try{

    let respuesta={
        success:true,
        message:"imagen obtenida correctamente",
    }

    const data=await getTokenData(req.headers.authorization)
    const {username,type}=req.query
   
  
    // if(username==null){
    //     res.status(404).json({
    //         success:false,
    //         message:"Erro al obtener el usuario"
    //     })
    // }
    if(username){
        const usertwo=new User()
        const idofuser=await usertwo.checkwithusername(username)
        const {iduser}=idofuser[0]
        const rows=await usertwo.getallimagesprofile(iduser,type)
   
       
        if(rows.length==0){
          return  res.status(200).json({
                success:false,
                message:"El usuario no tiene una imagen"
            })
        }
        return res.status(200).json({
            success:true,
            message:"imagen obtenida correctamente",
            urlprofile:rows[0].urlfile,
            dateofimage:rows[0].created_at
        })
    }else if(data){
    
        const data=await getTokenData(req.headers.authorization)
        
        const {username,email,iduser}=data.data
        const usert=new User(username,email,iduser)
       

        const result=await usert.getallimagesprofile(iduser,type) 
       
        if(result.length==0){
          return  res.status(200).json({
                success:false,
                message:"El usuario no tiene una imagen"
            })
        }
       return res.status(200).json({
            success:true,
            message:"imagen obtenida correctamente",
            urlprofile:result[0].urlfile,
            idimage:result[0].idmediauser,
            dateofimage:result[0].created_at
        })

    }else{
        return res.status(200).json({
            success:false,
            message:"recurso no encontrado"
           
        })
    }
    

}catch(e){
  return  res.status(500).json({
        success:false,
        message:"Erro al recibir imagenes",
        error:e.message
    })
  
}

 
}
const adddescription=async(req,res)=>{
    try{
      const user=new User()
      const data=await getTokenData(req.headers.authorization)
      const {iduser}=data.data
      const {description}=req.body
    const result=await user.checkexitsdescription(iduser)
        if(result.length!=0){
            return res.status(404).json({
                success:false,
                message:"El usuario ya tiene una descripcion"
            })

        }
        await user.addDescription(description,iduser)
        return res.status(200).json({
            success:true,
            message:"La descripcion del usuario fue agregada correctamente"
        
        })
    }catch(e){
       return res.status(500).json({
            success:false,
            message:"No se pudo agregar la descripcion",
            error:e
        })
    }


}

const updatedescription=async(req,res)=>{
    try{
     const user=new User()
     const data=await getTokenData(req.headers.authorization)
     const {iduser}=data.data
     const {description}=req.body
   const result=await user.checkexitsdescription(iduser)
   if(result.length==0){
         return res.status(404).json({
              success:false,
              message:"El usuario no tiene descripcion"
         })
   }
   await user.updateDescription(description,iduser)
    return res.status(200).json({ 
        success:true,
        message:"La descripcion del usuario fue actualizada correctamente"
    
    })
    }catch(e){
        return res.status(500).json({
            success:false,
            message:"No se pudo actualizar la descripcion",
            error:e
        })
    }
}
const getdescription=async(req,res)=>{
    try{
        const {username}=req.query
        const data=await getTokenData(req.headers.authorization)
        const user=new User()
        if(username){ 
         const result=await user.checkwithusername(username)
         const{iduser}=result[0]
         const rows=await user.getDescription(iduser)
         return res.status(200).json({
            success:true,
            message:"description obtenida correctamente",
            description:rows.length==0?[]:rows[0]
          
         })
         }
            const {iduser}=data.data
            const rows=await user.getDescription(iduser)
            return res.status(200).json({
                success:true,
                message:"description obtenida correctamente",
                description:rows.length==0?[]:rows[0]
            })
    }catch(e){
   return  res.status(500).json({
        success:false,
        message:"Erro al obtener la descripcion",
        error:e.message
     })
    }
}
const getinteresofselect=async(req,res)=>{
    try{
       const data=await getTokenData(req.headers.authorization)
       const {idmajor}=data.data
       const user=new User()
     const result=await  user.getallinterest(idmajor)
        return res.status(200).json({
            success:true,
            message:"Intereses obtenidos correctamente",
            result:result.length==0?[]:result
        })
    }catch(e){
      return  res.status(500).json({
            success:false,
            message:"Error al traer intereses"
        })
    }
}

const addinterestOrExpert=async(req,res)=>{
    try{
         const{idinterest,expert}=req.body
         const data=await getTokenData(req.headers.authorization)
         const {iduser}=data.data
        const user=new User()
      await  user.addInterestOrExpert(idinterest,iduser,expert)
      return res.status(200).json({
        success:true,
        message:expert?" experto agregado correctamente":"interes agregado correctamente"

      })

       
    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Error al agregar interes o experto"
        })
    }                  

  
}
const getinteresorexpertofuser=async(req,res)=>{
    try{
        console.log("sss")
        const data=await getTokenData(req.headers.authorization)
        const {username,expertOr}=req.query
        const user=new User()
        if(username){
         
            const result=await user.checkwithusername(username)
            const {iduser}=result[0]
           if(expertOr==1){
            const rows=await user.getexpert(iduser)  
            return res.status(200).json({
                success:true,
                message:"experto obtenidos correctamente",
                result:result.length==0?[]:rows
            })
           }
           const rows=await user.getInterest(iduser)
              return res.status(200).json({
                success:true,
                message:"interes obtenidos correctamente",
                result:result.length==0?[]:rows})

        
        }else if(data){
            const {iduser}=data.data
            if(expertOr==1){
                const rows=await user.getexpert(iduser)  
                return res.status(200).json({
                    success:true,
                    message:"experto obtenidos correctamente",
                    result:rows.length==0?[]:rows
                })
               }
               const rows=await user.getInterest(iduser)
                  return res.status(200).json({
                    success:true,
                    message:"interes obtenidos correctamente",
                    result:rows.length==0?[]:rows})
        }
        
    }catch(e){
   return  res.status(500).json({
        success:false,
        message:"Erro al obtener la los intereses o el experto del usuario",
        error:e.message
     })
    }
}
const deleteexpertORinterest=async(req,res)=>{
    try{
        const {idinterest}=req.query
        const data=await getTokenData(req.headers.authorization)
        const {iduser}=data.data
        const user=new User()
        await user.deleteinteresOrExpert(iduser,idinterest)
        return res.status(200).json({
            success:true,
            message:"Interes eliminado correctamente"
        })
    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Error al eliminar el interes",
            error:e.message
        })
    }

}

const addhobbie=async(req,res)=>{
   try{
    const data=await getTokenData(req.headers.authorization)
    const {iduser}=data.data
    const {namehobbie}=req.body
    const user=new User()
    await user.addhobbie(namehobbie)
    const result=await user.getidhobbie(namehobbie)
    const {idhobbie}=result[0]
    await user.addhobbieofuser(iduser,idhobbie)
    return res.status(200).json({
        success:true,
        message:"Hobbie agregado correctamente"
    
    })
   }catch(e){
    return  res.status(500).json({
        success:false,
        message:"Error al agregar hobbie",
        error:e.message
      })
   }
}
const gethobbies=async(req,res)=>{
    try{
      const data=await getTokenData(req.headers.authorization)
      const {iduser}=data.data
      const {username}=req.query
      const user=new User()
      if(username){
         const result=await user.checkwithusername(username)
         const {iduser}=result[0]
         const hobbies=await user.getallhobiesForUser(iduser)
         return res.status(200).json({
            success:true,
            message:"Hobbies obtenidos correctamente",
            result:hobbies.length==0?[]:hobbies
         })
      }

         const hobbies=await user.getallhobiesForUser(iduser)
          return res.status(200).json({
            success:true,
            message:"Hobbies obtenidos correctamente",
            result:hobbies.length==0?[]:hobbies
         })
      

          

       

    }catch(e){
    return res.status(500).json({
        success:false,
        message:"Erro al obtener la los intereses o el experto del usuario",
        error:e.message
     })
    }
}
const deletehobbies=async(req,res)=>{
    try{
       const data=await getTokenData(req.headers.authorization)
       const {iduser}=data.data
       const{idhobbiesof}=req.query
       const user=new User()
       await user.deletehobbie(iduser,idhobbiesof)
      return res.status(200).json({
        success:true,
        message:"El hobbie fue eliminado correctamente"
       })
    }catch(e){
         return res.status(200).json({
            success:false,
            message:"Error al eliminar el hobbie",
            error:e.message
         })
    }
}
const getallimagesprofile=async(req,res)=>{
    try{
        const data=await getTokenData(req.headers.authorization)
        const {username}=req.query
        const {page,limit}=req.query
        const skip=(page-1) * limit
        const usert=new User()
        let response={
            message:"se obtuvieron correctamente las imagenes",
           
           }
        if(username){
            
           
         
            const rows=await usert.checkwithusername(username)
          
            const {iduser}=rows[0]
            if(rows.length==0){
               return res.status(404).json({
                    success:false,
                    message:"El usuario no existe"
                })
    
            }
           
           
            const resultc=await usert.getallimages(page,limit,iduser,skip)
            response={
               ...response,
               ...resultc
            }
            console.log(rows)
           return res.status(200).json(response)
           
        
        }else if(data){
            
         
            
            const {username,email,namemajor,iduser}=data.data
            const user=new User(username,email,namemajor)
            

           
            const resultc=await user.getallimages(page,limit,iduser,skip)
            console.log(skip)
            console.log(resultc)
            response={
               ...response,
               ...resultc
            }
           return res.status(200).json(response)
        }
    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Erro al obtner las imagenes del usuario",
            error:e.message
         })
    }
    
}


const getpublications=async(req,res)=>{
    const data=await getTokenData(req.headers.authorization)
    const {username}=req.query
    const {page,limit}=req.query
    const usert=new User()
    const skip=(page-1) * limit
    const type="Publications"
    let response={
        message:"se obtuvieron las publicacion correctamente",
       
       }
   try{
    if(username){
      
        const rows=await usert.checkwithusername(username)
        
        if(rows.length==0){
           return res.status(404).json({
                success:false,
                message:"El usuario no existe"
            })

        }
        const {iduser}=rows[0]

        const result=await usert.getallpublications(page,limit,iduser,skip,type)
        response={
          ...response,
          ...result
        }

       
        
     
       
    
    }else if(data){
       
        const {iduser}=data.data
       
      console.log(iduser)
      console.log(page)
        const friends=await usert.getallpublications(page,limit,iduser,skip,type)
        
        response={
            ...response,
            ...friends
        }
    }
    return res.status(200).json(response)
   }catch(e){
    return res.status(500).json({
        success:false,
        e:e.message,
        message:"Erro al obtener las publicaciones"
     })
   }
}
const updateNumberSemester=async(req,res)=>{
    try{
        const data=await getTokenData(req.headers.authorization)
        const {semester}=req.body
        const user=new User()
        const {iduser}=data.data
        await user.updateSemester(iduser,semester)

        res.status(200).json({
            success:true,
            message:"Semestre actualizado correctamente"

        })
    }catch(e){
        res.status(500).json({
            success:false,
            message:"Error al actualizar el semestre",
            error:e.message
        })
    }

}
 
const getSocialMediaOptions=async(req,res)=>{
    try{ 
       const user=new User()
       const result =await user.getOptionsSocialMedia()
       return res.status(200).json({
        success:true,
        message:"Opciones de redes sociales obtenidas correctamente",
        result:result.length==0?[]:result
       })

    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Error al obtener las opciones de redes sociales",
            error:e.message
        
        })
    }
}
const addSocialMedia=async(req,res)=>{
    try{
         const {idoption,link}=req.body
         const data=await getTokenData(req.headers.authorization)
         const {iduser}=data.data
        const user=new User()
        await user.addSocialMedia(iduser,link,idoption)
        return res.status(200).json({
            success:true,  
            message:"Red social agregada correctamente"
        })
    }catch(e){
      return res.status(500),json({
        success:false,
        message:"Error al agregar la red social",
      })
    }
}
const getSocialMedia=async(req,res)=>{

    try{
      const data=await getTokenData(req.headers.authorization)
      const {iduser}=data.data
      const {username}=req.query
      let result=null;
    const user=new User()
    if(username){
        const rows=await user.checkwithusername(username)
        const {iduser}=rows[0]
        result=await user.getSocialMedia(iduser)
    }else{
        result=await user.getSocialMedia(iduser)

    }

     

    return res.status(200).json({
        success:true,
        message:"Redes sociales obtenidas correctamente",
        result
    })
    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Error al obtener las redes sociales",
            error:e.message
        })
    }
}

const updateSocialmedia=async(req,res)=>{
    try{
      const {idsocialmedia,nelink}=req.body
      const data=await getTokenData(req.headers.authorization)
      const {iduser}=data.data
      const user=new User()
      await user.updateSocialMedia(iduser,idsocialmedia,nelink)
      return res.status(200).json({
            success:true,
            message:"Red social actualizada correctamente"
      })
    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Error al actualizar la red social",
            error:e.message
        })

    }
}
const deleteSocialMedia=async(req,res)=>{
    try{
        const {idsocialmedia}=req.query
        const data=await getTokenData(req.headers.authorization)
        const {iduser}=data.data
        const user=new User()
        await user.deleteSocialMedia(iduser,idsocialmedia)
        return res.status(200).json({
            success:true,
            message:"Red social eliminada correctamente"
        })

    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Error al eliminar la red social",
            error:e.message
        })
    }
}

const getIdUserByToken=async(req,res)=>{
    try{
     
      const data=await getTokenData(req.headers.authorization)
      const {iduser}=data.data
      return res.status(200).json({
        success:true,
        iduser
      })
    }catch(e){
      return res.status(500).json({
        success:false,
        message:"Error al obtener el id del usuario",
        error:e.message
      })
    }
  }
const getUsernameByToken=async(req,res)=>{
    try{ 
        const data=await getTokenData(req.headers.authorization)
        const {username}=data.data
        return res.status(200).json({
            success:true,
            username
        })

    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Error al obtener el username del usuario",
            error:e.message
        })
    }
}

module.exports={
    addimageprofile,
    getprofileImageb,
    adddescription,
    updatedescription,
    getdescription,
    getinteresofselect,
    addinterestOrExpert,
    getinteresorexpertofuser,
    addhobbie,
    gethobbies,
    getallimagesprofile,
    getpublications,
    deleteprofile,
    updatename,
    updateapellidop,
    updataApellidoM,
    deleteexpertORinterest,
    deletehobbies,
    getinformation,
    getInformacionById,
    updateNumberSemester,
    getSocialMediaOptions,
    addSocialMedia,
    getSocialMedia,
    updateSocialmedia,
    deleteSocialMedia,
    getIdUserByToken,
    getUsernameByToken
   
}