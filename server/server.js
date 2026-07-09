const express=require("express")
const dotenv=require("dotenv")
dotenv.config()
const cors=require("cors")
const connectDB= require('./config/db')
const allRoutes=require('./routes/allRoutes')

const PORT= process.env.PORT || 5000
const app=express()
connectDB()

//MIDDLEWARE
 app.use(cors())
 
app.use(express.json())


app.use("/api",allRoutes)


app.listen(PORT,()=>{
    console.log(`server running on http://localhost:${PORT}`);
    
})