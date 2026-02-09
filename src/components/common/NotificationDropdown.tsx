"use client";
import { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import Pusher from 'pusher-js';
import { Bell, User, ChevronRight } from 'lucide-react';
import { fetcher } from '@/lib/fetcher';
import Link from 'next/link';

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data: logs, mutate } = useSWR('/api/admin/notifications', fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshInterval: 0,
        shouldRetryOnError: false,
    });

    const unreadCount = Array.isArray(logs)
        ? logs.filter((l: any) => !l.isRead).length
        : 0;

    useEffect(() => {
        const markAsRead = async () => {
            if (isOpen && unreadCount > 0) {
                try {
                    await fetch('/api/notifications/mark-read', { method: 'PATCH' });

                    mutate(
                        (currentData: any) => {
                            if (Array.isArray(currentData)) {
                                return currentData.map((log: any) => ({ ...log, isRead: true }));
                            }
                            return currentData;
                        },
                        false
                    );
                } catch (error) {
                    console.error("Failed to mark notifications read", error);
                }
            }
        };

        markAsRead();
    }, [isOpen]);

    useEffect(() => {
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, { cluster: 'ap2' });
        const channel = pusher.subscribe("admin-channel");

        channel.bind("new-log", () => {
            mutate();

            new Audio('/audio/notification.mp3').play().catch(() => { });
        });

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            pusher.unsubscribe("admin-channel");
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [mutate]);

    const formatTimestamp = (date: string | Date) => {
        const now = new Date();
        const msgDate = new Date(date);
        const diffInSeconds = Math.floor((now.getTime() - msgDate.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        return msgDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2 rounded-xl bg-[#0d1520] border-2 transition-all duration-300 ${isOpen ? 'border-cyan-500' : 'border-cyan-500/30'}`}
            >
                <Bell className={`w-6 h-6 ${unreadCount > 0 ? 'text-cyan-400' : 'text-cyan-400/70'}`} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff3b3b] text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-[#0d1520]">
                        {unreadCount}
                    </span>
                )}
            </button>

            <div className={`absolute right-0 mt-4 w-85 bg-[#0d1520] border border-white/10 rounded-4xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] backdrop-blur-3xl z-999 transition-all duration-300 origin-top-right overflow-hidden
                ${isOpen ? 'opacity-100 translate-y-0 scale-100 visible' : 'opacity-0 translate-y-4 scale-95 invisible'}`}
            >
                <div className="p-5 border-b border-white/5">
                    <h3 className="text-[11px] font-black uppercase italic tracking-[2px] text-white/50">SYSTEM LOGS</h3>
                </div>

                <div className="max-h-95 overflow-y-auto custom-scrollbar">
                    {Array.isArray(logs) && logs.length > 0 ? (
                        logs.map((log: any) => (
                            <div key={log._id} className={`p-4 border-b border-white/3 transition-all group ${!log.isRead ? 'bg-white/5' : 'hover:bg-white/2'}`}>
                                <div className="flex items-center gap-4">
                                    <div className="relative shrink-0">
                                        <div className="w-14 h-14 rounded-full border-2 border-white/10 overflow-hidden bg-white/5">
                                            {log.userId?.image ? (
                                                <img src={log.userId.image} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-cyan-500/20 to-transparent">
                                                    <User className="w-7 h-7 text-white/20" />
                                                </div>
                                            )}
                                        </div>
                                        <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#0d1520] ${log.type === 'warning' ? 'bg-[#ff3b3b]' : 'bg-[#00e676]'}`} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className={`w-full text-[14px] font-black uppercase italic transition-colors truncate tracking-tight ${!log.isRead ? 'text-cyan-400' : 'text-white group-hover:text-cyan-400'}`}>
                                                {log.userId?.name || "PLAYER"}
                                            </h4>
                                        </div>

                                        <p className="text-[12px] text-gray-400 font-medium leading-tight mb-2">
                                            {log.message}
                                        </p>

                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                                            {formatTimestamp(log.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-16 text-center opacity-20">
                            <Bell className="w-12 h-12 mx-auto mb-2" />
                            <p className="text-[10px] font-black uppercase italic">No Activity</p>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-white/2">
                    <Link href="/admin/notifications" className="flex items-center justify-center gap-2 w-full py-4 rounded-3xl border border-white/5 bg-white/5 text-[11px] font-black uppercase italic tracking-widest text-white/50 hover:text-white hover:border-white/10 transition-all">
                        VIEW ALL ACTIVITY <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}