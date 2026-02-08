import mongoose from 'mongoose';

const PeriodSchema = new mongoose.Schema({
  periodId: { type: String, required: true },
  winningColor: { type: String, enum: ['red', 'green', 'violet'], default: null },
  winningNumber: Number,
  status: { type: String, default: 'active' }, // active or completed
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Period || mongoose.model('Period', PeriodSchema);