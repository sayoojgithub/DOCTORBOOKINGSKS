import mongoose from "mongoose";
const ExperienceSchema = new mongoose.Schema({
  fromDate: { type: Date },
  toDate: { type: Date },
  hospitalName: { type: String },
});
const SelectedSlotsSchema = new mongoose.Schema({
  date: { type: Date },
  slots: { type: [String] },
});
const DoctorSchema = new mongoose.Schema({
  name: { type: String, },

  email: { type: String, unique: true },
  
  password: { type: String, },
  role: {
    type: String,
    enum: ["patient", "doctor"],
    default: "doctor",
  },
  gender:{
    type: String,
    enum:["male","female"],
    
  },
  

  photo: { type: String },
  certificatephoto: { type: String },
  fee: { type: Number },
  hospital:{type:String},
  

  
  specialization: {
     type: String,
     
    },
  qualification: {
    type: String,
  },
  experiences: [ExperienceSchema],
  selectedDatesAndSlots: [SelectedSlotsSchema],
  

  
  timeSlots: { type: Array },
  
  
  
  
  certificateApprove: {
    type: Boolean,
    // enum: ["pending", "true", "false"],
    default: false,
  },
  isBlocked: {
    type: Boolean,
    // enum: ["pending", "true", "false"],
    default: false,
  },
  isListed: {
    type: Boolean,
    default: true,
  },
  
});

export default mongoose.model("Doctor", DoctorSchema);