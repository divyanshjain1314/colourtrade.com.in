"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Wallet, PlusCircle, CreditCard, History, LogOut, User, Loader2, LayoutDashboard, BellRing } from 'lucide-react';
import DepositModal from '../payment/DepositModal';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import NotificationDropdown from './NotificationDropdown';
import { showToast } from '@/lib/toast';
import useSWR, { mutate } from 'swr';
import Pusher from 'pusher-js';
import { fetcher } from '@/lib/fetcher';

const Header = () => {
    const { data: session } = useSession();
    const [isDepositOpen, setIsDepositOpen] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isAdmin = session?.user?.role === 'admin';

    const { data: balanceData } = useSWR(
        session?.user?.id && !isAdmin ? '/api/user/balance' : null,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 0,
            shouldRetryOnError: false,
            fallbackData: { balance: session?.user?.wallet || 0 }
        }
    );

    useEffect(() => {
        if (session?.user?.id && !isAdmin) {
            const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, { cluster: 'ap2' });
            const channelName = `user-${session.user.id}`;
            const channel = pusher.subscribe(channelName);

            channel.bind("new-balance", (data: any) => {
                if (data.type === 'success') {
                    showToast.success(data.message);
                    new Audio('/success-sound.mp3').play().catch(() => { });
                    mutate('/api/user/balance');
                    mutate('/api/user/notifications');
                }
                else {
                    showToast.error(data.message);
                    mutate('/api/user/notifications');
                }
                setTimeout(() => {
                    showToast.dismiss();
                }, 3000);
            });
            return () => {
                channel.unbind_all();
                pusher.unsubscribe(channelName);
                pusher.disconnect();
            };
        }
    }, [session, isAdmin]);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await signOut({ callbackUrl: '/login' });
    };

    return (
        <>
            {isLoggingOut && (
                <div className="fixed inset-0 z-999 bg-[#050A10]/80 backdrop-blur-md flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
                    <p className="text-white font-black uppercase tracking-widest italic text-xl">Logging Out...</p>
                </div>
            )}

            <div className="relative flex items-center md:justify-center w-full px-4 md:px-8 py-10 z-100">
                <h1 className="text-lg md:text-5xl font-[1000] italic tracking-tighter leading-none select-none uppercase">
                    <span className="text-[#FF3B3B] drop-shadow-[0_0_12px_rgba(255,59,59,0.6)]">PLAY</span>
                    <span className="text-white mx-2 md:mx-3">&</span>
                    <span className="text-[#00E676] drop-shadow-[0_0_12px_rgba(0,230,118,0.6)]">WIN DAILY</span>
                </h1>

                <div className="absolute right-4 md:right-8 flex items-center gap-3">

                    <div className="relative">
                        <NotificationDropdown />
                    </div>


                    <div className="relative group" ref={dropdownRef}>

                        {isAdmin ? (
                            <div
                                onClick={() => setIsOpen(!isOpen)}
                                className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-cyan-500/50 p-1 cursor-pointer hover:border-cyan-500 transition-all active:scale-95 overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                            >
                                {session?.user?.image ? (
                                    <img src={session.user.image} alt="Admin" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-[#111821] flex items-center justify-center">
                                        <User className="text-cyan-500 w-6 h-6" />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div
                                onClick={() => setIsOpen(!isOpen)}
                                className={`bg-[#111821] px-4 md:px-6 py-2 rounded-lg flex items-center gap-3 md:gap-4 border transition-all cursor-pointer active:scale-95 ${isOpen ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'border-white/5'}`}
                            >
                                <Wallet className="w-5 h-5 md:w-6 md:h-6 text-white stroke-1" />
                                <div className="flex items-center gap-1 md:gap-2">
                                    <span className="text-white font-black text-lg md:text-xl">₹</span>
                                    <span className="font-mono text-lg md:text-xl tracking-tight text-white font-bold">
                                        {balanceData?.balance?.toLocaleString('en-IN') || 0}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className={`absolute top-full right-0 mt-3 w-60 bg-[#0D1520]/95 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300 backdrop-blur-2xl z-110 ${isOpen ? 'visible opacity-100 translate-y-0' : 'invisible opacity-0 translate-y-4'}`}>
                            <div className="p-2.5 space-y-1">

                                {isAdmin ? (
                                    <>
                                        <div className="px-3 py-2 mb-1 border-b border-white/5">
                                            <p className="text-[10px] text-cyan-500 uppercase font-black tracking-widest">Admin Control</p>
                                        </div>
                                        <Link href="/admin/requests" onClick={() => setIsOpen(false)} className="w-full flex items-center gap-3 px-3 py-3 text-sm font-bold text-white hover:bg-cyan-500/10 rounded-xl transition-colors">
                                            <LayoutDashboard className="w-5 h-5 text-cyan-500" />
                                            Manage Requests
                                        </Link>
                                        <Link href="/admin/notifications" onClick={() => setIsOpen(false)} className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-300 hover:bg-white/5 rounded-xl transition-colors">
                                            <BellRing className="w-5 h-5" />
                                            Activity Logs
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <div className="px-3 py-2 mb-1 border-b border-white/5">
                                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Wallet Actions</p>
                                        </div>
                                        <button onClick={() => { setIsDepositOpen(true); setIsOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 text-sm font-bold text-cyan-400 hover:bg-cyan-500/10 rounded-xl transition-colors">
                                            <PlusCircle className="w-5 h-5" />
                                            Add Money
                                        </button>
                                        <button className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-300 hover:bg-white/5 rounded-xl transition-colors">
                                            <CreditCard className="w-5 h-5" />
                                            Withdraw
                                        </button>
                                        <button className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-400 hover:bg-white/5 rounded-xl transition-colors">
                                            <History className="w-5 h-5" />
                                            Transactions
                                        </button>
                                    </>
                                )}

                                <div className="pt-1 mt-1 border-t border-white/5">
                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-3 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-xl transition-colors">
                                        <LogOut className="w-5 h-5" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {!isAdmin && (
                <DepositModal
                    isOpen={isDepositOpen}
                    onClose={() => setIsDepositOpen(false)}
                    onSuccess={(amount) => console.log(amount)}
                />
            )}
        </>
    );
};

export default Header;