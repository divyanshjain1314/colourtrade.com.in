import connectToDatabase from "@/lib/mongodb";
import Deposit from "@/models/Deposit";
import { NextResponse } from "next/server";

export async function GET() {
    await connectToDatabase();
    const requests = await Deposit.find({ status: 'pending' })
        .sort({ createdAt: -1 })
        .populate("userId", "name image");
    return NextResponse.json(requests);
}