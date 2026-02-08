"use client";
import { useState, useEffect } from 'react';

export default function Timer() {
    const [timeLeft, setTimeLeft] = useState(60);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev <= 1 ? 60 : prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-gray-800 p-4 rounded-lg text-center">
            <h2 className="text-xl font-bold">Next Period</h2>
            <div className="text-4xl font-mono text-yellow-400">
                00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </div>
        </div>
    );
}