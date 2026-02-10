import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

export const useWallet = () => {
    const { data, mutate } = useSWR('/api/user/balance', fetcher, {
        refreshInterval: 0,
        revalidateOnFocus: true,
    });

    return {
        balance: data?.balance || 0,
        updateBalance: () => mutate(),
    };
};