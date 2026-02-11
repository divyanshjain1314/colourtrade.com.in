import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import Withdrawal from "@/models/Withdrawal";
import User from "@/models/User";
import Notification from "@/models/Notification";
import Pusher from "pusher";

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: "ap2",
    useTLS: true,
});

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== 'admin') return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();

        const withdrawals = await Withdrawal.find()
            .populate('userId', 'name email image')
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, withdrawals });
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== 'admin') return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id, action, transactionId } = await req.json();

        await connectToDatabase();

        const request = await Withdrawal.findById(id);
        if (!request) return NextResponse.json({ error: "Request not found" }, { status: 404 });

        if (request.status !== 'pending') {
            return NextResponse.json({ error: "Request already processed" }, { status: 400 });
        }

        let notificationMessage = "";
        let notificationType = "";

        if (action === 'reject') {
            // 1. Wallet Refund
            const user = await User.findById(request.userId);
            if (user) {
                user.wallet += request.amount;
                await user.save();
            }
            request.status = 'rejected';

            // Message Setup
            notificationMessage = `Withdrawal of ₹${request.amount} Rejected. Amount refunded to wallet.`;
            notificationType = "error"; // Toast red dikhega
        }
        else if (action === 'approve') {
            // 2. Mark Approved
            request.status = 'approved';
            request.transactionId = transactionId || 'Manual-Transfer';

            // Message Setup
            notificationMessage = `Withdrawal of ₹${request.amount} Approved! Fund sent to bank.`;
            notificationType = "success"; // Toast green dikhega
        }

        await request.save();

        // --- ✅ NOTIFICATION SYSTEM START ---

        // 1. Create DB Notification (History ke liye)
        await Notification.create({
            userId: request.userId,
            title: action === 'approve' ? "Withdrawal Successful" : "Withdrawal Rejected",
            message: notificationMessage,
            type: action === 'approve' ? "success" : "error",
            read: false
        });

        // 2. Trigger Pusher Event (Real-time Toast ke liye)
        // Hum 'new-balance' event use kar rahe hain kyunki aapka Header component usi ko sun raha hai
        await pusher.trigger(`user-${request.userId}`, 'new-balance', {
            type: notificationType,
            message: notificationMessage,
            balance: action === 'reject' ? (await User.findById(request.userId)).wallet : undefined
        });

        // --- NOTIFICATION SYSTEM END ---

        return NextResponse.json({ success: true, message: `Request ${action}ed successfully` });

    } catch (error) {
        console.error("Withdrawal Action Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}