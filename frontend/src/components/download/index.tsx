import { FormEvent, useState } from 'react';
import { videoDownload } from '../../api/video';
import { JobStatus } from '../jobStatus';

import classes from './styles.module.css';
import { errorMsg, isSafeError } from '../../api/apiError';
import { useAppDispatch } from '../../store';
import { getVideoStatus } from '../../store/slices/video';

export function Download() {
    const dispatch = useAppDispatch();
    const [jobId, setJobId] = useState<string | undefined>(undefined);
    const [run, setRun] = useState<boolean>(false);
    const [url, setUrl] = useState<string>('');
    const [err, setErr] = useState<string>('');

    const { read, reset } = videoDownload;

    if (run && url) {
        const job = read(url);
        if(isSafeError(job)) {
            setErr(errorMsg(job));
        }
        if (!isSafeError(job) && job.jobId !== jobId) {
            setJobId(job.jobId);
            dispatch(getVideoStatus(job.jobId));
        }
        setRun(false);
    }

    function submit(e: FormEvent) {
        e.preventDefault();
        reset();
        setErr('');
        setRun(true);
    }

    return (
        <div className={classes.wrapper}>
            <form onSubmit={submit}>
                <input className={classes.searchbox} type='text' value={url} onChange={(e) => setUrl(e.target.value)} />
                <button className={classes.download} type='submit'>Download</button>
            </form>
            { err && <div>{err}</div>}
            {jobId && (<JobStatus jobId={jobId} />)}
        </div>
    );
}
