import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { Bet } from "@/models/Game";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: "ap2",
  useTLS: true,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { amount, type, select, periodId } = await req.json();

    if (amount < 10) return NextResponse.json({ error: "Min bet is ₹10" }, { status: 400 });

    await connectToDatabase();

    const user = await User.findById(session.user.id);
    if (!user || user.wallet < amount) {
      return NextResponse.json({ error: "Insufficient Balance" }, { status: 400 });
    }

    user.wallet -= amount;
    await user.save();

    const existingBet = await Bet.findOne({
      userId: user._id,
      periodId: periodId,
      select: select
    });

    let betData;

    if (existingBet) {
      existingBet.amount += amount;
      existingBet.isAggregated = true;
      await existingBet.save();
      betData = existingBet;
    } else {
      betData = await Bet.create({
        userId: user._id,
        periodId,
        type,
        select,
        amount
      });
    }

    const maskedName = user.name.substring(0, 2) + "***";
    
    await pusher.trigger("public-game-channel", "new-bet-placed", {
      user: maskedName,
      amount: amount, 
      select: select,
      avatar: user.image || "/default-avatar.png"
    });

    await pusher.trigger(`user-${user._id}`, 'my-bets-updated', {});

    return NextResponse.json({ success: true, message: "Bet Placed", balance: user.wallet });

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}