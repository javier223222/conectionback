const { getTokenData } = require("../config/jwt.config")
const Foros = require("../models/Foros.model")
const User = require("../models/User.model")

const getAllForosForMajor=async(req,res)=>{
    try{
    const data=await getTokenData(req.headers.authorization)
    const {idmajor}=data.data
    const foros=new Foros(null,idmajor,null,null)
    const result=await foros.getAllForosForMajor()
    return res.status(200).json({
        success:true,
        message:"Foros obtenidos",
        result
    })

    }catch(e){
     return res.status(500).json({
            success:false,
            message:"Error al obtener los foros",
            error:e.message
     })
    }
}

const getAllpeopleInForo=async(req,res)=>{
    const {idforo}=req.query
    try{
        const foros=new Foros(idforo,null)
        const result=await foros.getAllpeopleInForo()
        const user=new User()
        if(result.length!=0){
           for (let i = 0; i < result.length; i++) {
            console.log(result[i].iduser)
              const {name,apellidop,apellidom,username}=await user.getnameProfileannombre(result[i].iduser)
              console.log(result[i].iduser)
              const imagen=await user.getallimagesprofile(result[i].iduser,'Profile')
              console.log(imagen)
             const {urlfile}=imagen.length==0?{urlfile:null}:imagen[0]
             
             result[i]={...result[i],name,apellidop,apellidom,username,profileimage:urlfile}

            
           }
        }
        return res.status(200).json({
            success:true,
            message:"Usuarios obtenidos",
            result
        })
    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Error al obtener los usuarios",
            error:e.message
        })
    
    }

}
const getAllForoMedia=async(req,res)=>{
   try{
    const {idforo}=req.query
    const foros=new Foros(idforo,null,null)
    const result=await foros.getAllmediForo()
    return res.status(200).json({
        success:true,
        message:"Archivos obtenidos",
        result
    })

   }catch(e){
     return res.status(500).json({
        success:false,
        message:"no se obtuvieron los archivos",
        error:e.message
     })
   }
}

const getAllInteractionsOfForo=async(req,res)=>{
    try{
        const {idforo}=req.query
        const foro=new Foros(idforo,null,null)
        const result=await foro.getAllInteracionsOfForo()
        
        const user=new User()
        for (let i = 0; i < result.length; i++) {
            let element = result[i];
            const {name,apellidop,apellidom,username}=await user.getnameProfileannombre(element.iduser)
          const imageUser= await user.getallimagesprofile(element.iduser,'Profile')
          const {urlfile}=imageUser.length==0?{urlfile:null}:imageUser[0]
          element={
              ...element,
              name,
              apellidop,
              apellidom,
              username,
              imagenuser:urlfile}
            result[i]=element
            
        }
        return res.status(200).json({
            success:true,
            message:"Interacciones obtneidas correctament",
            result
        })

    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Error al obtener las interacciones",
            error:e.message
        })
    }
}

const getInfoForo=async(req,res)=>{
    try{
       const {idforo}=req.query
       const foro=new Foros(idforo,null,null)
         const result=await foro.getInformaTionoforo()
        
        return res.status(200).json({
            success:true,
            message:"Informacion obtenida",
            result})
    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Error al obtener la informacion",
            error:e.message
        })
    }
}






module.exports={
    getAllForosForMajor,
    getAllpeopleInForo,
    
    getAllForoMedia,
    getAllInteractionsOfForo,
    getInfoForo
    
}