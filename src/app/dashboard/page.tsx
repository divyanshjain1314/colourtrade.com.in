"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Pusher from "pusher-js";
import Header from "@/components/common/Header";
import { useGameEngine } from "@/hooks/useGameEngine";
import { useWallet } from "@/hooks/useWallet";
import { showToast } from "@/lib/toast";
import BettingModal from "@/components/game/BettingModal";
import WinResultModal from "@/components/game/WinResultModal";
import LiveBets from "@/components/game/LiveBets";
import MyActiveBets from "@/components/game/MyActiveBets";
import MyGameHistory from "@/components/game/MyGameHistory";

export default function DashboardPage() {
    const { timeLeft, periodId, status } = useGameEngine();
    const { data: session } = useSession();
    const { updateBalance } = useWallet();

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState<'red' | 'green' | 'violet' | null>(null);
    const [winData, setWinData] = useState<{ amount: number; periodId: string } | null>(null);
    
    // Track previous period to detect changes
    const prevPeriodRef = useRef<string>("");

    // --- 1. Result & Balance Sync Listener (Pusher) ---
    useEffect(() => {
        if (session?.user?.id) {
            const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, { cluster: 'ap2' });
            
            const channel = pusher.subscribe(`user-${session.user.id}`);
            channel.bind('game-result', (data: any) => {
                updateBalance(); 
                if (data.type === 'win') {
                    setWinData({ amount: data.amount, periodId: data.periodId });
                    new Audio('/audio/win.mp3').play().catch(()=>{});
                }
                // Loss ka toast hataya taki user disturb na ho, history main dikh jayega
            });

            return () => {
                pusher.unsubscribe(`user-${session.user.id}`);
            };
        }
    }, [session]);

    // --- 2. ROBUST RESULT TRIGGER (Fix for Stuck Pending) ---
    useEffect(() => {
        if (!periodId) return;

        // A. Initial Load Check: 
        // Agar user refresh karke aya hai, to check karo pichla period process hua ya nahi
        if (prevPeriodRef.current === "") {
            const possiblePrevId = (BigInt(periodId) - BigInt(1)).toString();
            fetch('/api/game/result', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ periodId: possiblePrevId })
            });
            prevPeriodRef.current = periodId;
            return;
        }

        // B. Period Change Detection:
        // Agar Period ID badal gayi (e.g. 195 -> 196), iska matlab 195 khatam.
        if (periodId !== prevPeriodRef.current) {
            console.log(`Period Changed: ${prevPeriodRef.current} -> ${periodId}. Processing Result...`);
            
            // Call result for the FINISHED period (jo abhi just khatam hua)
            fetch('/api/game/result', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ periodId: prevPeriodRef.current })
            });

            // Update ref to current
            prevPeriodRef.current = periodId;
        }

    }, [periodId]);

    const handlePlaceBet = async (amount: number) => {
        try {
            const res = await fetch('/api/game/bet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount,
                    type: selectedColor, 
                    select: selectedColor,
                    periodId
                })
            });
            
            const data = await res.json();
            if (data.success) {
                showToast.success("Bet Placed Successfully!", 2000);
                setModalOpen(false);
                updateBalance();
            } else {
                showToast.error(data.error || "Something went wrong", 2000);
            }
        } catch (e) {
            showToast.error("Failed to place bet", 2000);
        }
    };

    return (
        <div className="bg-[#0009] text-white min-h-screen pb-20">
            <Header />
            
            <BettingModal 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)} 
                color={selectedColor} 
                periodId={periodId} 
                onConfirm={handlePlaceBet} 
            />

            <WinResultModal 
                isOpen={!!winData} 
                onClose={() => setWinData(null)} 
                data={winData} 
            />

            <div className="flex flex-col items-center pt-8">
                {/* Timer Section */}
                <div className="text-center mb-8 relative">
                    <div className="inline-block bg-[#1A212C] px-4 py-1.5 rounded-full border border-white/10 mb-4 shadow-lg">
                         <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                             Period: <span className="text-cyan-400 font-mono text-xs">{periodId}</span>
                         </p>
                    </div>

                    <div className="relative">
                        <h2 className={`text-7xl font-black tracking-tighter italic drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] font-mono ${status === 'locked' ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                            {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </h2>
                        {status === 'locked' && (
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                                <span className="bg-red-600 text-white text-xs font-black uppercase px-3 py-1 rounded-md tracking-widest shadow-xl">LOCKED</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Game Buttons */}
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full max-w-4xl px-4 transition-all duration-300 ${status === 'locked' ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                     <button onClick={() => { setSelectedColor('red'); setModalOpen(true); }} className="bg-[#410000] border-red-500/40 border p-6 rounded-2xl relative overflow-hidden group">
                        <span className="text-[#FF4D4D] font-black text-xl italic relative z-10">JOIN RED</span>
                        <div className="absolute inset-0 bg-red-600/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                     </button>
                     <button onClick={() => { setSelectedColor('green'); setModalOpen(true); }} className="bg-[#003D1F] border-green-500/40 border p-6 rounded-2xl relative overflow-hidden group">
                        <span className="text-[#00E676] font-black text-xl italic relative z-10">JOIN GREEN</span>
                        <div className="absolute inset-0 bg-green-600/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                     </button>
                     <button onClick={() => { setSelectedColor('violet'); setModalOpen(true); }} className="bg-[#2D0052] border-purple-500/40 border p-6 rounded-2xl relative overflow-hidden group">
                        <span className="text-[#BB66FF] font-black text-xl italic relative z-10">JOIN VIOLET</span>
                        <div className="absolute inset-0 bg-purple-600/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                     </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-5xl px-4 mb-8">
                    <div className="w-full">
                        <LiveBets gameStatus={status} />
                    </div>
                    <div className="w-full">
                        <MyActiveBets currentPeriodId={periodId} />
                    </div>
                </div>

                <div className="w-full px-4">
                     <MyGameHistory currentPeriodId={periodId} gameStatus={status} />
                </div>
            </div>
        </div>
    );
}