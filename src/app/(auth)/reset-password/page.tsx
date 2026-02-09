"use client";

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, Loader2, CheckCircle2, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { showToast } from '@/lib/toast';

function ResetPasswordForm() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match");
            return;
        }

        setLoading(true);
        setErrorMsg('');

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setTimeout(() => router.push('/login'), 3000);
            } else {
                setErrorMsg(data.error || "Something went wrong");
                setStatus('error');
            }
        } catch (error) {
            showToast.error('Connection Error');
        } finally {
            setTimeout(() => {
                showToast.dismiss();
            }, 1000);
            setLoading(false);
        }
    };

    if (status === 'success') {
        return (
            <div className="text-center py-10">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="text-green-400 w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">Success!</h2>
                <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                    Your password has been updated. Redirecting to login...
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-[1000] italic tracking-tighter uppercase text-white">
                    New <span className="text-cyan-400">Password</span>
                </h1>
                <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mt-2">Set your new secure access</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {errorMsg && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-widest p-3 rounded-xl text-center">
                        {errorMsg}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">New Password</label>
                    <div className="relative">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-14 text-white outline-none focus:border-cyan-500 transition-all font-medium"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Confirm Password</label>
                    <div className="relative">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-14 text-white outline-none focus:border-cyan-500 transition-all font-medium"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <button
                    disabled={loading || !token}
                    className="w-full py-4 bg-cyan-500 text-black font-black rounded-full shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3 uppercase italic tracking-tighter"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Update Password <ArrowRight className="w-5 h-5" /></>}
                </button>
            </form>
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-[#050A10] flex items-center justify-center p-3 md:p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-125 h-125 bg-cyan-500/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-125 h-125 bg-red-500/10 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

            <div className="w-full max-w-md bg-[#0D1520]/80 border border-white/10 rounded-[40px] px-5 py-10 md:p-10 backdrop-blur-3xl shadow-2xl relative z-10">
                <Suspense fallback={<Loader2 className="w-10 h-10 animate-spin text-cyan-500 mx-auto" />}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}