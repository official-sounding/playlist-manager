import { Suspense } from 'react';
import { videoGet } from '../../api/video';
import { Download } from '../download';

import classes from './videoList.module.css';

export function VideoList() {
    const videos = videoGet.read();

    return (
        <>
            <Suspense>
                <Download></Download>
            </Suspense>

            <table className={classes.videoList}>
                <thead>
                    <tr>
                        <th>Thumbnail</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {videos.map((v) => (
                        <tr>
                            <td className={classes.thumbnail}>
                                <img src={v.thumbnailUrl} />
                            </td>
                            <td className={classes.videoDetails}>
                                <a href={v.videoUrl} target='_blank'>
                                    {v.title}
                                </a>
                                <br />
                                {v.duration} seconds <br />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
