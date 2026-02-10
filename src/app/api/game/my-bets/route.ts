import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import { Bet } from "@/models/Game";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();

    const bets = await Bet.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(30);

    return NextResponse.json({ success: true, bets });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching bets" }, { status: 500 });
  }
}