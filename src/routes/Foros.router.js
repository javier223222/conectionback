const { getAllForosForMajor, getAllpeopleInForo, forojoin, forosOfUser, deleteMemberOfForo, getAllForoMedia, getAllInteractionsOfForo, getInfoForo } = require("../controllers/Foro.Controller")
const { verifyToken } = require("../middlewares")

const route=require("express").Router()


route
    .get("/",verifyToken,getAllForosForMajor)
    .get("/people",verifyToken,getAllpeopleInForo)
    .get("/interactions",verifyToken,getAllInteractionsOfForo)
    .get("/media",verifyToken,getAllForoMedia)
    .get("/info",verifyToken,getInfoForo)



module.exports=route