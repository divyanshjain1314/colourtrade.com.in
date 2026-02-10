"use client";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher"; // Agar fetcher nahi hai to neeche define kar dunga
import { Loader2 } from "lucide-react";

export default function GameHistory({ periodId }: { periodId: string }) {
    const [activeTab, setActiveTab] = useState<'trend' | 'history'>('history');

    // Fetch My Bets
    const { data: myBetsData, isLoading } = useSWR('/api/game/my-bets', fetcher, {
        refreshInterval: 3000 // Har 3 sec mein refresh taaki Result dikhe
    });

    // Fetch Game Trend (Results) - Iska API aapne pehle banaya hoga ya mock data use karein
    // Filhal main Trend ko Static rakh raha hu demo ke liye, aap API connect kar lena

    return (
        <div className="w-full max-w-5xl mx-auto px-4 mb-20">
            <div className="bg-[#0D121A] rounded-3xl border border-white/5 overflow-hidden">

                {/* --- TABS HEADER --- */}
                <div className="flex border-b border-white/5">
                    <button
                        onClick={() => setActiveTab('trend')}
                        className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-colors
            ${activeTab === 'trend' ? 'bg-white/5 text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Game Record
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-colors
            ${activeTab === 'history' ? 'bg-white/5 text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        My History
                    </button>
                </div>

                {/* --- TAB CONTENT --- */}
                <div className="min-h-[300px]">

                    {/* 1. MY HISTORY TAB */}
                    {activeTab === 'history' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[10px] text-gray-500 uppercase font-black bg-white/5">
                                        <th className="px-4 py-3">Period</th>
                                        <th className="px-4 py-3">Select</th>
                                        <th className="px-4 py-3">Point</th>
                                        <th className="px-4 py-3 text-right">Result</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={4} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-cyan-500" /></td>
                                        </tr>
                                    ) : myBetsData?.bets?.map((bet: any) => (
                                        <tr key={bet._id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3 text-xs font-mono text-gray-400">{bet.periodId}</td>
                                            <td className="px-4 py-3">
                                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded 
                          ${bet.select === 'red' ? 'bg-red-500/20 text-red-500' :
                                                        bet.select === 'green' ? 'bg-green-500/20 text-green-500' :
                                                            'bg-purple-500/20 text-purple-500'}`}>
                                                    {bet.select}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-xs font-bold text-white">₹{bet.amount}</td>
                                            <td className="px-4 py-3 text-right">
                                                {bet.status === 'pending' ? (
                                                    <span className="text-[10px] font-bold text-yellow-500 uppercase">Pending</span>
                                                ) : bet.status === 'win' ? (
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-[10px] font-bold text-green-500 uppercase">WIN</span>
                                                        <span className="text-[10px] font-mono text-green-400">+₹{bet.winAmount}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-[10px] font-bold text-red-500 uppercase">LOSE</span>
                                                        <span className="text-[10px] font-mono text-red-400">-₹{bet.amount}</span>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {!isLoading && myBetsData?.bets?.length === 0 && (
                                        <tr><td colSpan={4} className="p-8 text-center text-xs text-gray-600">No bets found</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* 2. TREND TAB (Static Demo Data - Isko API se replace karna) */}
                    {activeTab === 'trend' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[10px] text-gray-500 uppercase font-black bg-white/5">
                                        <th className="px-4 py-3">Period</th>
                                        <th className="px-4 py-3 text-center">Number</th>
                                        <th className="px-4 py-3 text-right">Color</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-xs font-bold">
                                    {/* Demo Rows */}
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3 text-gray-400 font-mono">20260212{1000 - i}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="inline-block w-6 h-6 leading-6 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/10 text-[10px]">
                                                    {Math.floor(Math.random() * 10)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right flex justify-end gap-1">
                                                <span className={`w-3 h-3 rounded-full ${i % 2 === 0 ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-green-500 shadow-[0_0_8px_green]'}`}></span>
                                                {i % 5 === 0 && <span className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_purple]"></span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}