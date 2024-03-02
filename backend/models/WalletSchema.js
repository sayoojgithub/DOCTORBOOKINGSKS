import mongoose from "mongoose";
import User from './UserSchema.js';  


const WalletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  transactionType: { type: String, enum: ['credit', 'debit'], required: true },
  cancelledBy: { type: String, enum: ['doctor', 'patient', null], default: null }, 
  amount: { type: Number, required: true },
  currentWalletAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

export default mongoose.model("Wallet", WalletSchema);
