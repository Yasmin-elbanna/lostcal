require('./db')

const express=require('express')
const userRoute = require('./routes/userRoute');
const mylostRoute=require('./routes/mylostRoute');
const lostRoute=require('./routes/lostRoute');
const env=require("dotenv")
const cors = require('cors');
const bodyParser=require('body-parser')
const morgan=require('morgan')
const publicerror=require('./controller/errors')
const app=express();


app.use(cors({
    origin:"*",
    
})
);

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
  });
  
env.config({path:'config.env'})
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))

}
app.use(bodyParser.urlencoded({ extended: true }));
 
  
app.use(express.json());
app.use(["/user"], userRoute);
app.use(["/mylost"], mylostRoute);
app.use(["/lost"], lostRoute);


//api error handling 
app.all('*', (req, res, next) => {
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
  }

  );

    app.use(publicerror)

const PORT=process.env.PORT 
app.listen(PORT,()=>{
    console.log("server running...")
})
// Handle rejection outside express
process.on('unhandledRejection', (err) => {
    console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
    server.close(() => {
      console.error(`Shutting down....`);
      process.exit(1);
    });
  });
