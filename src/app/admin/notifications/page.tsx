"use client";
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { User, Clock, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import Header from '@/components/common/Header';
import Link from 'next/link';
import Pusher from 'pusher-js';

const formatTimestamp = (date: string | Date) => {
    const now = new Date();
    const msgDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - msgDate.getTime()) / 1000);
    if (diffInSeconds < 60) return 'Just now';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    return msgDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

export default function AdminNotificationPage() {
    const [filter, setFilter] = useState('all');
    const { data: logs, mutate } = useSWR(`/api/admin/notifications/all?type=${filter}`, fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshInterval: 0,
        shouldRetryOnError: false,
    });

    useEffect(() => {
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, { cluster: 'ap2' });

        const channel = pusher.subscribe("admin-channel");

        channel.bind("new-log", () => {
            mutate();
        });

        return () => {
            pusher.unsubscribe("admin-channel");
        };
    }, [mutate]);

    return (
        <div className="bg-[#050A10] text-white min-h-screen pb-20">
            <Header />

            <div className="max-w-4xl mx-auto px-4 pt-10">

                <div className="flex flex-col gap-6 mb-12">
                    <Link
                        href="/dashboard"
                        className="group flex items-center gap-2 text-gray-500 hover:text-cyan-400 transition-all w-fit"
                    >
                        <div className="p-2 rounded-full bg-white/5 group-hover:bg-cyan-500/10 border border-white/5 group-hover:border-cyan-500/20">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black uppercase italic tracking-widest">Back to Dashboard</span>
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-[1000] italic tracking-tighter uppercase leading-[0.8]">
                                System <span className="text-cyan-500">Activity</span>
                            </h1>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-4 ml-1">
                                Real-time user logs & deposit tracking
                            </p>
                        </div>

                        <div className="flex bg-[#0D1520] p-1.5 rounded-2xl border border-white/5 shadow-2xl h-fit">
                            {['all', 'success', 'warning'].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setFilter(t)}
                                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase italic tracking-widest transition-all ${filter === t
                                        ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                                        : 'text-gray-500 hover:text-white'
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {!logs ? (
                        <div className="py-20 text-center animate-pulse">
                            <p className="text-gray-600 font-black uppercase italic tracking-widest">Loading Logs...</p>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="py-20 text-center bg-[#0D1520] rounded-[40px] border border-white/5 border-dashed">
                            <p className="text-gray-500 font-black uppercase italic tracking-widest">No activity found in this category</p>
                        </div>
                    ) : (
                        logs.map((log: any) => (
                            <div
                                key={log._id}
                                className={`group flex items-center gap-6 p-6 rounded-[32px] border transition-all hover:scale-[1.01] ${log.type === 'warning'
                                    ? 'bg-red-500/5 border-red-500/10 hover:border-red-500/30'
                                    : 'bg-[#0D1520] border-white/5 hover:border-cyan-500/30'
                                    }`}
                            >
                                {/* Left: User Avatar */}
                                <div className="relative shrink-0">
                                    <div className="w-16 h-16 rounded-full border-2 border-white/10 overflow-hidden bg-white/5 shadow-inner">
                                        {log.userId?.image ? (
                                            <img src={log.userId.image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-full h-full p-4 text-white/10" />
                                        )}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#050A10] ${log.type === 'warning' ? 'bg-red-500' : 'bg-green-500'
                                        }`} />
                                </div>

                                {/* Center: Message Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                                        <h4 className="text-lg font-[900] uppercase italic tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                                            {log.userId?.name || "Unknown Player"}
                                        </h4>
                                        <span className="hidden md:block text-gray-800 font-bold">•</span>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                                            <Clock className="w-3 h-3" />
                                            {formatTimestamp(log.createdAt)}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-400 font-medium leading-relaxed group-hover:text-gray-300 transition-colors">
                                        {log.message}
                                    </p>
                                </div>

                                {/* Right: Action Icon */}
                                <div className="hidden md:block shrink-0">
                                    {log.type === 'warning' ? (
                                        <AlertTriangle className="w-6 h-6 text-red-500/20 group-hover:text-red-500 transition-all duration-500" />
                                    ) : (
                                        <CheckCircle className="w-6 h-6 text-green-500/20 group-hover:text-green-500 transition-all duration-500" />
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Bottom Info */}
                <div className="mt-16 py-8 border-t border-white/5 flex justify-between items-center px-4">
                    <p className="text-[10px] font-black uppercase italic tracking-widest text-white/10">
                        System Activity Logs v1.0
                    </p>
                    <p className="text-[10px] font-black uppercase italic tracking-widest text-white/20">
                        Total: {logs?.length || 0} Records
                    </p>
                </div>
            </div>
        </div>
    );
}