"use client";
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { Check, X, User, IndianRupee, Hash, ArrowLeft, Loader2, Calendar } from 'lucide-react';
import Header from '@/components/common/Header';
import Link from 'next/link';
import { showToast } from '@/lib/toast';
import Pusher from 'pusher-js';

export default function RequestManagementPage() {
    const { data: requests, mutate } = useSWR('/api/admin/deposit/pending', fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshInterval: 0,
        shouldRetryOnError: false,
    });
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [verifiedAmounts, setVerifiedAmounts] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, { cluster: 'ap2' });
        const channel = pusher.subscribe("admin-channel");
        channel.bind("new-log", (data: any) => {
            if (data.type === 'success') {
                mutate();
            }
        });
        return () => {
            pusher.unsubscribe("admin-channel");
        };
    }, [mutate]);

    const handleApprove = async (depositId: string) => {
        const vAmount = verifiedAmounts[depositId];
        if (!vAmount || vAmount <= 0) {
            showToast.error("Enter valid verified amount");
            setTimeout(() => {
                showToast.dismiss()
            }, 2000);
            return;
        }

        setProcessingId(depositId);
        try {
            const res = await fetch('/api/admin/deposit/approve', {
                method: 'POST',
                body: JSON.stringify({ depositId, verifiedAmount: vAmount }),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            if (res.ok) {
                showToast.success(data.message);
                mutate();
            } else {
                showToast.error(data.error);
            }
        } catch (error) {
            showToast.error("Approval failed");
        } finally {
            setTimeout(() => {
                showToast.dismiss()
            }, 2000);
            setProcessingId(null);
        }
    };

    const handleReject = async (depositId: string) => {
        const reason = prompt("Enter rejection reason (Optional):") || "Invalid UTR or Payment mismatch";
        setProcessingId(depositId);
        try {
            const res = await fetch('/api/admin/deposit/reject', {
                method: 'POST',
                body: JSON.stringify({ depositId, reason }),
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) {
                showToast.success("Request Rejected");
                mutate();
            }
        } catch (error) {
            showToast.error("Rejection failed");
        } finally {
            setTimeout(() => {
                showToast.dismiss()
            }, 2000);
            setProcessingId(null);
        }
    };

    return (
        <div className="bg-[#050A10] text-white min-h-screen pb-20 font-sans">
            <Header />

            <div className="max-w-6xl mx-auto px-4 pt-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div>
                        <Link href="/admin/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-cyan-400 mb-4 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase italic tracking-widest">Dashboard</span>
                        </Link>
                        <h1 className="text-2xl md:text-4xl font-[1000] italic tracking-tighter uppercase leading-none">
                            Manage <span className="text-cyan-500">Requests</span>
                        </h1>
                    </div>
                    <div className="w-full md:w-auto bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex justify-between md:block">
                        <span className="text-gray-500 text-[10px] font-black uppercase italic tracking-widest block md:mb-1">Pending</span>
                        <span className="text-cyan-400 font-black text-xl md:text-2xl">{requests?.length || 0} Requests</span>
                    </div>
                </div>

                {/* --- MOBILE VIEW: Cards (Visible only on small screens) --- */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                    {!requests ? (
                        <div className="p-10 text-center animate-pulse text-gray-600 font-black italic uppercase">Loading...</div>
                    ) : requests.length === 0 ? (
                        <div className="p-10 text-center text-gray-600 font-black italic uppercase">No pending requests</div>
                    ) : (
                        requests.map((req: any) => (
                            <div key={req._id} className="bg-[#0D1520] border border-white/5 rounded-3xl p-5 space-y-4">
                                <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                                    <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden shrink-0">
                                        {req.userId?.image ? <img src={req.userId.image} className="w-full h-full object-cover" /> : <User className="w-full h-full p-3 text-white/10" />}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-[900] uppercase italic text-white truncate">{req.userId?.name}</p>
                                        <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Claimed: ₹{req.amount}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-gray-600 uppercase">UTR Number</span>
                                        <span className="text-xs font-mono font-bold text-gray-300">{req.utr}</span>
                                    </div>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-cyan-500" />
                                        <input
                                            type="number"
                                            placeholder="Verify Amount"
                                            onChange={(e) => setVerifiedAmounts({ ...verifiedAmounts, [req._id]: Number(e.target.value) })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-8 pr-3 text-sm font-bold text-white focus:border-cyan-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={() => handleApprove(req._id)}
                                        disabled={processingId === req._id}
                                        className="flex-1 bg-green-500 text-black py-3 rounded-xl font-black uppercase italic text-xs flex items-center justify-center gap-2"
                                    >
                                        {processingId === req._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(req._id)}
                                        className="px-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* --- DESKTOP VIEW: Table (Hidden on small screens) --- */}
                <div className="hidden md:block bg-[#0D1520] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="p-6 text-[10px] font-black uppercase italic tracking-widest text-gray-500">Player</th>
                                <th className="p-6 text-[10px] font-black uppercase italic tracking-widest text-gray-500">UTR / Details</th>
                                <th className="p-6 text-[10px] font-black uppercase italic tracking-widest text-gray-500 text-center">Verified Amount</th>
                                <th className="p-6 text-[10px] font-black uppercase italic tracking-widest text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {requests?.map((req: any) => (
                                <tr key={req._id} className="hover:bg-white/[0.01] transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden">
                                                {req.userId?.image ? <img src={req.userId.image} className="w-full h-full object-cover" /> : <User className="w-full h-full p-3 text-white/10" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-[900] uppercase italic text-white group-hover:text-cyan-400 transition-colors">{req.userId?.name}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Claimed: ₹{req.amount}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 font-mono">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-cyan-400/80 text-xs">
                                                <Hash className="w-3 h-3" />
                                                <span className="font-bold tracking-widest uppercase">{req.utr}</span>
                                            </div>
                                            <span className="text-[9px] text-gray-600 uppercase font-bold">{new Date(req.createdAt).toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="relative max-w-[140px] mx-auto">
                                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-cyan-500" />
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                onChange={(e) => setVerifiedAmounts({ ...verifiedAmounts, [req._id]: Number(e.target.value) })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-8 pr-3 text-sm font-bold text-white focus:outline-none focus:border-cyan-500 transition-all"
                                            />
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleApprove(req._id)} className="p-3 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl hover:bg-green-500 hover:text-black transition-all">
                                                {processingId === req._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                            </button>
                                            <button onClick={() => handleReject(req._id)} className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 transition-all">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}