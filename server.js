require('./db')

const express=require('express')
const userRoute = require('./routes/userRoute');
const env=require("dotenv")
const app=express()
const publicerror=require('./errors/errors')
env.config({path:'config.env'})
const bodyParser=require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

app.use(["/user"], userRoute);
//api error handling 
app.all('*',(req,res,next)=>{
    //const err=new Error(`can't find this route:${req.originalUrl}`);
    //next(err.message)      //return to next middleware
    next(new ApiError("can't find this route",400))  
    })

    app.use(publicerror)

const PORT=process.env.PORT 
app.listen(PORT,()=>{
    console.log("server running...")
})