import { QueueDetails } from '../../model/queue';

const getJob = async (url: string) => {
    const res = await fetch(url);
    const result = (await res.json()) as unknown as QueueDetails;
    return result;
};

export const jobFromUri = getJob;
export const jobFromId = (id: string) => getJob(`/api/video/job/${id}`);
