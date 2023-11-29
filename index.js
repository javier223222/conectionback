if(process.env.NODE !== 'production'){
    require("dotenv").config()
} 


const express=require("express")
const cookies=require("cookie-parser")
const cors =require("cors")
const fileUpload =require("express-fileupload")

const app=express()
const PORT=process.env.PORT||80

app.use(cors({origin: true, credentials: true}))
app.use(cookies())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"./uploads"
}))

app.use('/api/v1',require('./src/routes/user.route'))
app.use("/user/v1",require('./src/routes/userLogin.route'))
app.use("/profile",require("./src/routes/UserProfile.route"))
app.use("/friends",require("./src/routes/Friends.router"))
app.use("/publications",require("./src/routes/Publications.router"))
app.use("/foros",require("./src/routes/Foros.router"))
app.use("/foroInteraction",require("./src/routes/ForoInteractin.route"))
app.use("/chat",require("./src/routes/Chat.router"))
app.use("/chatInteraction",require("./src/routes/ChatInteractions.router"))
app.use("/people",require("./src/routes/People.router"))
app.listen(PORT,()=>{
    
    console.log(`listen ${PORT}`)
})

