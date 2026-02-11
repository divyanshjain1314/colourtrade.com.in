import mongoose from "mongoose";

const WithdrawalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    upiId: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    transactionId: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Withdrawal || mongoose.model("Withdrawal", WithdrawalSchema);