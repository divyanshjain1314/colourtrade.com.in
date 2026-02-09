"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Wallet, PlusCircle, CreditCard, History, LogOut, User, Loader2 } from 'lucide-react';
import DepositModal from '../payment/DepositModal';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

const Header = () => {
    const { data: session } = useSession();
    const [isDepositOpen, setIsDepositOpen] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const walletBalance = session?.user?.wallet ?? 0;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handlePaymentSuccess = (amount: number) => {
        // handle logic
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await signOut({ callbackUrl: '/login' });
    };

    return (
        <>
            {/* Global Logout Overlay */}
            {isLoggingOut && (
                <div className="fixed inset-0 z-[999] bg-[#050A10]/80 backdrop-blur-md flex flex-col items-center justify-center">
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

                <div className="absolute right-4 md:right-8 flex items-center gap-2">
                    <div
                        className="relative group"
                        ref={dropdownRef}
                        onMouseEnter={() => setIsOpen(true)}
                        onMouseLeave={() => setIsOpen(false)}
                    >
                        <div
                            onClick={() => setIsOpen(!isOpen)}
                            className={`bg-[#111821] px-4 md:px-6 py-2 rounded-lg flex items-center gap-3 md:gap-4 border transition-all cursor-pointer active:scale-95 ${isOpen ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'border-white/5'}`}
                        >
                            <Wallet className="w-5 h-5 md:w-6 md:h-6 text-white stroke-1" />
                            <div className="flex items-center gap-1 md:gap-2">
                                <span className="text-white font-black text-lg md:text-xl">₹</span>
                                <span className="font-mono text-lg md:text-xl tracking-tight text-white font-bold">
                                    {walletBalance.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>

                        <div className={`absolute top-full right-0 mt-3 w-52 bg-[#0D1520]/95 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300 backdrop-blur-2xl ${isOpen ? 'visible opacity-100 translate-y-0' : 'invisible opacity-0 translate-y-4'}`}>
                            <div className="p-2.5 space-y-1">
                                <div className="px-3 py-2 mb-1 border-b border-white/5">
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Wallet Actions</p>
                                </div>

                                <Link href="/profile" className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-300 hover:bg-white/5 rounded-xl transition-colors">
                                    <User className="w-5 h-5" />
                                    My Profile
                                </Link>

                                <button
                                    onClick={() => {
                                        setIsDepositOpen(true); // Fixed: was set to false
                                        setIsOpen(false);
                                    }}
                                    type='button'
                                    className="w-full flex items-center gap-3 px-3 py-3 text-sm font-bold text-cyan-400 hover:bg-cyan-500/10 rounded-xl transition-colors active:bg-cyan-500/20 group/btn">
                                    <PlusCircle className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
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

                                <div className="pt-1 mt-1 border-t border-white/5">
                                    <button
                                        onClick={handleLogout}
                                        disabled={isLoggingOut}
                                        className="w-full flex items-center gap-3 px-3 py-3 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-xl transition-colors disabled:opacity-50">
                                        {isLoggingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
                                        {isLoggingOut ? "Processing..." : "Logout"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DepositModal
                isOpen={isDepositOpen}
                onClose={() => setIsDepositOpen(false)}
                onSuccess={handlePaymentSuccess}
            />
        </>
    );
};

export default Header;