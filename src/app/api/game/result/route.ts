import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Bet, Period } from "@/models/Game";
import User from "@/models/User";
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
    const { periodId } = await req.json();
    await connectToDatabase();

    const bets = await Bet.find({ periodId, status: 'pending' }).populate('userId');

    let redTotal = 0;
    let greenTotal = 0;
    let violetTotal = 0;

    bets.forEach(b => {
      if (b.select === 'red') redTotal += b.amount;
      else if (b.select === 'green') greenTotal += b.amount;
      else if (b.select === 'violet') violetTotal += b.amount;
    });

    let winningColor = '';
    
    const uniqueUsers = new Set(bets.map(b => b.userId._id.toString()));
    
    if (uniqueUsers.size === 1) {
       const user = bets[0].userId;
       const userBetColor = bets[0].select;
       
       if (user.totalWinnings < 9500) {
         if (Math.random() < 0.7) {
            winningColor = userBetColor;
         } else {
            winningColor = userBetColor === 'red' ? 'green' : 'red';
         }
       } else {
         winningColor = userBetColor === 'red' ? 'green' : 'red';
       }
    } else {
       if (redTotal <= greenTotal && redTotal <= violetTotal) winningColor = 'red';
       else if (greenTotal < redTotal && greenTotal <= violetTotal) winningColor = 'green';
       else winningColor = 'violet';

       if (redTotal === 0 && greenTotal === 0 && violetTotal === 0) {
           winningColor = Math.random() < 0.5 ? 'red' : 'green';
       }
    }

    let winningNumber = 0;
    if (winningColor === 'red') winningNumber = [2, 4, 6, 8][Math.floor(Math.random() * 4)];
    else if (winningColor === 'green') winningNumber = [1, 3, 7, 9][Math.floor(Math.random() * 4)];
    else winningNumber = [0, 5][Math.floor(Math.random() * 2)];

    const updates = bets.map(async (bet) => {
      let winAmount = 0;
      let status = 'lose';

      if (bet.select === winningColor) {
        status = 'win';
        if (winningColor === 'violet') winAmount = bet.amount * 4.5;
        else winAmount = bet.amount * 2;
      }

      bet.status = status;
      bet.winAmount = winAmount;
      await bet.save();

      if (status === 'win') {
        const user = await User.findById(bet.userId);
        if (user) {
          user.wallet += winAmount;
          user.totalWinnings += winAmount;
          await user.save();

          await pusher.trigger(`user-${user._id}`, 'game-result', {
            type: 'win',
            amount: winAmount,
            periodId: periodId,
          });
        }
      } else {
         const user = await User.findById(bet.userId);
         if(user) {
             await pusher.trigger(`user-${user._id}`, 'game-result', {
                 type: 'lose',
                 amount: 0,
                 periodId: periodId
             });
         }
      }
    });

    await Promise.all(updates);

    const existingPeriod = await Period.findOne({ periodId });
    if (!existingPeriod) {
        await Period.create({
          periodId,
          winningNumber,
          winningColor,
          totalBets: bets.length,
        });
    }

    await pusher.trigger('public-game-channel', 'result-declared', {
        periodId,
        winningNumber,
        winningColor
    });

    return NextResponse.json({ success: true, winner: winningColor });

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}