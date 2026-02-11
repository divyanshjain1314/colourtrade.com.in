"use client";
import React from 'react';
import { X } from 'lucide-react';
import WithdrawForm from '../wallet/WithdrawForm'; // Make sure path correct ho

interface WithdrawModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WithdrawModal({ isOpen, onClose }: WithdrawModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="relative w-full max-w-md">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 md:-right-12 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors z-50"
                >
                    <X className="w-6 h-6" />
                </button>

                <WithdrawForm onClose={onClose} />
            </div>
        </div>
    );
}