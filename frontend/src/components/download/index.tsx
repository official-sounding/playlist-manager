import { FormEvent, useState } from 'react';
import { JobStatus } from '../jobStatus';

import classes from './styles.module.css';
import { errorMsg, isSafeError } from '../../api/apiError';
import { useAppDispatch } from '../../store';
import { getVideoStatus, downloadVideo } from '../../store/slices/video';
import { serialize } from '../../utils/serialize';

export function Download() {
    const dispatch = useAppDispatch();
    const [jobId, setJobId] = useState<string | undefined>(undefined);
    const [err, setErr] = useState<string>('');

    async function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form: HTMLFormElement = e.currentTarget;
        const { url, tagStr } = serialize(form);
        
        if(!url) {
            setErr('URL must be populated')
            return;
        }

        const tags: string[] = tagStr ? tagStr.split(',') : [];

        const job = await dispatch(downloadVideo({ url, tags })).unwrap();
        if(isSafeError(job)) {
            setErr(errorMsg(job));
        } else {
            dispatch(getVideoStatus(job.jobId));
            setJobId(job.jobId);
            form.reset();
        }
    }

    return (
        <div className={classes.wrapper}>
            <form onSubmit={submit}>
                <div>
                <input className={classes.searchbox} type='text' name='url' placeholder='Enter YT URL' required />
                <button className={classes.download} type='submit'>Download</button>
                </div>
                <input className={classes.searchbox} type='text' name='tagStr' placeholder='enter tags for video, comma separated' />
            </form>
            { err && <div>{err}</div>}
            {jobId && (<JobStatus jobId={jobId} />)}
        </div>
    );
}
