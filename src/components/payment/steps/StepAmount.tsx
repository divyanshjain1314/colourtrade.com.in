import React from 'react';

const StepAmount = ({ amount, setAmount, onNext }: any) => (
    <div className="animate-in fade-in zoom-in duration-300">
        <h2 className="text-2xl font-black italic text-white mb-6 uppercase text-center">
            Enter <span className="text-cyan-400">Amount</span>
        </h2>
        <div className="relative mb-8 text-white">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-400 font-black text-xl">₹</span>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-2xl font-mono font-bold outline-none focus:border-cyan-500"
            />
        </div>
        <button onClick={onNext} className="w-full py-4 bg-cyan-500 text-black font-black rounded-full shadow-[0_0_20px_cyan]/30 uppercase active:scale-95 transition-all">
            Continue
        </button>
    </div>
);
export default StepAmount;