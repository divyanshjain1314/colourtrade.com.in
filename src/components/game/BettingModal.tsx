"use client";
import React, { useState, useEffect } from 'react';
import { X, Check, Loader2, Minus, Plus } from 'lucide-react';

interface BettingModalProps {
    isOpen: boolean;
    onClose: () => void;
    color: 'red' | 'green' | 'violet' | null;
    periodId: string;
    onConfirm: (amount: number) => Promise<void>;
}

export default function BettingModal({ isOpen, onClose, color, periodId, onConfirm }: BettingModalProps) {
    const [contractMoney, setContractMoney] = useState(100);
    const [multiplier, setMultiplier] = useState(1);
    const [loading, setLoading] = useState(false);
    const [agreed, setAgreed] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setContractMoney(100);
            setMultiplier(1);
            setLoading(false);
        }
    }, [isOpen]);

    if (!isOpen || !color) return null;

    const totalAmount = contractMoney * multiplier;

    const getThemeColor = () => {
        if (color === 'red') return { bg: 'bg-[#fa3c09]', text: 'text-[#fa3c09]', border: 'border-[#fa3c09]' };
        if (color === 'green') return { bg: 'bg-[#00e676]', text: 'text-[#00e676]', border: 'border-[#00e676]' };
        return { bg: 'bg-[#b659fe]', text: 'text-[#b659fe]', border: 'border-[#b659fe]' };
    };

    const theme = getThemeColor();

    const handleConfirm = async () => {
        if (!agreed) return;
        setLoading(true);
        await onConfirm(totalAmount);
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-90 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-[2px] animate-in fade-in duration-200">
            <div className="w-full md:w-100 bg-[#1a212c] rounded-t-3xl md:rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
                <div className={`${theme.bg} p-4 relative`}>
                    <div className="text-center">
                        <h3 className="text-white font-black italic uppercase tracking-widest text-lg drop-shadow-md">
                            Select {color}
                        </h3>
                        <p className="text-white/80 text-[10px] font-mono tracking-widest">
                            Period: {periodId}
                        </p>
                    </div>
                    <button onClick={onClose} className="absolute top-1/2 -translate-y-1/2 right-4 bg-black/20 p-1.5 rounded-full hover:bg-black/40 transition-colors">
                        <X className="w-5 h-5 text-white" />
                    </button>
                    <div className="absolute -bottom-3 left-0 right-0 h-6 bg-[#1a212c] rounded-t-[20px]"></div>
                </div>

                <div className="px-6 pb-6 pt-2">
                    <div className="mb-6">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3">Contract Money</p>
                        <div className="flex gap-2">
                            {[100, 500, 1000, 5000].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => { setContractMoney(val); setMultiplier(1); }}
                                    className={`flex-1 py-2 rounded-lg text-xs font-black font-mono transition-all border ${contractMoney === val ? `${theme.bg} text-white border-transparent shadow-lg scale-105` : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}
                                >
                                    {val}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Number</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Multiplier</p>
                        </div>
                        <div className="flex items-center justify-between bg-[#0D121A] p-1.5 rounded-xl border border-white/5">
                            <button onClick={() => setMultiplier(Math.max(1, multiplier - 1))} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-lg text-white hover:bg-white/10 active:scale-90 transition-all">
                                <Minus className="w-4 h-4" />
                            </button>
                            <div className="flex flex-col items-center">
                                <span className={`text-xl font-black italic ${theme.text}`}>x{multiplier}</span>
                            </div>
                            <button onClick={() => setMultiplier(multiplier + 1)} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-lg text-white hover:bg-white/10 active:scale-90 transition-all">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-6 bg-black/20 p-4 rounded-xl border border-white/5">
                        <span className="text-xs text-gray-400 font-bold uppercase">Total Contract Money</span>
                        <span className={`text-2xl font-black font-mono ${theme.text}`}>₹{totalAmount}</span>
                    </div>

                    <div className="flex items-center gap-3 mb-6 cursor-pointer group" onClick={() => setAgreed(!agreed)}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${agreed ? `${theme.border} ${theme.bg}` : 'border-gray-600'}`}>
                            {agreed && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold group-hover:text-gray-300 transition-colors">I agree to the <span className={theme.text}>Presale Management Rule</span></span>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 py-3.5 rounded-xl bg-[#0D121A] text-gray-400 font-bold text-xs uppercase tracking-widest hover:bg-[#151b26] transition-colors">Cancel</button>
                        <button onClick={handleConfirm} disabled={loading || !agreed} className={`flex-1 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${loading || !agreed ? 'bg-gray-600 cursor-not-allowed opacity-50' : `${theme.bg} hover:brightness-110`}`}>
                            {loading ? (<><Loader2 className="w-4 h-4 animate-spin" /> Processing</>) : (`Confirm ₹${totalAmount}`)}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}