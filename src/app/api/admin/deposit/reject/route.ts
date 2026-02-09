import connectToDatabase from "@/lib/mongodb";
import Deposit from "@/models/Deposit";
import Notification from "@/models/Notification"; // Notification Model Import
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import Pusher from "pusher"; // Pusher Import

// Pusher Setup
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
        
        // 1. Auth Check
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { depositId, reason } = await req.json();

        if (!depositId) {
            return NextResponse.json({ error: "Deposit ID is required" }, { status: 400 });
        }

        await connectToDatabase();

        // 2. Find Deposit
        const deposit = await Deposit.findById(depositId);

        if (!deposit) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }

        if (deposit.status !== 'pending') {
            return NextResponse.json({
                error: `Cannot reject. Current status is ${deposit.status}`
            }, { status: 400 });
        }

        const rejectionReason = reason || "Invalid UTR or Payment mismatch";

        // 3. Update Status in DB
        await Deposit.findByIdAndUpdate(depositId, {
            $set: {
                status: 'rejected',
                rejectReason: rejectionReason,
                processedAt: new Date()
            }
        });

        // --- NOTIFICATION LOGIC START ---

        const notificationData = {
            userId: deposit.userId,   // User ki ID
            target: 'user',           // Target User hai
            type: 'error',            // Error type (Red Color Toast)
            title: 'Deposit Rejected',
            message: `Your deposit of ₹${deposit.amount} was rejected. Reason: ${rejectionReason}`,
            isRead: false,
            createdAt: new Date()
        };

        // A. Database mein save karo (History ke liye)
        await Notification.create(notificationData);

        // B. Pusher Trigger (User ko Real-time Toast dikhane ke liye)
        // Event name 'new-notification' rakha hai taaki Header wala listener pakad sake
        await pusher.trigger(`user-${deposit.userId}`, "new-balance", notificationData);

        // --- NOTIFICATION LOGIC END ---

        return NextResponse.json({ message: "Request Rejected successfully" });

    } catch (error: any) {
        console.error("Reject API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}