import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import Notification from "@/models/Notification";
import "@/models/User";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        let query: any = {};

        if (session.user.role === 'admin') {
            query = { target: 'admin' };
        }
        else if (session.user.id) {
            query = {
                target: 'user',
                userId: session.user.id
            };
        }
        else {
            return NextResponse.json([]);
        }

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(20)
            .populate("userId", "name image")
            .lean();

        return NextResponse.json(notifications || []);

    } catch (error) {
        console.error("Notification Fetch Error:", error);
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}