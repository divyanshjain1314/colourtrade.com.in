import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import connectToDatabase from '@/lib/mongodb';
import Deposit from '@/models/Deposit';
import User from '@/models/User';
import Notification from '@/models/Notification';
import Pusher from "pusher";

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS: true,
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 401 });
        }

        const { depositId, verifiedAmount } = await req.json();

        if (!depositId) return NextResponse.json({ error: "Deposit ID is required" }, { status: 400 });
        if (!verifiedAmount || verifiedAmount <= 0) return NextResponse.json({ error: "Please enter a valid amount" }, { status: 400 });

        await connectToDatabase();

        const depositRequest = await Deposit.findById(depositId);
        if (!depositRequest) return NextResponse.json({ error: "Deposit request not found" }, { status: 404 });
        if (depositRequest.status !== 'pending') return NextResponse.json({ error: `Current status is ${depositRequest.status}` }, { status: 400 });

        const updatedUser = await User.findByIdAndUpdate(
            depositRequest.userId,
            { $inc: { wallet: Number(verifiedAmount) } },
            { new: true }
        );

        if (!updatedUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

        await Deposit.findByIdAndUpdate(depositId, {
            $set: {
                status: 'approved',
                verifiedAmount: Number(verifiedAmount),
                processedAt: new Date()
            }
        });


        const notificationData = {
            userId: updatedUser._id,
            target: 'user',
            type: 'success',
            title: 'Deposit Approved',
            message: `Your deposit of ₹${verifiedAmount} has been approved successfully! 🚀`,
            isRead: false,
            createdAt: new Date()
        };

        await Notification.create(notificationData);

        await pusher.trigger(`user-${updatedUser._id}`, "new-balance", notificationData);

        return NextResponse.json({
            message: `Success! Added ₹${verifiedAmount} to ${updatedUser.name}'s wallet.`,
            newBalance: updatedUser.wallet
        });

    } catch (error: any) {
        console.error("Approval API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}