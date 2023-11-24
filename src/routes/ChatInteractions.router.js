const { addMessage } = require("../controllers/ChatInteraction.controller")
const { verifyToken } = require("../middlewares")

const route=require("express").Router()
 route 
      .post("/",verifyToken,addMessage)
module.exports=route