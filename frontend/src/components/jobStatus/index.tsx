import { formatDistanceToNow } from 'date-fns';
import { useAppDispatch, useAppSelector } from '../../store';
import { getVideoStatus } from '../../store/slices/video';
import { useCallback } from 'react';

export function JobStatus({ jobId }: { jobId: string }) {
    const dispatch = useAppDispatch();
    const { job } = useAppSelector((state) => state.video.downloadRequests[jobId] ?? {});
    const reload = useCallback(() => dispatch(getVideoStatus(jobId)), [dispatch, jobId]);

    if(!job) {
        return <></>
    }

    const formattedQueue = formatDistanceToNow(job.queueTime);
    return (
        <>
            <dl>
                <dt>Id:</dt>
                <dd>{job.id}</dd>
                <dt>Status:</dt>
                <dd>{job.status}</dd>
                <dt>Queue Date:</dt>
                <dd title={job.queueTime}>{formattedQueue}</dd>
            </dl>
            <button onClick={reload}>Reload</button>
        </>
    );
}
