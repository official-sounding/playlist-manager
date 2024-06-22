import { FormEvent, Suspense, useState } from 'react';
import { videoDownload } from '../../api/video';
import { JobStatus } from '../jobStatus';

import classes from './styles.module.css';

export function Download() {
    const [jobId, setJobId] = useState<string | undefined>(undefined);
    const [run, setRun] = useState<boolean>(false);
    const [url, setUrl] = useState<string>('');

    const { read, reset } = videoDownload;

    if (run && url) {
        const job = read(url);
        if (job.jobId !== jobId) {
            setJobId(job.jobId);
        }
        setRun(false);
    }

    function submit(e: FormEvent) {
        e.preventDefault();
        reset();
        setRun(true);
    }

    return (
        <div className={classes.wrapper}>
            <form onSubmit={submit}>
                <input className={classes.searchbox} type='text' value={url} onChange={(e) => setUrl(e.target.value)} />
                <button className={classes.download} type='submit'>Download</button>
            </form>
            {jobId && (
                <Suspense>
                    <JobStatus jobId={jobId} />
                </Suspense>
            )}
        </div>
    );
}
