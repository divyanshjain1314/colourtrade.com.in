"use client";
import { useEffect, useState } from "react";
import Pusher from "pusher-js";

// ... Random Name & Amounts logic same ...
const getRandomName = () => {
    const names = ["Aarav", "Vihaan", "Aditya", "Sai", "Reyansh", "Arjun", "Krishna", "Ishaan", "Rohan", "Rahul", "Vikas"];
    const name = names[Math.floor(Math.random() * names.length)];
    return name.substring(0, 2) + "***";
};
const AMOUNTS = [100, 500, 1000, 5000, 100, 200];

interface LiveBetsProps {
    gameStatus: 'waiting' | 'locked';
}

export default function LiveBets({ gameStatus }: LiveBetsProps) {
    const [bets, setBets] = useState<any[]>([]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (gameStatus === 'waiting') {
            interval = setInterval(() => {
                const fakeBet = {
                    id: Math.random().toString(36).substr(2, 9),
                    user: getRandomName(),
                    amount: AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)],
                    select: ['red', 'green', 'violet'][Math.floor(Math.random() * 3)],
                    isFake: true
                };
                setBets((prev) => [fakeBet, ...prev].slice(0, 12)); // Keep 12 items max
            }, 800);
        }
        return () => clearInterval(interval);
    }, [gameStatus]);

    useEffect(() => {
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, { cluster: "ap2" });
        const channel = pusher.subscribe("public-game-channel");
        channel.bind("new-bet-placed", (data: any) => {
            setBets((prev) => [{ ...data, id: Math.random() }, ...prev].slice(0, 12));
        });
        return () => pusher.unsubscribe("public-game-channel");
    }, []);

    return (
        <div className="w-full h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-2 px-1">
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${gameStatus === 'locked' ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></span>
                    <h3 className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                        {gameStatus === 'locked' ? 'Bets Stopped' : 'Live Bets'}
                    </h3>
                </div>
                <p className="text-[10px] text-gray-600 font-mono">Public Feed</p>
            </div>

            {/* Box Container */}
            <div className="bg-[#0D121A] border border-white/5 rounded-2xl p-3 shadow-inner min-h-[160px] h-[calc(100%-24px)]">
                {bets.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-600 text-[10px] italic py-8">
                        Waiting for new round...
                    </div>
                ) : (
                    // Grid adjusted for Half Width (3 cols is perfect)
                    <div className="grid grid-cols-3 gap-2">
                        {bets.map((bet) => (
                            <div key={bet.id} className="bg-[#151b26] border border-white/5 p-1.5 rounded-lg flex flex-col items-center justify-center text-center animate-in zoom-in-50 duration-300">
                                <p className="text-[8px] text-gray-500 font-bold mb-0.5">{bet.user}</p>
                                <div className={`px-1.5 py-0.5 rounded text-[9px] font-black font-mono w-full mb-0.5
                                    ${bet.select === 'red' ? 'bg-red-500/10 text-red-500' :
                                        bet.select === 'green' ? 'bg-green-500/10 text-green-500' :
                                            'bg-purple-500/10 text-purple-500'}`
                                }>
                                    ₹{bet.amount}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}