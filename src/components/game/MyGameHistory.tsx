"use client";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Loader2, Trophy, XCircle } from "lucide-react";
import { useEffect } from "react";
import Pusher from "pusher-js";
import { useSession } from "next-auth/react";

interface HistoryProps {
    currentPeriodId: string;
    gameStatus: 'waiting' | 'locked';
}

export default function MyGameHistory({ currentPeriodId, gameStatus }: HistoryProps) {
    const { data: session } = useSession();
    const { data, mutate, isLoading } = useSWR('/api/game/my-bets', fetcher, {
        revalidateOnFocus: false,
    });

    useEffect(() => {
        if (session?.user?.id) {
            const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, { cluster: 'ap2' });

            const userChannel = pusher.subscribe(`user-${session.user.id}`);
            userChannel.bind('my-bets-updated', () => {
                mutate();
            });
            userChannel.bind('game-result', () => {
                mutate();
            });

            const publicChannel = pusher.subscribe('public-game-channel');
            publicChannel.bind('result-declared', () => {
                mutate();
            });

            return () => {
                pusher.unsubscribe(`user-${session.user.id}`);
                pusher.unsubscribe('public-game-channel');
            };
        }
    }, [session, mutate]);

    const bets = data?.bets || [];

    return (
        <div className="bg-[#0D121A] rounded-3xl border border-white/5 overflow-hidden w-full max-w-5xl mx-auto shadow-2xl">
            <div className="px-5 py-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">My Betting History</h3>
                <span className="text-[9px] text-gray-600 font-mono">Aggregated Bets</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-[9px] md:text-[10px] text-gray-500 uppercase font-black bg-white/5 whitespace-nowrap">
                            <th className="px-4 py-3">Period</th>
                            <th className="px-4 py-3">Select</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {isLoading ? (
                            <tr><td colSpan={4} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-cyan-500" /></td></tr>
                        ) : bets.map((bet: any) => {
                            let statusContent;

                            if (bet.status === 'pending') {
                                if (gameStatus === 'locked' && bet.periodId === currentPeriodId) {
                                    statusContent = (
                                        <span className="text-[10px] font-black text-orange-400 uppercase tracking-wider animate-pulse">WAIT</span>
                                    );
                                } else {
                                    statusContent = (
                                        <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-wider">PENDING</span>
                                    );
                                }
                            }
                            else if (bet.status === 'win') {
                                statusContent = (
                                    <div className="flex items-center justify-end gap-1 text-green-500">
                                        <Trophy className="w-3 h-3" />
                                        <span className="text-[10px] font-black uppercase tracking-wider">WIN +₹{bet.winAmount}</span>
                                    </div>
                                );
                            }
                            else {
                                statusContent = (
                                    <div className="flex items-center justify-end gap-1 text-red-500">
                                        <XCircle className="w-3 h-3" />
                                        <span className="text-[10px] font-black uppercase tracking-wider">LOSS -₹{bet.amount}</span>
                                    </div>
                                );
                            }

                            return (
                                <tr key={bet._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-3 text-[11px] font-mono text-gray-400">{bet.periodId}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-[9px] font-black uppercase px-2 py-1 rounded border ${bet.select === 'red' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                            bet.select === 'green' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                'bg-purple-500/10 text-purple-500 border-purple-500/20'}`}>
                                            {bet.select}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs font-bold text-white font-mono">₹{bet.amount}</td>
                                    <td className="px-4 py-3 text-right">{statusContent}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}