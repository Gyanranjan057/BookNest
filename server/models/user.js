const mongoose=require("mongoose")
const userSchema=new mongoose.Schema(
    {
        name:{type:String,required:true,trim:true},
        email:{type:String,required:true,trim:true,unique:true,lowercase:true},
        password:{type:String,required:true,trim:true},
        role:{type:String,enum:["user","admin"],default:"user"},
        resetOtp: { type: String },
        resetOtpExpiry: { type: Date },
        isRootAdmin: { type: Boolean, default: false },
        adminRequestPending: { type: Boolean, default: false },
    },
    {
        timestamps:true
    }
)
module.exports=mongoose.model("User",userSchema) 