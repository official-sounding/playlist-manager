import { formatDistanceToNow } from 'date-fns';
import { useVideoDownloadStatus } from '../../queries/useVideoDownloadStatus';

export function JobStatus({ jobId }: { jobId: string }) {
    const {
        data: { job },
        refetch,
    } = useVideoDownloadStatus(jobId);

    if (!job) {
        return <></>;
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
            <button onClick={() => refetch()}>Reload</button>
        </>
    );
}
