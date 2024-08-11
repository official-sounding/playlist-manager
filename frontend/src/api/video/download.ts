import { QueueResult } from '../../model/queue';
import { SafeError } from '../apiError';

export const videoDownload = async (url: string): Promise<QueueResult | SafeError> => {
    const req = { url };
    const res = await fetch('/api/video/download', {
        method: 'POST',
        body: JSON.stringify(req),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if(res.status === 409) {
        return { err: 'conflict' };
    }

    const result = (await res.json()) as unknown as QueueResult;
    return result;
};
