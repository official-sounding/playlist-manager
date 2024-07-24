import { Suspense } from 'react';
import { Download } from '../download';

import classes from './styles.module.css';
import { TagList } from './tagList';
import { useAppSelector } from '../../store';

export function VideoList() {
    const { showThumbnails } = useAppSelector((state) => state.config);
    const videos = useAppSelector((state) => state.video.allVideos);

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
                        <th>Title</th>
                        <th>Details</th>
                        <th>Tags</th>
                    </tr>
                </thead>
                <tbody>
                    {videos.map((v) => (
                        <tr key={v.id}>
                            <td>
                                { showThumbnails && <img src={v.thumbnailUrl} className={classes.thumbnail} /> }
                            </td>
                            <td className={classes.videoDetails}>
                                <a href={v.videoUrl} target='_blank'>{v.title}</a>
                            </td>
                            <td className={classes.secondary}>{v.duration} seconds</td>
                            <td className={classes.secondary}>
                                <TagList video={v} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
