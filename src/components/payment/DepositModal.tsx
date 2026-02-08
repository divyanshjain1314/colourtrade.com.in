"use client";
import React, { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import StepAmount from './steps/StepAmount';
import StepPayment from './steps/StepPayment';
import StepUTR from './steps/StepUTR';
import StepSuccess from './steps/StepSuccess';

interface DepositProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (amount: number) => void;
}

export type DepositStep = 'amount' | 'payment' | 'utr' | 'success';

const DepositModal = ({ isOpen, onClose, onSuccess }: DepositProps) => {
    const [step, setStep] = useState<DepositStep>('amount');
    const [amount, setAmount] = useState<number>(1000);
    const [utr, setUtr] = useState<string>('');

    if (!isOpen) return null;

    const handleBack = () => {
        if (step === 'payment') setStep('amount');
        else if (step === 'utr') setStep('payment');
        else onClose();
    };

    return (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4 backdrop-blur-md bg-black/60">
            <div className="bg-[#0D1520] border border-white/10 w-full max-w-md rounded-[40px] p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">

                {/* Dynamic Header Button */}
                <button
                    onClick={step === 'success' ? onClose : handleBack}
                    className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-20"
                >
                    {step === 'amount' || step === 'success' ? <X className="w-6 h-6" /> : <ArrowLeft className="w-6 h-6" />}
                </button>

                {step === 'amount' && (
                    <StepAmount amount={amount} setAmount={setAmount} onNext={() => setStep('payment')} />
                )}

                {step === 'payment' && (
                    <StepPayment amount={amount} onNext={() => setStep('utr')} />
                )}

                {step === 'utr' && (
                    <StepUTR
                        utr={utr}
                        setUtr={setUtr}
                        onSubmit={async () => {
                            // Backend Integration Point: 
                            // axios.post('/api/deposit', { amount, utr })
                            setStep('success');
                            setTimeout(() => {
                                onSuccess(amount);
                                onClose();
                                setStep('amount');
                                setUtr('');
                            }, 4000);
                        }}
                    />
                )}

                {step === 'success' && <StepSuccess />}
            </div>
        </div>
    );
};

export default DepositModal;