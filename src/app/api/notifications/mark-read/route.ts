import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await connectToDatabase();
        let filter = {};
        if (session.user.role === 'admin') {
            filter = { target: 'admin', isRead: false };
        } else {
            filter = {
                target: 'user',
                userId: session.user.id,
                isRead: false
            };
        }
        const result = await Notification.updateMany(
            filter,
            { $set: { isRead: true } }
        );
        return NextResponse.json({
            success: true,
            message: "Notifications marked as read",
            updatedCount: result.modifiedCount
        });

    } catch (error) {
        console.error("Mark Read API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}