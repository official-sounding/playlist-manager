import { jobFromId } from "../../api/video";
import { formatDistanceToNow } from 'date-fns';
import { useResettableWrapper } from "../../api/wrapAsync";

export function JobStatus({ jobId } : { jobId: string }) {
    const { read, reset } = useResettableWrapper(jobFromId);
    const { job } = read(jobId);

    const formattedQueue = formatDistanceToNow(job.queueTime);
    return <>
        <dl>
            <dt>Id:</dt>
            <dd>{job.id}</dd>
            <dt>Status:</dt>
            <dd>{job.status}</dd>
            <dt>Queue Date:</dt>
            <dd title={job.queueTime}>{formattedQueue}</dd>
        </dl>
        <button onClick={reset}>Reload</button>
    </>
}