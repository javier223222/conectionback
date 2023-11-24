const { forojoin, forosOfUser, deleteMemberOfForo, addInteractioninForo, getmediOfInractionUser } = require("../controllers/ForoUserInteraction.controller")
const { verifyToken } = require("../middlewares")

const route=require("express").Router()

route
    .post("/",verifyToken,forojoin)
    .get("/",verifyToken,forosOfUser)
    .delete("/",verifyToken,deleteMemberOfForo)
    .post("/interaction",verifyToken,addInteractioninForo)
    .get("/media",verifyToken,getmediOfInractionUser)


module.exports=route