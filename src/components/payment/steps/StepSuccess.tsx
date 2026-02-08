import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const StepSuccess = () => (
    <div className="py-10 flex flex-col items-center animate-in zoom-in duration-300">
        <CheckCircle2 className="w-20 h-20 text-green-500 mb-4 drop-shadow-[0_0_20px_rgba(34,197,94,0.6)]" />
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Request Sent!</h2>
        <p className="text-gray-500 text-center text-[11px] mt-4 uppercase font-bold tracking-widest leading-loose">
            Our team is verifying your UTR number.<br />Balance will be updated in <span className="text-white">5-10 minutes</span>.
        </p>
    </div>
);
export default StepSuccess;