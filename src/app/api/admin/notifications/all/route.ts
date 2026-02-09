import connectToDatabase from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { NextResponse } from "next/server";
import "@/models/User";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');

        await connectToDatabase();

        // Filter logic
        let query: any = { target: 'admin' };
        if (type && type !== 'all') {
            query.type = type;
        }

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .populate("userId", "name image");

        return NextResponse.json(notifications);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}