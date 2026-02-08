import React from 'react';
import { Smartphone } from 'lucide-react';

const UPI_APPS = [
    { name: 'PhonePe', scheme: 'phonepe://pay', color: '#5f259f' },
    { name: 'GPay', scheme: 'tez://upi/pay', color: '#4285F4' },
    { name: 'Paytm', scheme: 'paytmmp://cash_wallet?featuretype=cash_it&', color: '#00BAF2' },
    { name: 'BHIM', scheme: 'upi://pay', color: '#e47911' },
    { name: 'Fampay', scheme: 'upi://pay', color: '#000000' }
];

const StepPayment = ({ amount, onNext }: any) => {
    const handleRedirect = (appScheme: string) => {
        const url = `${appScheme}${appScheme.includes('?') ? '' : '?'}pa=colourtrading-1@ybl&pn=Admin&am=${amount}&cu=INR`;
        window.location.href = url;
        setTimeout(onNext, 3000);
    };

    return (
        <div className="text-center animate-in slide-in-from-right duration-300">
            <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tighter">Pay via <span className="text-cyan-400">UPI Apps</span></h2>
            <div className="grid grid-cols-3 gap-4 mb-8">
                {UPI_APPS.map((app) => (
                    <button key={app.name} onClick={() => handleRedirect(app.scheme)} className="flex flex-col items-center gap-2 group active:scale-90 transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-cyan-400 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10" style={{ backgroundColor: app.color }}></div>
                            <Smartphone className="w-7 h-7 text-gray-400 group-hover:text-cyan-400 relative z-10" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 group-hover:text-white uppercase">{app.name}</span>
                    </button>
                ))}
            </div>
            <button onClick={onNext} className="w-full py-4 bg-white/5 text-cyan-400 font-black rounded-2xl border border-cyan-500/20 uppercase text-xs tracking-widest">
                I have paid (Submit UTR)
            </button>
        </div>
    );
};
export default StepPayment;