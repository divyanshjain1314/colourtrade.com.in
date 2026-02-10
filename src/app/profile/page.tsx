"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { User, Mail, Phone, Wallet, Camera, Shield, Save, Loader2, ArrowLeft } from 'lucide-react';
import Header from '@/components/common/Header';
import Link from 'next/link';
import { showToast } from '@/lib/toast';

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(session?.user?.image || null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [name, setName] = useState(session?.user?.name || '');

    useEffect(() => {
        if (session?.user?.name) {
            setName(session.user.name);
        }
        if (session?.user?.image) {
            setImagePreview(session.user.image);
        }
    }, [session]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        showToast.loading("Syncing with servers...");

        try {
            const formData = new FormData();
            formData.append('name', name);

            if (selectedFile) {
                formData.append('file', selectedFile);
            }

            const res = await fetch('/api/user/update', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                await update({
                    name: data.user.name,
                    image: data.user.image
                });
                showToast.dismiss();
                showToast.success("Profile Updated! 🚀");
                setSelectedFile(null);
            } else {
                showToast.error(data.error || "Update Failed");
            }
        } catch (error) {
            showToast.error("Connection Error");
        } finally {
            setTimeout(() => {
                showToast.dismiss();
            }, 1000);
            setLoading(false);
        }
    };
    return (
        <div className="bg-[#0009] text-white min-h-screen">
            <Header />
            <div className="flex items-center justify-center p-4 md:p-10 relative overflow-hidden">

                <div className="w-full md:max-w-4xl md:mx-auto relative z-10">
                    <div className="flex items-center gap-4 mb-5 md:mb-10">
                        <Link
                            href={session?.user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                            className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-cyan-500/50 transition-all active:scale-95 group flex items-center justify-center"
                        >
                            <ArrowLeft className="w-6 h-6 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                        </Link>

                        <h1 className="text-2xl md:text-4xl font-[1000] italic tracking-tighter uppercase">
                            Account <span className="text-cyan-400">Settings</span>
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-[#0D1520]/80 border border-white/10 rounded-[40px] p-8 backdrop-blur-3xl text-center">
                                <div className="relative w-32 h-32 mx-auto mb-6">
                                    <div className="w-full h-full rounded-full border-2 border-cyan-500/50 p-1">
                                        <div className="w-full h-full rounded-full overflow-hidden relative bg-white/5">
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-full h-full p-6 text-gray-600" />
                                            )}
                                        </div>
                                    </div>
                                    <label className="absolute bottom-0 right-0 bg-cyan-500 p-2 rounded-full cursor-pointer hover:scale-110 transition-transform">
                                        <Camera className="w-4 h-4 text-black" />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                </div>
                                <h2 className="text-xl font-black italic uppercase tracking-tighter">{session?.user?.name}</h2>
                            </div>

                            <div className="bg-[#0D1520]/80 border border-white/10 rounded-[40px] p-6 backdrop-blur-3xl">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Wallet Balance</span>
                                    <Wallet className="w-4 h-4 text-cyan-400" />
                                </div>
                                <p className="text-3xl font-mono font-bold text-white">₹{session?.user?.wallet?.toLocaleString('en-IN')}</p>
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="bg-[#0D1520]/80 border border-white/10 rounded-[40px] px-4 p-8 md:p-10 backdrop-blur-3xl space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name Field */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 text-white outline-none focus:border-cyan-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Phone Field (Read Only as it's the unique identifier) */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                            <input
                                                type="text"
                                                disabled
                                                defaultValue={session?.user?.phone || 'Not Linked'}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 text-gray-500 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    {/* Email Field */}
                                    <div className="col-span-full space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                            <input
                                                type="email"
                                                disabled
                                                defaultValue={session?.user?.email || ''}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 text-gray-500 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-cyan-500 text-black font-black rounded-full shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase italic tracking-tighter"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Changes</>}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}