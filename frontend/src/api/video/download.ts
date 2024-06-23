import { QueueResult } from '../../model/queue';
import { SafeError } from '../apiError';
import { wrapAsync } from '../wrapAsync';

export const videoDownload = wrapAsync(async (url: string): Promise<QueueResult | SafeError> => {
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
});
