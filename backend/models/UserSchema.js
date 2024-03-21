import mongoose from "mongoose";
const friendSchema = new mongoose.Schema({
  name: { type: String },
  age: { type: String },
  gender: { type: String, enum: ["male", "female", "other"] },
});

const userSchema = new mongoose.Schema({
  name: { type: String},
  email: { type: String, unique: true },
  password: { type: String },
  number: { type: Number },
  photo:{type:String},
  role: {
    type: String,
    enum: ["patient", "doctor"],
    default: "patient",
  },
  gender:{
    type: String,
    enum:["male","female"],
    
  },
  bloodType:{type:String},
  isBlocked:{type:Boolean,default:false},
  friends: [friendSchema],
  lastSeen:{type:Date,required:false}

});

export default mongoose.model("User",userSchema)