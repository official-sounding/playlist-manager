export type QueueResult = {
    jobId: string;
    url: string;
}


export type JobStatus = 'queued' | 'running' | 'success' | 'error';

export type QueueItem = {
    id: string;
    status: JobStatus,
    queueTime: string;
    startTime?: string;
    endTime?: string;
}

export type QueueDetails = {
    job: QueueItem,
    details: string[]
}