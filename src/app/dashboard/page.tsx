'use client'

import Header from "@/components/common/Header";

export default function DashboardPage() {
    return (
        <div className="bg-[#0009] text-white">
            <Header />
            <div className="min-h-screen flex items-center justify-center p-4 md:p-10 relative overflow-hidden">
                <div className="w-full max-w-5xl relative z-10 transform perspective-1000">
                    <div className="w-full rounded-[40px  overflow-hidden">
                        <div className="p-8 pt-0">
                            <div className="text-center mb-10">
                                <div className="inline-block bg-[#1A212C] px-4 py-1 rounded-md border border-white/5 mb-3">
                                    <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em]">Next Result In</p>
                                </div>
                                <h2 className="text-7xl font-black tracking-tighter italic drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                    00:27
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                <button className="relative group overflow-hidden rounded-2xl py-6 bg-[#410000] border border-red-500/40 hover:border-red-500 transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.15)] hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]">
                                    <span className="relative z-10 text-[#FF4D4D] font-black text-xl italic tracking-tighter">JOIN RED x2</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </button>

                                <button className="relative group overflow-hidden rounded-2xl py-6 bg-[#003D1F] border border-green-500/40 hover:border-green-500 transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.15)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                                    <span className="relative z-10 text-[#00E676] font-black text-xl italic tracking-tighter">JOIN GREEN x2</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </button>

                                <button className="relative group overflow-hidden rounded-2xl py-6 bg-[#2D0052] border border-purple-500/40 hover:border-purple-500 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                                    <span className="relative z-10 text-[#BB66FF] font-black text-xl italic tracking-tighter">JOIN VIOLET x4</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </button>
                            </div>

                            {/* Amount Chips Selection */}
                            <div className="flex flex-wrap gap-4 justify-center mb-12">
                                {["100", "500", "1000", "5000"].map((amt) => (
                                    <button
                                        key={amt}
                                        className="w-16 h-16 rounded-full border-2 border-dashed border-white/10 bg-white/5 hover:border-cyan-400 hover:text-cyan-400 transition-all flex items-center justify-center font-black text-xs"
                                    >
                                        ₹{amt}
                                    </button>
                                ))}
                            </div>

                            {/* Stats Info Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                                <div className="bg-[#0D121A] rounded-2xl p-5 border border-white/5 shadow-inner">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total Red</p>
                                    <p className="text-2xl font-black text-red-500 italic">₹12,800</p>
                                </div>

                                <div className="bg-[#0D121A] rounded-2xl p-5 border border-white/5 shadow-inner">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total Green</p>
                                    <p className="text-2xl font-black text-green-500 italic">₹3,000</p>
                                </div>

                                <div className="bg-[#0D121A] rounded-2xl p-5 border border-white/5 shadow-inner col-span-2 md:col-span-1">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Online Users</p>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        <p className="text-2xl font-black text-cyan-400 italic">15,901</p>
                                    </div>
                                </div>
                            </div>

                            {/* Prediction Records Table */}
                            <div className="bg-black/20 rounded-3xl border border-white/5 overflow-hidden">
                                <div className="px-6 py-4 border-b border-white/5 bg-white/5">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic">Prediction Record</h3>
                                </div>
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-[10px] text-gray-500 uppercase font-black">
                                            <th className="px-6 py-4">Period</th>
                                            <th className="px-6 py-4">Price</th>
                                            <th className="px-6 py-4 text-center">Result</th>
                                            <th className="px-6 py-4 text-right">Color</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-xs font-bold divide-y divide-white/5">
                                        {[1, 2, 3, 4].map((i) => (
                                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 text-gray-400 font-mono">2026020{i}</td>
                                                <td className="px-6 py-4">₹2,100</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-block w-6 h-6 leading-6 rounded-full bg-green-500/20 text-green-500 border border-green-500/40 text-[10px]">9</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="inline-block w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}