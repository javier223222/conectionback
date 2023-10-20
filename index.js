const express=require("express")
const v1UserRouter=require("./src/v1/routes/userRoutes")

const cors=require("cors")
const app=express()

const PORT=process.env.PORT||80
app.use(cors)
app.use(express.json())
app.use("/api/v1",v1UserRouter)
app.listen(PORT,()=>{
    console.log("Hola amigos")
})


