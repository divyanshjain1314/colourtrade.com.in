"use client";
import { useEffect, useRef, useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            audioRef.current = new Audio('/audio/casino_theme.mp3');
            audioRef.current.loop = true;

            const autoPlayOnInteraction = () => {
                if (audioRef.current && audioRef.current.paused) {
                    audioRef.current.play().catch(() => { });
                    window.removeEventListener('click', autoPlayOnInteraction);
                }
            };

            window.addEventListener('click', autoPlayOnInteraction);

            const handleVisibilityChange = () => {
                if (document.hidden) {
                    audioRef.current?.pause();
                } else {
                    if (!isMuted && !loading) audioRef.current?.play().catch(() => { });
                }
            };

            document.addEventListener("visibilitychange", handleVisibilityChange);

            return () => {
                window.removeEventListener('click', autoPlayOnInteraction);
                document.removeEventListener("visibilitychange", handleVisibilityChange);
                audioRef.current?.pause();
                audioRef.current = null;
            };
        }
    }, [loading, isMuted]);

    const startApp = () => {
        setLoading(false);
        if (audioRef.current) {
            audioRef.current.play().catch(() => console.log("Still blocked by browser"));
        }
    };

    return (
        <>
            {loading ? (
                <div className="fixed inset-0 z-9999 bg-[#050A10] flex flex-col items-center justify-center">
                    <div className="relative w-24 h-24 mb-8">
                        <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-t-cyan-500 rounded-full animate-spin shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
                    </div>

                    <h1 className="text-2xl font-black italic tracking-widest text-white mb-2 animate-pulse">
                        COLOUR<span className="text-cyan-400">TRADE</span>
                    </h1>
                    <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em] mb-10">Initializing Audio Engine...</p>

                    <button
                        onClick={startApp}
                        className="px-10 py-3 bg-cyan-500 text-black font-extrabold rounded-full hover:bg-cyan-400 transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)] active:scale-95 uppercase tracking-tighter"
                    >
                        Start Game
                    </button>
                </div>
            ) : (
                <div className="animate-in fade-in zoom-in-95 duration-700 custom-bg">
                    {children}
                </div>
            )}
        </>
    );
}