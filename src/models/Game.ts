import mongoose from "mongoose";

const BetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  periodId: { type: String, required: true },
  type: { type: String, enum: ['red', 'green', 'violet', 'number'], required: true },
  select: { type: String, required: true },
  amount: { type: Number, required: true }, 
  status: { type: String, default: 'pending' },
  winAmount: { type: Number, default: 0 },
  isAggregated: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const PeriodSchema = new mongoose.Schema({
  periodId: { type: String, required: true, unique: true },
  winningNumber: { type: Number, required: true },
  winningColor: { type: String, required: true },
  totalBets: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const Bet = mongoose.models.Bet || mongoose.model("Bet", BetSchema);
export const Period = mongoose.models.Period || mongoose.model("Period", PeriodSchema);