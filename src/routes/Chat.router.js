const {  getAllChatMember, getMessages, getMediaOfChat } = require("../controllers/Chat.controller")
const { verifyToken } = require("../middlewares")

const route=require("express").Router()
route
.get("/",verifyToken,getAllChatMember)
.get("/messages",verifyToken,getMessages)
.get("/media",verifyToken,getMediaOfChat)

module.exports=route