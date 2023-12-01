
const route=require("express").Router()
const Interest=require("../controllers/InterestCount.controller")
const { verifyToken } = require("../middlewares")

route
    .get("/",verifyToken,Interest.getActiveUserForMajor)
    .get("/sameinterest",verifyToken,Interest.getPeopleWithsameInteresExp)

module.exports=route
