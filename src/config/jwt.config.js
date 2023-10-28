const jwt =require("jsonwebtoken")

const getToken=async (payload)=>{
    return jwt.sign({
        data:payload
    },`${process.env.SECRET_NAME}`,{expiresIn:"6h"})
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
const comprobateToken=async(token)=>{
    let result=false
    jwt.verify(token,`${process.env.SECRET_NAME}`,(err,decoded)=>{
        if(err){

        }else{
            result=true
        }
    })
    return result
}
module.exports={
    getToken,
    getTokenData,
    comprobateToken
}