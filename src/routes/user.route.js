const router=require("express").Router()
const userController=require("../controllers/User.controller")

router.post('/user',
[],
userController.createNweUser)

router.get('/user/:token',
[],
userController.confirmUser)

module.exports=router     
