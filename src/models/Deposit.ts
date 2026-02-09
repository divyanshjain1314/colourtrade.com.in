import mongoose from 'mongoose';

const DepositSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    utr: { type: String, required: true, unique: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    rejectReason: { type: String },
    processedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Deposit || mongoose.model('Deposit', DepositSchema);