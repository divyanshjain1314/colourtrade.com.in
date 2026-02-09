import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { showToast } from '@/lib/toast';

const StepUTR = ({ utr, setUtr, onSubmit }: any) => {
    const [loading, setLoading] = useState(false);

    const handleInternalSubmit = async () => {
        if (utr.length !== 12) {
            showToast.error("Enter 12-digit UTR");
            setTimeout(() => showToast.dismiss(), 1000);
            return;
        } setLoading(true);
        await onSubmit();
        setLoading(false);
    };

    return (
        <div className="animate-in slide-in-from-right duration-300">
            <h2 className="text-xl font-black text-white mb-2 uppercase italic text-center">Confirm <span className="text-cyan-400">Payment</span></h2>
            <p className="text-[10px] text-gray-500 mb-6 text-center uppercase font-bold tracking-widest">Paste your 12-digit UTR below</p>
            <input
                type="text"
                maxLength={12}
                value={utr}
                onChange={(e) => setUtr(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-2xl font-mono text-white outline-none focus:border-cyan-500 text-center tracking-[0.3em] font-bold mb-6"
            />
            <button
                disabled={loading || utr.length !== 12}
                onClick={handleInternalSubmit}
                className="w-full py-5 bg-cyan-500 disabled:bg-gray-800 text-black font-black rounded-full flex items-center justify-center gap-2 uppercase italic"
            >
                {loading ? <Loader2 className="animate-spin" /> : "Verify & Add Cash"}
            </button>
        </div>
    );
};
export default StepUTR;