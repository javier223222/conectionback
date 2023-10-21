const route=require("express").Router()
const UserProfile=require("../controllers/UserProfile.Controller")
route.post("/profileimage",[],UserProfile.addimageprofile)
route.get("/profileimage",[],UserProfile.getprofileImageb)
module.exports=route