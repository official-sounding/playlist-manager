import { Suspense } from 'react';
import { videoGet } from '../../api/video';
import { Download } from '../download';

import classes from './styles.module.css';
import { useConfigValues } from '../../providers/config';

export function VideoList() {
    const { showThumbnails } = useConfigValues();
    const videos = videoGet.read();

    return (
        <>
            <Suspense>
                <Download></Download>
            </Suspense>
            <div>{videos.length} Videos</div>
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
                                { showThumbnails && <img src={v.thumbnailUrl} /> }
                            </td>
                            <td className={classes.videoDetails}>
                                <div><a href={v.videoUrl} target='_blank'>
                                    {v.title}
                                </a></div>
                                
                                <div className={classes.secondary}> {v.duration} seconds</div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
