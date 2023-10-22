const route=require("express").Router()
const UserProfile=require("../controllers/UserProfile.Controller")
route.post("/profileimage",[],UserProfile.addimageprofile)
route.get("/profileimage",[],UserProfile.getprofileImageb)
route.post("/profiledescription",[],UserProfile.adddescription)
route.patch("/profiledescription",[],UserProfile.updatedescription)
route.get("/profiledescription",[],UserProfile.getdescription)
route.get("/profilegetinteresofexpert",[],UserProfile.getinteresofselect)
route.post("/profilegetinteresofexpert",[],UserProfile.addinterestOrExpert)
route.get("/profilegetinteresofexpert/expertofus",[],UserProfile.getinteresorexpertofuser)
route.post("/hobbie",[],UserProfile.addhobbie)
route.get("/hobbie",[],UserProfile.gethobbies)
route.get("/getimagesprofile",[],UserProfile.getallimagesprofile)
module.exports=route