import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ balance: 0 });

    await connectToDatabase();
    const user = await User.findById(session.user.id).select('wallet');

    return NextResponse.json({ balance: user?.wallet || 0 });
}