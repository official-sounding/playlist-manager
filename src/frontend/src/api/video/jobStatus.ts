import { QueueDetails } from "../../model/queue";
import { wrapAsync } from "../wrapAsync";

const getJob = async (url: string) => {
    const res = await fetch(url);
    const result = await res.json() as unknown as QueueDetails;
    return result;
};

export const jobFromUri = wrapAsync(getJob)
export const jobFromId = wrapAsync(async (id: string) => await getJob(`/api/video/job/${id}`));


