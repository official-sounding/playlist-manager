import { Download } from '../download';

import classes from './styles.module.css';
import { TagList } from './tagList';
import { useAppDispatch, useAppSelector } from '../../store';
import { useMemo, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { Video } from '../../model/video';
import { addVideoToDraft, removeVideoFromDraft } from '../../store/slices/playlist';
import { TagEditor } from './tagEditor';
import { useVideos } from '../../queries/useVideos';
import { useUpdatePlaylist } from '../../mutations/useUpdatePlaylist';

type EnrichedVideo = Video & { inPlaylist: boolean };

function enrich(draftPlaylistVideoIds: number[]): (v: Video) => EnrichedVideo {
    return (v) => ({ ...v, inPlaylist: draftPlaylistVideoIds.includes(v.id) });
}

export function VideoList() {
    const dispatch = useAppDispatch();
    const [showThumbnails, setShowThumbnails] = useLocalStorage('show-thumbnails', true);
    const allVideos = useVideos();
    const { selectedPlaylistId, draftPlaylistVideoIds } = useAppSelector((state) => state.playlist);
    const [search, setSearch] = useState<string>('');
    const { debouncedUpdatePlaylist } = useUpdatePlaylist();

    const videos = useMemo(() => {
        const searchValue = search.trim();
        if (!searchValue) {
            return allVideos.map(enrich(draftPlaylistVideoIds));
        }

        const searchRegex = new RegExp(searchValue, 'i');

        return allVideos
            .filter(
                (v) =>
                    v.filename.search(searchRegex) >= 0 ||
                    v.title.search(searchRegex) >= 0 ||
                    v.tags.some((t) => t.title.search(searchRegex) >= 0)
            )
            .map(enrich(draftPlaylistVideoIds));
    }, [search, allVideos, draftPlaylistVideoIds]);

    const addVideo = (v: Video) => {
        dispatch(addVideoToDraft({ videoId: v.id }));
        debouncedUpdatePlaylist();
    };

    const removeVideo = (v: Video) => {
        dispatch(removeVideoFromDraft(v.id));
        debouncedUpdatePlaylist();
    };

    return (
        <div>
            <Download />
            <hr />
            <div className={classes.searchbar}></div>
            <div>
                <label>
                    <input
                        type='checkbox'
                        checked={showThumbnails}
                        onChange={(e) => setShowThumbnails(e.target.checked)}
                    />
                    Show Thumbnails
                </label>
            </div>

            <table className={classes.videoList}>
                <thead>
                    <tr>
                        <th colSpan={showThumbnails ? 2 : 1}>
                            <input
                                value={search}
                                placeholder='Type here to search'
                                onChange={(e) => setSearch(e.target.value)}
                                className={classes.searchbox}
                            />
                        </th>
                        <th>
                            <div className={classes.videocount}>{search.length > 0 && `${videos.length} Videos`}</div>
                        </th>
                    </tr>
                    <tr className={classes.bottomHeader}>
                        {showThumbnails && <th className={classes.thumbnail}>Thumbnail</th>}
                        <th>Title ({allVideos.length} total videos)</th>
                        <th>Tags</th>
                    </tr>
                </thead>
                <tbody>
                    {videos.map((v) => (
                        <tr key={v.id}>
                            {showThumbnails && (
                                <td>
                                    <img src={v.thumbnailUrl} className={classes.thumbnail} loading='lazy' />
                                </td>
                            )}
                            <td>
                                <div className={classes.videoDetails}>
                                    {selectedPlaylistId && (
                                        <div className={classes.playlistControls}>
                                            {!v.inPlaylist && (
                                                <button className={classes.addBtn} onClick={() => addVideo(v)}>
                                                    +
                                                </button>
                                            )}
                                            {v.inPlaylist && (
                                                <button className={classes.removeBtn} onClick={() => removeVideo(v)}>
                                                    &times;
                                                </button>
                                            )}
                                        </div>
                                    )}
                                    <div>
                                        <a href={v.videoUrl} target='_blank'>
                                            {v.title}
                                        </a>{' '}
                                        <span className={classes.secondary}>({v.prettyDuration})</span>
                                        <TagList video={v} />
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className={classes.actions}>
                                    <TagEditor video={v} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
