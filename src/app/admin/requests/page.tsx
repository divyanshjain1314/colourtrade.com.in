"use client";
import { useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';
import { Check, X, User, IndianRupee, Hash, ArrowLeft, Loader2, ArrowUpCircle, ArrowDownCircle, Copy } from 'lucide-react';
import Header from '@/components/common/Header';
import Link from 'next/link';
import { showToast } from '@/lib/toast';
import Pusher from 'pusher-js';

export default function RequestManagementPage() {
    // --- STATE ---
    const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [verifiedAmounts, setVerifiedAmounts] = useState<{ [key: string]: number }>({});

    const { data: depositRequests } = useSWR('/api/admin/deposit/pending', fetcher, { refreshInterval: 0 });
    const { data: withdrawalData } = useSWR('/api/admin/withdrawals', fetcher, { refreshInterval: 0 });
    const pendingWithdrawals = withdrawalData?.withdrawals?.filter((req: any) => req.status === 'pending') || [];

    useEffect(() => {
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, { cluster: 'ap2' });
        const channel = pusher.subscribe("admin-channel");

        channel.bind("new-log", (data: any) => {
            if (data.type === 'success') {
                mutate('/api/admin/deposit/pending');
                mutate('/api/admin/withdrawals');
            }
        });

        return () => {
            pusher.unsubscribe("admin-channel");
        };
    }, []);

    const handleDepositApprove = async (depositId: string) => {
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ depositId, verifiedAmount: vAmount })
            });
            const data = await res.json();
            if (res.ok) {
                showToast.success(data.message);
                mutate('/api/admin/deposit/pending');
            } else {
                showToast.error(data.error);
            }
        } catch (error) { showToast.error("Approval failed"); }
        finally {
            setProcessingId(null);
            setTimeout(() => {
                showToast.dismiss()
            }, 2000);
        }
    };

    const handleDepositReject = async (depositId: string) => {
        const reason = prompt("Enter rejection reason (Optional):") || "Invalid UTR";
        setProcessingId(depositId);
        try {
            const res = await fetch('/api/admin/deposit/reject', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ depositId, reason })
            });
            if (res.ok) {
                showToast.success("Request Rejected");
                mutate('/api/admin/deposit/pending');
            }
        } catch (error) { showToast.error("Rejection failed"); }
        finally {
            setProcessingId(null);
            setTimeout(() => {
                showToast.dismiss()
            }, 2000);
        }
    };

    const handleWithdrawAction = async (id: string, action: 'approve' | 'reject') => {
        if (!confirm(`Are you sure you want to ${action} this request?`)) return;
        setProcessingId(id);
        try {
            const res = await fetch('/api/admin/withdrawals', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action })
            });
            const result = await res.json();
            if (result.success) {
                showToast.success(`Withdrawal ${action}ed!`);
                mutate('/api/admin/withdrawals');
            } else {
                showToast.error(result.error);
            }
        } catch (e) { showToast.error("Action failed"); }
        finally {
            setProcessingId(null);
            setTimeout(() => {
                showToast.dismiss()
            }, 2000);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast.success("Copied!");

        setTimeout(() => {
            showToast.dismiss()
        }, 2000);
    };

    return (
        <div className="text-white min-h-screen pb-20 font-sans">
            <Header />

            <div className="max-w-6xl mx-auto px-4 pt-8">
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                    <div>
                        <Link href="/admin/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-cyan-400 mb-2 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase italic tracking-widest">Dashboard</span>
                        </Link>
                        <h1 className="text-2xl md:text-4xl font-[1000] italic tracking-tighter uppercase leading-none">
                            Manage <span className="text-cyan-500">Requests</span>
                        </h1>
                    </div>
                </div>

                {/* --- TABS --- */}
                <div className="flex gap-6 mb-8 border-b border-white/10 pb-1">
                    <button
                        onClick={() => setActiveTab('deposit')}
                        className={`pb-3 px-2 text-sm font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'deposit'
                            ? 'text-cyan-400 border-b-2 border-cyan-400'
                            : 'text-gray-500 hover:text-white'
                            }`}
                    >
                        <ArrowDownCircle className="w-4 h-4" /> Deposits
                        <span className="bg-white/10 text-white px-2 py-0.5 rounded-full text-[10px]">{depositRequests?.length || 0}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('withdraw')}
                        className={`pb-3 px-2 text-sm font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'withdraw'
                            ? 'text-red-500 border-b-2 border-red-500'
                            : 'text-gray-500 hover:text-white'
                            }`}
                    >
                        <ArrowUpCircle className="w-4 h-4" /> Withdrawals
                        <span className="bg-white/10 text-white px-2 py-0.5 rounded-full text-[10px]">{pendingWithdrawals.length || 0}</span>
                    </button>
                </div>

                {/* --- CONTENT AREA --- */}

                {/* 1. DEPOSIT REQUESTS */}
                {activeTab === 'deposit' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {(!depositRequests || depositRequests.length === 0) ? (
                            <div className="p-12 text-center bg-[#0D121A] rounded-2xl border border-white/5">
                                <p className="text-gray-500 font-bold italic uppercase tracking-widest">No pending deposits</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {depositRequests.map((req: any) => (
                                    <div key={req._id} className="bg-[#0D1520] border border-white/5 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row gap-6 md:items-center justify-between shadow-lg">

                                        {/* User Info */}
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden shrink-0 bg-[#1a212c]">
                                                {req.userId?.image ? <img src={req.userId.image} className="w-full h-full object-cover" /> : <User className="w-full h-full p-3 text-white/10" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-[900] uppercase italic text-white tracking-wide">{req.userId?.name}</p>
                                                <div
                                                    onClick={() => copyToClipboard(req.utr)}
                                                    className="flex items-center gap-2 text-cyan-400/80 text-xs mt-1 cursor-pointer hover:text-cyan-300 transition-colors"
                                                >
                                                    <Hash className="w-3 h-3" />
                                                    <span className="font-bold tracking-widest uppercase">{req.utr}</span>
                                                    <Copy className="w-3 h-3 ml-1 opacity-50" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions & Verification */}
                                        <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">

                                            <div className="text-center md:text-right mr-2">
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Claimed</p>
                                                <p className="text-xl font-black text-white">₹{req.amount}</p>
                                            </div>

                                            <div className="w-full md:w-40 relative">
                                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-cyan-500" />
                                                <input
                                                    type="number"
                                                    placeholder="Verify"
                                                    onChange={(e) => setVerifiedAmounts({ ...verifiedAmounts, [req._id]: Number(e.target.value) })}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-8 pr-3 text-sm font-bold text-white focus:border-cyan-500 outline-none transition-all focus:bg-black/60"
                                                />
                                            </div>

                                            <div className="flex gap-2 w-full md:w-auto">
                                                <button
                                                    onClick={() => handleDepositApprove(req._id)}
                                                    disabled={processingId === req._id}
                                                    className="flex-1 md:w-12 h-12 py-3 md:py-0 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl flex items-center justify-center hover:bg-green-500 hover:text-black transition-all active:scale-95"
                                                    title="Approve"
                                                >
                                                    {processingId === req._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                                </button>
                                                <button
                                                    onClick={() => handleDepositReject(req._id)}
                                                    disabled={processingId === req._id}
                                                    className="flex-1 md:w-12 h-12 py-3 md:py-0 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all active:scale-95"
                                                    title="Reject"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* 2. WITHDRAW REQUESTS */}
                {activeTab === 'withdraw' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {(!pendingWithdrawals || pendingWithdrawals.length === 0) ? (
                            <div className="p-12 text-center bg-[#0D121A] rounded-2xl border border-white/5">
                                <p className="text-gray-500 font-bold italic uppercase tracking-widest">No pending withdrawals</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {pendingWithdrawals.map((req: any) => (
                                    <div key={req._id} className="bg-[#0D1520] border border-white/5 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row gap-6 md:items-center justify-between shadow-lg">

                                        {/* User Info */}
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden shrink-0 bg-[#1a212c]">
                                                {req.userId?.image ? <img src={req.userId.image} className="w-full h-full object-cover" /> : <User className="w-full h-full p-3 text-white/10" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-[900] uppercase italic text-white tracking-wide">{req.userId?.name}</p>
                                                <div
                                                    onClick={() => copyToClipboard(req.upiId)}
                                                    className="flex items-center gap-2 text-yellow-500/80 text-xs mt-1 cursor-pointer hover:text-yellow-400 transition-colors"
                                                >
                                                    <span className="font-mono font-bold tracking-wide">{req.upiId}</span>
                                                    <Copy className="w-3 h-3" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">

                                            <div className="text-center md:text-right mr-2">
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Request Amount</p>
                                                <p className="text-xl font-black text-red-400 font-mono">₹{req.amount}</p>
                                            </div>

                                            {/* Matches Deposit Action Layout */}
                                            <div className="flex gap-2 w-full md:w-auto">
                                                <button
                                                    onClick={() => handleWithdrawAction(req._id, 'approve')}
                                                    disabled={processingId === req._id}
                                                    className="flex-1 md:w-12 h-12 py-3 md:py-0 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl flex items-center justify-center hover:bg-green-500 hover:text-black transition-all active:scale-95"
                                                    title="Mark as Paid"
                                                >
                                                    {processingId === req._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                                </button>
                                                <button
                                                    onClick={() => handleWithdrawAction(req._id, 'reject')}
                                                    disabled={processingId === req._id}
                                                    className="flex-1 md:w-12 h-12 py-3 md:py-0 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all active:scale-95"
                                                    title="Reject & Refund"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}