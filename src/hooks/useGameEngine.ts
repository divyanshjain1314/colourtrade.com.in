import { useState, useEffect } from 'react';

export const useGameEngine = () => {
    const [timeLeft, setTimeLeft] = useState(300);
    const [periodId, setPeriodId] = useState("");
    const [status, setStatus] = useState<'waiting' | 'locked'>('waiting');

    useEffect(() => {
        const syncGame = () => {
            const now = new Date();
            const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
            const totalMinutesToday = now.getHours() * 60 + now.getMinutes();
            const currentPeriodNum = Math.floor(totalMinutesToday / 5) + 1;
            const newPeriodId = `${dateStr}${String(currentPeriodNum).padStart(4, '0')}`;
            
            setPeriodId(newPeriodId);

            const secondsPassedInThisSlot = (totalMinutesToday % 5) * 60 + now.getSeconds();
            const remaining = 300 - secondsPassedInThisSlot;
            
            setTimeLeft(remaining);

            if (remaining <= 30) {
                setStatus('locked');
            } else {
                setStatus('waiting');
            }
        };

        syncGame();
        const interval = setInterval(syncGame, 1000);

        return () => clearInterval(interval);
    }, []);

    return { timeLeft, periodId, status };
};