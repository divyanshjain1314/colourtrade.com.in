"use client";
import { useState } from "react";
import { showToast } from "@/lib/toast";
import { Loader2, Banknote, ArrowRight } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";

export default function WithdrawForm({ onClose }: { onClose: any }) {
    const { balance, updateBalance } = useWallet();
    const [amount, setAmount] = useState<string>("");
    const [upiId, setUpiId] = useState("");
    const [loading, setLoading] = useState(false);

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        const withdrawAmount = Number(amount);

        if (withdrawAmount < 10000) {
            showToast.error("Minimum withdrawal is ₹10,000");
            setTimeout(() => {
                showToast.dismiss()
            }, 2000);
            return;
        }
        if (withdrawAmount > balance) {
            showToast.error("Insufficient balance!");
            setTimeout(() => {
                showToast.dismiss()
            }, 2000);
            return;
        }
        if (!upiId.includes("@")) {
            showToast.error("Invalid UPI ID format");
            setTimeout(() => {
                showToast.dismiss()
            }, 2000);
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/user/withdraw", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: withdrawAmount, upiId }),
            });

            const data = await res.json();

            if (data.success) {
                showToast.success("Request Sent! Admin will approve shortly.");
                setAmount("");
                setUpiId("");
                updateBalance();
            } else {
                showToast.error(data.error || "Failed to withdraw");
            }
        } catch (error) {
            showToast.error("Something went wrong");
        } finally {
            setLoading(false);
            onClose()
            setTimeout(() => {
                showToast.dismiss()
            }, 2000);
        }
    };

    return (
        <div className="bg-[#1a212c] p-6 rounded-2xl border border-white/5 shadow-xl max-w-md w-full mx-auto animate-in slide-in-from-bottom duration-500">

            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-500/10 rounded-full text-red-500">
                    <Banknote className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-wide">Withdraw Money</h2>
                    <p className="text-xs text-gray-400">Secure Transfer to Bank</p>
                </div>
            </div>

            <div className="mb-6 bg-black/20 p-4 rounded-xl border border-white/5 text-center">
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Available Balance</p>
                <p className="text-3xl font-black text-white font-mono">₹{balance}</p>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4">
                {/* Amount Input */}
                <div>
                    <label className="text-[10px] text-gray-400 uppercase font-bold pl-1 block mb-1">
                        Amount (Min ₹10,000)
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="10000"
                            className="w-full bg-[#0D121A] border border-white/10 rounded-xl py-3.5 pl-8 pr-4 text-white font-bold focus:border-red-500 focus:outline-none transition-colors placeholder:text-gray-600"
                            required
                        />
                    </div>
                </div>

                {/* UPI ID Input */}
                <div>
                    <label className="text-[10px] text-gray-400 uppercase font-bold pl-1 block mb-1">
                        UPI ID (GPay/PhonePe)
                    </label>
                    <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@okhdfcbank"
                        className="w-full bg-[#0D121A] border border-white/10 rounded-xl py-3.5 px-4 text-white font-medium focus:border-red-500 focus:outline-none transition-colors placeholder:text-gray-600"
                        required
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black rounded-xl uppercase text-xs tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Processing
                        </>
                    ) : (
                        <>
                            Send Request <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>

            <p className="mt-4 text-[10px] text-center text-gray-500">
                Withdrawal requests are processed within 24 hours.
            </p>
        </div>
    );
}