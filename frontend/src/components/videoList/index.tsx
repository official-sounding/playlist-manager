import { Download } from '../download';

import classes from './styles.module.css';
import { TagList } from './tagList';
import { useAppSelector } from '../../store';
import { useMemo, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

export function VideoList() {

    const [showThumbnails, setShowThumbnails] = useLocalStorage('show-thumbnails', true);
    const allVideos = useAppSelector((state) => state.video.allVideos);
    const [search, setSearch] = useState<string>('');

    const videos = useMemo(() => {
        const searchValue = search.trim();
        if(!searchValue) {
            return allVideos;
        }

        const searchRegex = new RegExp(searchValue, 'i');

        return allVideos.filter(v => v.filename.search(searchRegex) >= 0 || v.title.search(searchRegex) >= 0 || v.tags.some(t => t.title.search(searchRegex) >= 0))
    }, [search, allVideos]);

    return (
        <div>
            <Download />
            <hr />
            <div className={classes.searchbar}>
                
                
            </div>
            <div>
                <label>
                    <input type="checkbox" checked={showThumbnails} onChange={(e) => setShowThumbnails(e.target.checked)} />
                    Show Thumbnails
                </label>
            </div>
            
            
            <table className={classes.videoList}>
                <thead>
                    <tr>
                        <th colSpan={showThumbnails ? 2 : 1}>
                        <input value={search} placeholder='Type here to search' onChange={e => setSearch(e.target.value)} className={classes.searchbox} />
                        </th>
                        <th colSpan={2}>
                        <div className={classes.videocount}>{videos.length} Videos {search.length > 0 && `${allVideos.length} total`}</div>
                        </th>
                    </tr>
                    <tr className={classes.bottomHeader}>
                        { showThumbnails && <th className={classes.thumbnail}>Thumbnail</th> }
                        <th>Title</th>
                        <th className={classes.details}>Details</th>
                        <th>Tags</th>
                    </tr>
                </thead>
                <tbody>
                    {videos.map((v) => (
                        <tr key={v.id}>
                            { showThumbnails && <td>
                             <img src={v.thumbnailUrl} className={classes.thumbnail} />
                            </td>}
                            <td className={classes.videoDetails}>
                                <a href={v.videoUrl} target='_blank'>{v.title}</a>
                            </td>
                            <td className={classes.secondary}>{v.duration} sec</td>
                            <td className={classes.secondary}>
                                <TagList video={v} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
