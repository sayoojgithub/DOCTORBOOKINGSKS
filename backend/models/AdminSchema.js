import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  
  email: { type: String,  },
  password: { type: String },
  

});

export default mongoose.model("Admin",adminSchema)