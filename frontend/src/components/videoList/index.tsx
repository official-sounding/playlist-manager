import { Download } from '../download';

import classes from './styles.module.css';
import { TagList } from './tagList';
import { useAppDispatch, useAppSelector } from '../../store';
import { useMemo, useState } from 'react';
import { useDebounceCallback, useLocalStorage } from 'usehooks-ts';
import { Video } from '../../model/video';
import { addVideoToDraft, removeVideoFromDraft, updatePlaylist } from '../../store/slices/playlist';

type EnrichedVideo = Video & { inPlaylist: boolean };

function enrich(draftPlaylistVideoIds: number[]): (v: Video) => EnrichedVideo {
    return (v) => ({ ...v, inPlaylist: draftPlaylistVideoIds.includes(v.id)});
}

export function VideoList() {
    const dispatch = useAppDispatch();
    const [showThumbnails, setShowThumbnails] = useLocalStorage('show-thumbnails', true);
    const allVideos = useAppSelector((state) => state.video.allVideos);
    const { selectedPlaylistId, draftPlaylistVideoIds } = useAppSelector((state) => state.playlist);
    const [search, setSearch] = useState<string>('');

    const videos = useMemo(() => {
        const searchValue = search.trim();
        if(!searchValue) {
            return allVideos.map(enrich(draftPlaylistVideoIds));
        }

        const searchRegex = new RegExp(searchValue, 'i');

        return allVideos
            .filter(v => v.filename.search(searchRegex) >= 0 || v.title.search(searchRegex) >= 0 || v.tags.some(t => t.title.search(searchRegex) >= 0))
            .map(enrich(draftPlaylistVideoIds))
    }, [search, allVideos, draftPlaylistVideoIds]);

    const debouncedSync = useDebounceCallback(() => dispatch(updatePlaylist()), 5000, { maxWait: 30000 });

    const addVideo = (v: Video) => {
        dispatch(addVideoToDraft({ videoId: v.id }));
        debouncedSync();
    }

    const removeVideo = (v: Video) => {
        dispatch(removeVideoFromDraft(v.id));
        debouncedSync();
    }


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
                             <img src={v.thumbnailUrl} className={classes.thumbnail} loading="lazy" />
                            </td>}
                            <td className={classes.videoDetails}>
                                <a href={v.videoUrl} target='_blank'>{v.title}</a>
                            </td>
                            <td className={classes.secondary}>{v.prettyDuration}</td>
                            <td className={`${classes.secondary} ${classes.actions}`}>
                                <TagList video={v} />
                                {selectedPlaylistId && <div>
                                    {!v.inPlaylist && <button onClick={() => addVideo(v)}>Add to Playlist</button>}
                                    {v.inPlaylist && <button onClick={() => removeVideo(v)}>Remove from Playlist</button>}
                                </div> }
                                
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
