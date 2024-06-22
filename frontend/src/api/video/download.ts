import { QueueResult } from '../../model/queue';
import { wrapAsync } from '../wrapAsync';

export const videoDownload = wrapAsync(async (url: string) => {
    const req = { url };
    const res = await fetch('/api/video/download', {
        method: 'POST',
        body: JSON.stringify(req),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const result = (await res.json()) as unknown as QueueResult;
    return result;
});
