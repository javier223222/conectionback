const router=require("express").Router()
const UserLogin=require("../controllers/UserLogin.controller")

router.post('/login',[],UserLogin.login)

module.exports=router