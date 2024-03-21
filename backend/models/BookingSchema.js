import mongoose from "mongoose";
import User from './UserSchema.js';  
import Doctor from "./DoctorSchema.js";  

const BookingSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: Date, required: true },
  slot: { type: String, required: true },
  fee: { type: Number, required: true },
  bookedFor: { type: String, required: true },
  paymentStatus: { type: Boolean, default: false }, 
  cancelStatus: { type: Boolean, default: false }, 
  cancelledBy: { type: String, enum: ['doctor', 'patient', null], default: null }, 
  rescheduleStatus: { type: Boolean, default: false }, 
  rescheduleSlot: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

export default mongoose.model("Booking", BookingSchema);
