const People = require("../models/People.model")
const User = require("../models/User.model")

const searchPeople=async (req,res)=>{
    try{
        const {name}=req.query
        const people=new People(name)
        const user=new User()
        const result=await people.searchPeople()
        if(result.length==0){
            return res.status(200).json({
                success:true,
                message:"no se encontraron resultados",
                result
            
            })
        }

       for(let i=0;i<result.length;i++){
           const image=await user.getallimagesprofile(result[i].iduser,"Profile")
           const {urlfile}=image.length==0?{urlfile:null}:image[0]
           result[i]={...result[i],urlfile}
       }
       
        
        return res.status(200).json({
            success:true,
            result
        })

    }catch(e){
        return res.status(500).json({
           success:false,
           error:e.message,
            message:"server error"
    })
    }
}
module.exports={
    searchPeople
}