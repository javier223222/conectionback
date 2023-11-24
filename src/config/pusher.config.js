const Pusher = require("pusher")

const pusher= new Pusher({
    
    appId:process.env.APPID,
    key:process.env.KEY,
    secret:process.env.SECRET,
    cluster:process.env.CLUSTER,
    useTLS:true
})

module.exports={
    pusher
}