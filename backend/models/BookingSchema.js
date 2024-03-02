import mongoose from "mongoose";
import User from './UserSchema.js';  
import Doctor from "./DoctorSchema.js";  

const BookingSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: Date, required: true },
  slot: { type: String, required: true },
  fee: { type: Number, required: true },
  bookedFor: { type: String, required: true }, // Add "booked for" field
  paymentStatus: { type: Boolean, default: false }, // Add "payment status" field with default false
  cancelStatus: { type: Boolean, default: false }, // Add "cancel status" field with default false
  cancelledBy: { type: String, enum: ['doctor', 'patient', null], default: null }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

export default mongoose.model("Booking", BookingSchema);
