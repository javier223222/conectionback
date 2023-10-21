if(process.env.NODE !== 'production'){
    require("dotenv").config()
} 


const express=require("express")

const cors =require("cors")

const app=express()
const PORT=process.env.PORT||80

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use('/api/v1',require('./src/routes/user.route'))
app.listen(PORT,()=>{
    console.log(`listen ${PORT}`)
})

