import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Alias use karein for safety
import connectToDatabase from '@/lib/mongodb';
import Deposit from '@/models/Deposit';
import Notification from '@/models/Notification';
import Pusher from "pusher";

// Pusher init
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
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { amount, utr } = await req.json();

        // 1. Basic Validation
        if (!amount || !utr) {
            return NextResponse.json({ error: "Amount and UTR are required" }, { status: 400 });
        }

        await connectToDatabase();

        // 2. Duplicate Check
        const existingDeposit = await Deposit.findOne({ utr });

        if (existingDeposit) {
            // MongoDB Data (Reference ID)
            const logDbData = {
                userId: session.user.id,
                target: 'admin',
                type: 'warning',
                title: 'Fraud Alert',
                message: `${session.user.name} tried to reuse UTR: ${utr}`,
                isRead: false,
                createdAt: new Date()
            };

            // Pusher Data (Full Object for Frontend UI)
            const logPusherData = {
                ...logDbData,
                userId: { // <--- YAHAN FIX KIYA HAI
                    _id: session.user.id,
                    name: session.user.name,
                    image: session.user.image
                }
            };

            await Notification.create(logDbData);
            await pusher.trigger("admin-channel", "new-log", logPusherData);

            return NextResponse.json({ error: "UTR already used!" }, { status: 400 });
        }

        // 3. Create Deposit
        await Deposit.create({
            userId: session.user.id,
            amount: Number(amount),
            utr,
            status: 'pending'
        });

        // 4. Success Notification

        // MongoDB Data
        const successDbData = {
            userId: session.user.id,
            target: 'admin',
            type: 'success',
            title: 'New Deposit',
            message: `${session.user.name} requested ₹${amount}`,
            isRead: false,
            createdAt: new Date()
        };

        const successPusherData = {
            ...successDbData,
            userId: {
                _id: session.user.id,
                name: session.user.name,
                image: session.user.image
            }
        };

        await Notification.create(successDbData);

        await pusher.trigger("admin-channel", "new-log", successPusherData);

        return NextResponse.json({ message: "Request Submitted" });

    } catch (error) {
        console.error("Deposit Error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}