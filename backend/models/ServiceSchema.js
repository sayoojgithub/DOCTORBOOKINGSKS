import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true,
    unique: true 
  },
  serviceDescription: {
    type: String,
    required: true
  },
  isListed: {
    type: Boolean,
    default: true // default value set to true
  }
});

export default mongoose.model("Service", ServiceSchema);