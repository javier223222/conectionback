const jwt =require("jsonwebtoken")

const getToken=async (payload)=>{
    return jwt.sign({
        data:payload
    },'ACCESS',{expiresIn:"1h"})
}

const getTokenData= async (token)=>{
    let data=null
    jwt.verify(token,'ACCESS',(err,decoded)=>{
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
    getTokenData
}