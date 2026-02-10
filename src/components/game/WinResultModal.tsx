"use client";
import { useEffect, useState } from "react";
import Confetti from "react-confetti"; // Optional: npm install react-confetti

interface WinProps {
    isOpen: boolean;
    onClose: () => void;
    data: { amount: number; periodId: string } | null;
}

export default function WinResultModal({ isOpen, onClose, data }: WinProps) {
    if (!isOpen || !data) return null;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Confetti Explosion */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                 <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={500} />
            </div>

            <div className="relative w-[90%] max-w-sm bg-gradient-to-b from-[#1a212c] to-[#0D121A] rounded-3xl p-8 text-center border border-yellow-500/30 shadow-[0_0_50px_rgba(234,179,8,0.2)] animate-in zoom-in-50 duration-500">
                
                {/* Header Image or Icon */}
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <span className="text-4xl">🏆</span>
                </div>

                <h2 className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 mb-2 drop-shadow-sm">
                    YOU WIN!
                </h2>
                <p className="text-gray-400 text-xs uppercase tracking-widest mb-6">Period: {data.periodId}</p>

                <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/5">
                    <p className="text-gray-400 text-[10px] uppercase font-bold mb-1">Winning Amount</p>
                    <p className="text-4xl font-black text-green-400 font-mono">₹{data.amount}</p>
                </div>

                <button 
                    onClick={onClose}
                    className="w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-black uppercase tracking-widest rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all"
                >
                    Awesome
                </button>
            </div>
        </div>
    );
}