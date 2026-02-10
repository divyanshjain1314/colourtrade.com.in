import { useState } from 'react';
import { ArrowRight, ScanLine, Copy, Check } from 'lucide-react';
import QRCode from "react-qr-code";
import { showToast } from '@/lib/toast';

const PAYMENT_CONFIG = {
    vpa: 'BHARATPE.8M0A1F2A1R18210@fbpe',
    name: 'Colourst',
    currency: 'INR'
};

const StepPayment = ({ amount, onNext }: any) => {
    const [copied, setCopied] = useState(false);

    const upiString = `upi://pay?pa=${PAYMENT_CONFIG.vpa}&pn=${PAYMENT_CONFIG.name}&am=${amount}&cu=${PAYMENT_CONFIG.currency}&tn=Topup`;

    const handleCopy = () => {
        navigator.clipboard.writeText(PAYMENT_CONFIG.vpa);
        setCopied(true);
        showToast.success("UPI ID Copied!",2000);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="text-center animate-in slide-in-from-right duration-300">

            <h2 className="text-xl font-black text-white mb-1 uppercase tracking-tighter">
                Scan <span className="text-white mx-1">&</span> Pay
            </h2>
            <p className="text-xs text-gray-400 mb-5 font-mono">
                Amount to Pay: <span className="text-cyan-400 font-bold text-sm">₹{amount}</span>
            </p>

            {/* --- SVG QR CODE SECTION --- */}
            <div className="flex flex-col items-center justify-center mb-6">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>

                    <div className="relative p-3 bg-white rounded-xl shadow-2xl select-none" onContextMenu={(e) => e.preventDefault()}>
                        <div className="pointer-events-none">
                            <QRCode
                                value={upiString}
                                size={160}
                                viewBox={`0 0 256 256`}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            />
                        </div>
                        <div className="absolute inset-0 z-20 bg-transparent"></div>
                    </div>

                    <div className="absolute -bottom-3 -right-3 bg-[#0d1520] border border-cyan-500 p-2 rounded-full text-cyan-400 shadow-lg z-30">
                        <ScanLine className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* --- MANUAL UPI ID COPY SECTION (NEW) --- */}
            <div className="mb-8 px-2">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Or Copy UPI ID</p>
                <button
                    onClick={handleCopy}
                    className="w-full bg-[#0D121A] border border-white/10 rounded-xl p-3 flex items-center justify-between group active:scale-95 transition-all hover:border-cyan-500/50"
                >
                    <div className="flex flex-col items-start">
                        <span className="text-[10px] text-gray-400">Merchant VPA</span>
                        <span className="text-sm font-mono font-bold text-white tracking-wide">{PAYMENT_CONFIG.vpa}</span>
                    </div>
                    <div className={`p-2 rounded-lg transition-all ${copied ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-gray-400 group-hover:text-white'}`}>
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </div>
                </button>
            </div>

            {/* --- COMMENTED OUT UPI APPS --- */}
            {/* <div className="grid grid-cols-3 gap-3 mb-6 px-1">
                {UPI_APPS.map((app, index) => (
                    // ... old button code ...
                ))}
            </div>
            */}

            <button
                onClick={onNext}
                className="w-full py-3.5 bg-linear-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-black rounded-2xl border border-white/10 uppercase text-xs tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all active:scale-95"
            >
                I have Paid (Submit UTR) <ArrowRight className="w-4 h-4" />
            </button>

            <p className="mt-4 text-[10px] text-gray-500 italic">
                Please copy the UPI ID and pay via any app if scanner doesn't work.
            </p>
        </div>
    );
};

export default StepPayment;