require('./db')

const express=require('express')
const userRoute = require('./routes/userRoute');
const missingRoute=require('./routes/missingRoute');
const lostRoute=require('./routes/lostRoute');
const env=require("dotenv")
const cors = require('cors');
const bodyParser=require('body-parser')
const morgan=require('morgan')
const app=express();

app.use(cors({
    origin:"*",
    
}));

app.use(morgan('dev'))

const publicerror=require('./errors/errors')
env.config({path:'config.env'})


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(["/user"], userRoute);
app.use(["/missing"], missingRoute);
app.use(["/lost"], lostRoute);

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