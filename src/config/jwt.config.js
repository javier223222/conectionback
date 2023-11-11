const jwt =require("jsonwebtoken")

const getToken=async (payload)=>{
    return jwt.sign({
        data:payload
    },`${process.env.SECRET_NAME}`,{expiresIn:"24h"})
}

const getTokenData= async (token)=>{
    let data=null
    jwt.verify(token,`${process.env.SECRET_NAME}`,(err,decoded)=>{
        if(err){
            console.log("error al obtener el token")
        }else{
            data=decoded
        }
    })
    return data
}

module.exports={
    getToken,
    getTokenData,

}