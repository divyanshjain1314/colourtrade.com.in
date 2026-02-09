"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Loader2, ArrowLeft, Send } from 'lucide-react';
import { showToast } from '@/lib/toast';

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [identifier, setIdentifier] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [sendEmail, setSendEmail] = useState('')
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            // Success state
            setSendEmail(data.email)
            setSubmitted(true);
        } catch (err: any) {
            showToast.error('Connection Error');
            setError(err.message);
        } finally {
            setTimeout(() => {
                showToast.dismiss();
            }, 1000);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050A10] flex items-center justify-center p-3 md:p-6 relative overflow-hidden">
            {/* Background Glows (Matching Login) */}
            <div className="absolute top-0 right-0 w-125 h-125 bg-cyan-500/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-125 h-125 bg-red-500/10 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

            <div className="w-full max-w-md bg-[#0D1520]/80 border border-white/10 rounded-[40px] px-5 py-10 md:p-10 backdrop-blur-3xl shadow-2xl relative z-10">

                {!submitted ? (
                    <>
                        <div className="text-center mb-10">
                            <h1 className="text-4xl font-[1000] italic tracking-tighter uppercase text-white">
                                Reset <span className="text-cyan-400">Access</span>
                            </h1>
                            <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mt-2">
                                Enter your email or phone to recover account
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-widest p-3 rounded-xl text-center">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                                    Email or Phone Number
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Email or +91..."
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-cyan-500 transition-all font-medium"
                                        required
                                        autoComplete='one-time-code'
                                    />
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                className="w-full py-4 bg-cyan-500 text-black font-black rounded-full shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase italic tracking-tighter"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send Reset Link <Send className="w-5 h-5" /></>}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-10">
                        <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Send className="text-cyan-400 w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">Check your inbox</h2>
                        <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                            We've sent a password reset link to <span className="text-white font-bold">{sendEmail}</span>.
                            Please check your inbox and follow the instructions.
                        </p>
                        <button
                            onClick={() => setSubmitted(false)}
                            className="mt-8 text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest"
                        >
                            Didn't receive it? Try again
                        </button>
                    </div>
                )}

                <div className="mt-8 text-center border-t border-white/5 pt-8">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-gray-500 text-sm font-bold hover:text-white transition-colors uppercase italic"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}