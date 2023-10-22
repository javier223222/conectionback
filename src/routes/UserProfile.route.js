const route=require("express").Router()
const UserProfile=require("../controllers/UserProfile.Controller")
route.post("/profileimage",[],UserProfile.addimageprofile)
route.get("/profileimage",[],UserProfile.getprofileImageb)
route.post("/profiledescription",[],UserProfile.adddescription)
route.patch("/profiledescription",[],UserProfile.updatedescription)
route.get("/profiledescription",[],UserProfile.getdescription)
module.exports=route