const { verifyToken } = require("../middlewares")
const Publications=require("../controllers/Publications.controller")
const route=require("express").Router()
route
     .get("/",verifyToken,Publications.getpublications)
     .get("/getmediapublications",verifyToken,Publications.getmediaPublications)
     .get("/comments",verifyToken,Publications.comments)
     .get("/commentmedia",verifyToken,Publications.commentmedia)
     .get("/likesofpublications",verifyToken,Publications.likesofpublications)
module.exports=route

