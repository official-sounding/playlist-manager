import { QueueResult } from '../../model/queue';
import { SafeError } from '../apiError';

type VideoDownloadRequest = { url: string, tags: string[] };

export const videoDownload = async (req: VideoDownloadRequest): Promise<QueueResult | SafeError> => {
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
