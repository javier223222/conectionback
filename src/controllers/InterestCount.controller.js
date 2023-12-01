const Interest = require("../models/Interest.model")

const getPeopleWithsameInteresExp=async(req,res)=>{
    try{
        const {namemajor,expertOrInterest}=req.query
        const interest=new Interest(null)
        const result=await interest.getpeoplewithSameInter(namemajor,expertOrInterest)
        
        const {totalsameinterest}=result[0]
        return res.status(200).json({
            success:true,
            totalsameinterest
        })

    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Error al obtener los datos"
        })
    }
    
}

const getActiveUserForMajor=async(req,res)=>{
    try{
        const {namemajor}=req.query
        const interest=new Interest(null)
        const result=await interest.getActiveUserForMajor(namemajor)
       
       
      
        return res.status(200).json({
            success:true,
            result:result.length!=0?result[0]:{}
        })

    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Error al obtener los datos",
            error:e.message
        
        })
    }
    
}

module.exports={
    getPeopleWithsameInteresExp,
    getActiveUserForMajor
}