import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Withdrawal from "@/models/Withdrawal";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { amount, upiId } = await req.json();

        if (!amount || amount < 10000) {
            return NextResponse.json({ error: "Minimum withdrawal amount is ₹10,000" }, { status: 400 });
        }

        if (!upiId) {
            return NextResponse.json({ error: "Please provide a valid UPI ID" }, { status: 400 });
        }

        await connectToDatabase();

        const user = await User.findById(session.user.id);
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        if (user.wallet < amount) {
            return NextResponse.json({ error: "Insufficient Wallet Balance" }, { status: 400 });
        }

        user.wallet -= amount;
        await user.save();

        await Withdrawal.create({
            userId: user._id,
            amount,
            upiId,
            status: 'pending'
        });

        return NextResponse.json({
            success: true,
            message: "Withdrawal request sent to Admin!",
            remainingBalance: user.wallet
        });

    } catch (error) {
        console.error("Withdrawal Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}