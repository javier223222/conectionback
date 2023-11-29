const { searchPeople } = require("../controllers/People.controller")
const { verifyToken } = require("../middlewares")

const route=require("express").Router()
route 
     .get("/",verifyToken,searchPeople)

 module.exports=route    