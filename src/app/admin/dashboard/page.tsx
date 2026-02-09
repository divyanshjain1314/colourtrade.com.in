"use client";

import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import {
    Users,
    Wallet,
    AlertCircle,
    TrendingUp,
    ArrowUpRight,
    ArrowRight,
    LayoutDashboard,
    History
} from 'lucide-react';
import Header from '@/components/common/Header';
import Link from 'next/link';

export default function AdminDashboard() {
    const { data: stats } = useSWR('/api/admin/stats', fetcher);
    const safeStats = stats || {
        totalUsers: 0,
        pendingRequests: 0,
        totalWalletBalance: 0,
        todayDeposit: 0
    };

    return (
        <div className="bg-[#050A10] text-white min-h-screen pb-20 font-sans">
            <Header />

            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">

                {/* --- WELCOME SECTION --- */}
                <div className="mb-10">
                    <h1 className="text-3xl md:text-5xl font-[1000] italic tracking-tighter uppercase text-white">
                        Admin <span className="text-cyan-500">Overview</span>
                    </h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">
                        Welcome back, Chief. Here is what's happening today.
                    </p>
                </div>

                {/* --- STATS GRID (4 Cards) --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

                    {/* Card 1: Pending Requests (Most Important) */}
                    <Link href="/admin/requests" className="group relative bg-[#0D1520] border border-white/5 p-6 rounded-[32px] overflow-hidden hover:border-cyan-500/50 transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <AlertCircle className="w-16 h-16 text-cyan-500" />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-3 rounded-2xl ${safeStats.pendingRequests > 0 ? 'bg-cyan-500 text-black animate-pulse' : 'bg-white/5 text-gray-400'}`}>
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Action Needed</span>
                        </div>
                        <h3 className="text-4xl font-[1000] italic tracking-tight text-white mb-1">
                            {safeStats.pendingRequests}
                        </h3>
                        <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                            Pending Deposits <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </p>
                    </Link>

                    {/* Card 2: Total Users */}
                    <div className="relative bg-[#0D1520] border border-white/5 p-6 rounded-[32px] overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Users className="w-16 h-16 text-purple-500" />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
                                <Users className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Total Players</span>
                        </div>
                        <h3 className="text-4xl font-[1000] italic tracking-tight text-white mb-1">
                            {safeStats.totalUsers}
                        </h3>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Registered Users
                        </p>
                    </div>

                    {/* Card 3: System Balance */}
                    <div className="relative bg-[#0D1520] border border-white/5 p-6 rounded-[32px] overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Wallet className="w-16 h-16 text-green-500" />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 rounded-2xl bg-green-500/10 text-green-500">
                                <Wallet className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">User Wallet Holdings</span>
                        </div>
                        <h3 className="text-4xl font-[1000] italic tracking-tight text-white mb-1">
                            ₹{(safeStats.totalWalletBalance || 0).toLocaleString()}
                        </h3>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Total Liability
                        </p>
                    </div>

                    {/* Card 4: Today's Revenue */}
                    <div className="relative bg-[#0D1520] border border-white/5 p-6 rounded-[32px] overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <TrendingUp className="w-16 h-16 text-yellow-500" />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 rounded-2xl bg-yellow-500/10 text-yellow-500">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Today's Deposit</span>
                        </div>
                        <h3 className="text-4xl font-[1000] italic tracking-tight text-white mb-1">
                            ₹{(safeStats.todayDeposit || 0).toLocaleString()}
                        </h3>
                        <p className="text-xs font-bold text-yellow-500 uppercase tracking-wider flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3" /> Growing
                        </p>
                    </div>
                </div>

                {/* --- MAIN CONTENT SPLIT --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT: Quick Actions & Navigation */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[#0D1520] border border-white/5 rounded-[40px] p-8">
                            <h2 className="text-xl font-[1000] italic uppercase tracking-tighter mb-6 flex items-center gap-2">
                                <LayoutDashboard className="w-5 h-5 text-cyan-500" />
                                Quick <span className="text-cyan-500">Actions</span>
                            </h2>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <Link href="/admin/requests" className="p-4 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all group text-center">
                                    <div className="w-12 h-12 mx-auto bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <AlertCircle className="w-6 h-6" />
                                    </div>
                                    <p className="text-xs font-black uppercase italic tracking-widest">Verify Deposits</p>
                                </Link>

                                <Link href="/admin/users" className="p-4 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all group text-center">
                                    <div className="w-12 h-12 mx-auto bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <p className="text-xs font-black uppercase italic tracking-widest">Manage Users</p>
                                </Link>

                                <Link href="/admin/notifications" className="p-4 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-green-500/10 hover:border-green-500/30 transition-all group text-center">
                                    <div className="w-12 h-12 mx-auto bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <History className="w-6 h-6" />
                                    </div>
                                    <p className="text-xs font-black uppercase italic tracking-widest">Activity Logs</p>
                                </Link>
                            </div>
                        </div>

                        {/* Recent Activity Banner */}
                        <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-white/5 rounded-[40px] p-8 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-[900] italic uppercase tracking-tighter text-white">Need to check Payment Proofs?</h3>
                                <p className="text-xs text-gray-400 mt-1 font-medium">Review pending UTR numbers and screenshots.</p>
                            </div>
                            <Link href="/admin/requests" className="px-6 py-3 bg-white text-black rounded-xl font-black uppercase italic text-xs hover:scale-105 transition-transform">
                                Go Now
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT: Live Monitoring (Mini Version of Notification) */}
                    <div className="bg-[#0D1520] border border-white/5 rounded-[40px] p-6 h-fit">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-[1000] italic uppercase tracking-tighter">Live <span className="text-green-500">Feed</span></h2>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
                        </div>

                        {/* Yahan hum NotificationDropdown ka content reuse kar sakte hain ya simplified list dikha sakte hain */}
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">System Status</p>
                                <div className="flex items-center gap-2 text-sm font-bold text-white">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    Payments Gateway Active
                                </div>
                                <div className="flex items-center gap-2 text-sm font-bold text-white mt-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    Realtime Sockets Connected
                                </div>
                            </div>

                            <Link href="/admin/notifications" className="block w-full py-3 rounded-xl border border-white/10 text-center text-[10px] font-black uppercase italic tracking-widest text-gray-400 hover:bg-white/5 hover:text-white transition-all">
                                View Full Activity Log
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// Icon helper for the static part
function CheckCircle({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    )
}