import React from 'react';
import { Smartphone, Wallet, ArrowRight, ScanLine } from 'lucide-react';
import QRCode from "react-qr-code"; // ✅ Import Library

const PAYMENT_CONFIG = {
    vpa: 'BHARATPE.8M0A1F2A1R18210@fbpe',
    name: 'Colourst',
    currency: 'INR'
};

const UPI_APPS = [
    { name: 'PhonePe', scheme: 'phonepe://pay', color: '#5f259f' },
    { name: 'GPay', scheme: 'tez://upi/pay', color: '#4285F4' },
    { name: 'Paytm', scheme: 'paytmmp://pay', color: '#00BAF2' },
    { name: 'BHIM', scheme: 'upi://pay', color: '#e47911' },
    { name: 'Other', scheme: 'upi://pay', color: '#10b981' }
];

const StepPayment = ({ amount, onNext }: any) => {
    const upiString = `upi://pay?pa=${PAYMENT_CONFIG.vpa}&pn=${PAYMENT_CONFIG.name}&am=${amount}&cu=${PAYMENT_CONFIG.currency}&tn=Topup`;

    const handleRedirect = (baseScheme: string) => {
        const params = new URLSearchParams({
            pa: PAYMENT_CONFIG.vpa,
            pn: PAYMENT_CONFIG.name,
            am: amount.toString(),
            cu: PAYMENT_CONFIG.currency,
            tn: 'Topup'
        });
        const separator = baseScheme.includes('?') ? '&' : '?';
        const url = `${baseScheme}${separator}${params.toString()}`;
        window.location.href = url;
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
                    {/* Glowing Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>

                    {/* Protected Container */}
                    <div
                        className="relative p-3 bg-white rounded-xl shadow-2xl select-none"
                        onContextMenu={(e) => e.preventDefault()}
                    >
                        {/* ✅ QR CODE COMPONENT (SVG)
                            Ye automatically sharp SVG generate karega based on `upiString`
                        */}
                        <div className="pointer-events-none">
                            <QRCode
                                value={upiString}
                                size={160} // Size adjust kar sakte hain
                                viewBox={`0 0 256 256`}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            />
                        </div>

                        {/* Invisible Shield */}
                        <div className="absolute inset-0 z-20 bg-transparent"></div>
                    </div>

                    <div className="absolute -bottom-3 -right-3 bg-[#0d1520] border border-cyan-500 p-2 rounded-full text-cyan-400 shadow-lg z-30">
                        <ScanLine className="w-5 h-5" />
                    </div>
                </div>
                <p className="mt-3 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                    Or Select App Below
                </p>
            </div>

            {/* --- UPI APPS GRID (Same as before) --- */}
            <div className="grid grid-cols-3 gap-3 mb-6 px-1">
                {UPI_APPS.map((app, index) => (
                    <button
                        key={index}
                        onClick={() => handleRedirect(app.scheme)}
                        className="flex flex-col items-center gap-2 group active:scale-95 transition-all"
                    >
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#0d1520] border border-white/10 flex items-center justify-center group-hover:border-cyan-500/50 relative overflow-hidden shadow-lg">
                            <div className="absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20" style={{ backgroundColor: app.color }}></div>
                            {app.name === 'Other' ? (
                                <Wallet className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-white relative z-10" />
                            ) : (
                                <Smartphone className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-cyan-400 relative z-10" />
                            )}
                        </div>
                        <span className="text-[9px] md:text-[10px] font-bold text-gray-500 group-hover:text-white uppercase tracking-wide">
                            {app.name}
                        </span>
                    </button>
                ))}
            </div>

            <button
                onClick={onNext}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-black rounded-2xl border border-white/10 uppercase text-xs tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all active:scale-95"
            >
                I have Paid (Submit UTR) <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default StepPayment;