import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  
  email: { type: String,  },
  password: { type: String },
  role: {
    type: String,
    default: "admin",
  },
  

});

export default mongoose.model("Admin",adminSchema)