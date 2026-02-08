"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Wallet, Power, PlusCircle, CreditCard, History } from 'lucide-react';

interface HeaderProps {
    balance?: number;
    onAddMoney: () => void;
}

const Header: React.FC<HeaderProps> = ({ balance = 0, onAddMoney }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative flex items-center justify-center w-full px-4 md:px-8 py-10 z-100">

            <h1 className="text-2xl md:text-5xl font-[1000] italic tracking-tighter leading-none select-none uppercase">
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
                        className={`bg-[#111821] px-4 md:px-6 py-2 rounded-lg flex items-center gap-3 md:gap-4 border transition-all cursor-pointer active:scale-95 ${isOpen ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'border-white/5'
                            }`}
                    >
                        <Wallet className="w-5 h-5 md:w-6 md:h-6 text-white stroke-1" />
                        <div className="flex items-center gap-1 md:gap-2">
                            <span className="text-white font-black text-lg md:text-xl">₹</span>
                            <span className="font-mono text-lg md:text-xl tracking-tight text-white font-bold">
                                {balance.toLocaleString('en-IN')}
                            </span>
                        </div>
                    </div>

                    <div className={`absolute top-full right-0 mt-3 w-52 bg-[#0D1520]/95 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300 backdrop-blur-2xl ${isOpen ? 'visible opacity-100 translate-y-0' : 'invisible opacity-0 translate-y-4'
                        }`}>
                        <div className="p-2.5 space-y-1">
                            <div className="px-3 py-2 mb-1 border-b border-white/5">
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Wallet Actions</p>
                            </div>

                            <button
                                onClick={() => {
                                    onAddMoney();
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
                        </div>
                    </div>
                </div>

                <button className="h-10 w-10 md:h-11 md:w-11 bg-[#111821] border border-[#ff3b3b]/30 rounded-lg flex items-center justify-center hover:bg-[#ff3b3b] transition-all active:scale-90 group">
                    <Power className="w-5 h-5 md:w-6 md:h-6 text-[#ff3b3b] group-hover:text-white transition-colors stroke-2" />
                </button>
            </div>
        </div>
    );
};

export default Header;