import { Suspense } from 'react';
import { videoGet } from '../../api/video';
import { Download } from '../download';

import classes from './styles.module.css';
import { useAppSelector } from '../../store';

export function VideoList() {
    const { showThumbnails } = useAppSelector((state) => state.config);
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
                            <td>
                                { showThumbnails && <img src={v.thumbnailUrl} className={classes.thumbnail} /> }
                            </td>
                            <td className={classes.videoDetails}>
                                <a href={v.videoUrl} target='_blank'>{v.title}</a>
                            </td>
                            <td className={classes.secondary}>{v.duration} seconds</td>
                            <td className={classes.secondary}>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
