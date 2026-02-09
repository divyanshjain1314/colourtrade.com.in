import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Deposit from '@/models/Deposit';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        const totalUsers = await User.countDocuments({ role: 'user' });

        const pendingRequests = await Deposit.countDocuments({ status: 'pending' });

        const walletStats = await User.aggregate([
            { $group: { _id: null, total: { $sum: "$wallet" } } }
        ]);
        const totalWalletBalance = walletStats[0]?.total || 0;

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const todayDepositStats = await Deposit.aggregate([
            {
                $match: {
                    status: 'approved',
                    createdAt: { $gte: startOfDay }
                }
            },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const todayDeposit = todayDepositStats[0]?.total || 0;

        return NextResponse.json({
            totalUsers,
            pendingRequests,
            totalWalletBalance,
            todayDeposit
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}