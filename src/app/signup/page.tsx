"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { User, Mail, Lock, Loader2, ShieldCheck, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                alert("Account created successfully! Redirecting to login...");
                router.push('/login');
            } else {
                alert(data.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            alert("Connection error. Check your internet and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050A10] flex items-center justify-center p-3 md:p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-125 h-125 bg-red-500/10 blur-[150px] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-125 h-125 bg-cyan-500/10 blur-[150px] rounded-full translate-x-1/2 translate-y-1/2"></div>

            <div className="w-full max-w-md bg-[#0D1520]/80 border border-white/10 rounded-[40px] px-5 py-10 md:p-10 backdrop-blur-3xl shadow-2xl relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-[1000] italic tracking-tighter uppercase text-white">
                        Create <span className="text-red-500">Account</span>
                    </h1>
                    <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mt-2 italic">Join the ultimate gaming arena</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name Field */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                name="name"
                                type="text"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-red-500 transition-all font-medium"
                                required
                                autoComplete='one-time-code'
                            />
                        </div>
                    </div>

                    {/* Phone Number Field (Required) */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                name="phone"
                                type="tel"
                                placeholder="10-digit mobile number"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-red-500 transition-all font-medium"
                                required
                                autoComplete='one-time-code'

                            />
                        </div>
                    </div>

                    {/* Email Field (Optional) */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email (Optional)</label>
                        <div className="relative">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-red-500 transition-all font-medium opacity-80"
                                autoComplete='one-time-code'

                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-red-500 transition-all font-medium"
                                required
                                autoComplete='one-time-code'

                            />
                        </div>
                    </div>

                    {/* Terms Agreement */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-red-500/5 rounded-2xl border border-red-500/10 mt-2">
                        <ShieldCheck className="text-red-500 w-5 h-5 shrink-0" />
                        <p className="text-[10px] text-gray-400 leading-tight uppercase font-bold tracking-wider">I agree to the terms of service and age verification policy.</p>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full py-4 bg-red-600 text-white font-black rounded-full shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase italic tracking-tighter mt-4"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up Securely"}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        Already a member?
                        <Link href="/login" className="text-white font-black ml-2 hover:text-red-500 transition-colors uppercase italic">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}