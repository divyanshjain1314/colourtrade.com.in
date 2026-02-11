import { useState } from 'react';
import { ArrowRight, ScanLine, Copy, Check } from 'lucide-react';
import QRCode from "react-qr-code";
import { showToast } from '@/lib/toast';

const PAYMENT_METHODS: any = {
    UPI: {
        label: 'UPI ID',
        vpa: 'BHARATPE.8M0A1F2A1R18210@fbpe',
        qrValue: (amount: any) => `upi://pay?pa=BHARATPE.8M0A1F2A1R18210@fbpe&pn=Colourst&am=${amount}&cu=INR&tn=Topup`
    },
    USDT: {
        label: 'USDT Address (Binance)',
        vpa: 'TLRzL3ycP8AtfRAr9jpVvp4b2vwpRyxRST', 
    },
    PAYPAL: {
        label: 'PayPal Email',
        vpa: 'jain.divyansh3113@gmail.com',
    }
};

const StepPayment = ({ amount, onNext }: any) => {
    const [activeTab, setActiveTab] = useState('UPI');
    const [copied, setCopied] = useState(false);

    const currentConfig = PAYMENT_METHODS[activeTab];

    const handleCopy = () => {
        navigator.clipboard.writeText(currentConfig.vpa);
        setCopied(true);
        showToast.success(`${activeTab} Details Copied!`, 2000);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="text-center animate-in slide-in-from-right duration-300">
            {/* --- TABS SECTION --- */}
            <div className="max-w-[90%] flex bg-white/5 p-1 rounded-xl mb-6 border border-white/10">
                {Object.keys(PAYMENT_METHODS).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${
                            activeTab === tab 
                            ? 'bg-cyan-500 text-white shadow-lg' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <h2 className="text-xl font-black text-white mb-1 uppercase tracking-tighter">
                {activeTab === 'UPI' ? (
                    <>Scan <span className="text-white mx-1">&</span> Pay</>
                ) : (
                    <>Copy <span className="text-white mx-1">&</span> Pay</>
                )}
            </h2>
            <p className="text-xs text-gray-400 mb-5 font-mono">
                Amount: <span className="text-cyan-400 font-bold text-sm">₹{amount}</span>
            </p>

            {/* --- QR CODE SECTION (Only for UPI) --- */}
            {activeTab === 'UPI' && (
                <div className="flex flex-col items-center justify-center mb-6 animate-in fade-in zoom-in duration-300">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                        <div className="relative p-3 bg-white rounded-xl shadow-2xl select-none">
                            <div className="pointer-events-none">
                                <QRCode
                                    value={currentConfig.qrValue(amount)}
                                    size={160}
                                    viewBox={`0 0 256 256`}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                />
                            </div>
                        </div>
                        <div className="absolute -bottom-3 -right-3 bg-[#0d1520] border border-cyan-500 p-2 rounded-full text-cyan-400 shadow-lg z-30">
                            <ScanLine className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            )}

            {/* --- DYNAMIC COPY SECTION --- */}
            <div className="mb-8 px-2">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">
                    {activeTab === 'UPI' ? 'Or Copy UPI ID' : `Copy ${activeTab} Address`}
                </p>
                <button
                    onClick={handleCopy}
                    className="w-full bg-[#0D121A] border border-white/10 rounded-xl p-3 flex items-center justify-between group active:scale-95 transition-all hover:border-cyan-500/50"
                >
                    <div className="flex flex-col items-start truncate mr-2 text-left">
                        <span className="text-[10px] text-gray-400">{currentConfig.label}</span>
                        <span className="text-sm font-mono font-bold text-white tracking-wide truncate w-full">
                            {currentConfig.vpa}
                        </span>
                    </div>
                    <div className={`shrink-0 p-2 rounded-lg transition-all ${copied ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-gray-400 group-hover:text-white'}`}>
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </div>
                </button>
            </div>

            <button
                onClick={onNext}
                className="w-full py-3.5 bg-linear-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-black rounded-2xl border border-white/10 uppercase text-xs tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all active:scale-95"
            >
                I have Paid (Submit UTR) <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default StepPayment;