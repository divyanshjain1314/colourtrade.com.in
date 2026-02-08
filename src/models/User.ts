import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true }, 
    email: { type: String, required: false, sparse: true }, 
    password: { type: String, required: true },
    wallet: { type: Number, default: 0 },
    role: { type: String, default: 'user' },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);