"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { showToast } from '@/lib/toast';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const isEmail = identifier.includes('@');
            const loginData = isEmail
                ? { email: identifier, password, redirect: false }
                : { phone: identifier, password, redirect: false };

            const res = await signIn('credentials', loginData);

            if (res?.status === 200) {
                router.push('/dashboard');
                router.refresh();
            } else {
                showToast.error("Invalid login credentials");
                setLoading(false);
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

    return (
        <div className="min-h-screen bg-[#050A10] flex items-center justify-center p-3 md:p-6 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-125 h-125 bg-cyan-500/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-125 h-125 bg-red-500/10 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

            <div className="w-full max-w-md bg-[#0D1520]/80 border border-white/10 rounded-[40px] px-5 py-10 md:p-10 backdrop-blur-3xl shadow-2xl relative z-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-[1000] italic tracking-tighter uppercase text-white">
                        Welcome <span className="text-cyan-400">Back</span>
                    </h1>
                    <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mt-2">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-cyan-500 transition-all font-medium"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete='one-time-code'
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Link
                            href="/forgot-password"
                            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full py-4 bg-cyan-500 text-black font-black rounded-full shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase italic tracking-tighter"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Login Now <ArrowRight className="w-5 h-5" /></>}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        Don't have an account?
                        <Link href="/signup" className="text-white font-black ml-2 hover:text-cyan-400 transition-colors uppercase italic">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}