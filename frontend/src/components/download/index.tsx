import { FormEvent, useState } from 'react';
import { JobStatus } from '../jobStatus';

import classes from './styles.module.css';
import { errorMsg, isSafeError } from '../../api/apiError';
import { serialize } from '../../utils/serialize';
import { videoDownload } from '../../api/video';

export function Download() {
    const [jobId, setJobId] = useState<string | undefined>(undefined);
    const [err, setErr] = useState<string>('');

    async function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form: HTMLFormElement = e.currentTarget;
        const { url, tagStr } = serialize(form);

        if (!url) {
            setErr('URL must be populated');
            return;
        }

        const tags: string[] = tagStr ? tagStr.split(',') : [];

        const job = await videoDownload({ url, tags });
        if (isSafeError(job)) {
            setErr(errorMsg(job));
        } else {
            setJobId(job.jobId);
            form.reset();
        }
    }

    return (
        <div className={classes.wrapper}>
            <form onSubmit={submit}>
                <div>
                    <input className={classes.searchbox} type='text' name='url' placeholder='Enter YT URL' required />
                    <button className={classes.download} type='submit'>
                        Download
                    </button>
                </div>
                <input
                    className={classes.searchbox}
                    type='text'
                    name='tagStr'
                    placeholder='enter tags for video, comma separated'
                />
            </form>
            {err && <div>{err}</div>}
            {jobId && <JobStatus jobId={jobId} />}
        </div>
    );
}
