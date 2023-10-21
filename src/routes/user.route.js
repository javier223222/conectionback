const router=require("express").Router()
const userController=require("../controllers/User.controller")

router.post('/user',
[],
userController.createNweUser)

router.post('/user/:token',
[],
userController.confirmUser)

module.exports=router     
