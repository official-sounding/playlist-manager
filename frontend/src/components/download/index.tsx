import { FormEvent, useState } from 'react';
import { JobStatus } from '../jobStatus';

import classes from './styles.module.css';
import { errorMsg, isSafeError } from '../../api/apiError';
import { useAppDispatch } from '../../store';
import { getVideoStatus, downloadVideo } from '../../store/slices/video';

export function Download() {
    const dispatch = useAppDispatch();
    const [jobId, setJobId] = useState<string | undefined>(undefined);
    const [url, setUrl] = useState<string>('');
    const [err, setErr] = useState<string>('');

    async function submit(e: FormEvent) {
        e.preventDefault();
        
        const job = await dispatch(downloadVideo(url)).unwrap();
        if(isSafeError(job)) {
            setErr(errorMsg(job));
        } else {
            dispatch(getVideoStatus(job.jobId));
            setJobId(job.jobId);
        }
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
