"use client";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Clock } from "lucide-react";

export default function MyActiveBets({ currentPeriodId }: { currentPeriodId: string }) {
    // Auto refresh every 3 seconds
    const { data } = useSWR('/api/game/my-bets', fetcher, { refreshInterval: 3000 });

    const bets = data?.bets || [];

    // Filter only Current Period Bets
    const activeBets = bets.filter((b: any) => b.periodId === currentPeriodId);

    return (
        <div className="w-full h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-2 px-1">
                <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-cyan-400 animate-pulse" />
                    <h3 className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                        My Active Bets
                    </h3>
                </div>
                <p className="text-[10px] text-gray-600 font-mono">Period: {currentPeriodId}</p>
            </div>

            {/* Box Container - Same Height/Style as Live Bets */}
            <div className="bg-[#0D121A] border border-white/5 rounded-2xl p-3 shadow-inner min-h-[160px] h-[calc(100%-24px)]">
                {activeBets.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-2 py-8">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                            <span className="text-xl grayscale">🎲</span>
                        </div>
                        <p className="text-[10px] italic">No bets in this round</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-[140px] custom-scrollbar pr-1">
                        {activeBets.map((bet: any) => (
                            <div key={bet._id} className="bg-[#151b26] border border-white/5 p-2 rounded-lg flex items-center justify-between animate-in zoom-in-50 duration-300">
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${bet.select === 'red' ? 'bg-red-500 text-red-500' :
                                            bet.select === 'green' ? 'bg-green-500 text-green-500' : 'bg-purple-500 text-purple-500'
                                        }`}></span>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-gray-300">{bet.select}</p>
                                        <p className="text-[9px] text-gray-600">x2</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[11px] font-black text-white font-mono">₹{bet.amount}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}