import { useAppDispatch, useAppSelector } from '../../store';
import styles from './playlistFooter.module.css';
import { createPlaylist, selectPlaylist, updatePlaylist } from '../../store/slices/playlist';
import { updateView, View } from '../../store/slices/config';

export function PlaylistFooter() {
    const { allPlaylists, selectedPlaylistId, draftPlaylistVideoIds, draftDirty } = useAppSelector(
        (state) => state.playlist
    );

    const view = useAppSelector((state) => state.config.view);
    const dispatch = useAppDispatch();

    const playlistId = selectedPlaylistId ?? -1;

    const addPlaylist = () => {
        const title = prompt('Enter the playlist title');
        if (title) {
            dispatch(createPlaylist({ title }));
        }
    };

    const syncPlaylist = () => {
        dispatch(updatePlaylist());
    };

    const toggleView = () => {
        const newView: View = view === 'playlist' ? 'video' : 'playlist';
        dispatch(updateView(newView));
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <div>
                    <select value={playlistId} onChange={(e) => dispatch(selectPlaylist(Number(e.target.value)))}>
                        <option value={-1} disabled>
                            Select a Playlist
                        </option>
                        {allPlaylists.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.title}
                            </option>
                        ))}
                    </select>
                    <button onClick={addPlaylist}>Add New</button>
                </div>
                {selectedPlaylistId && (
                    <div>
                        {draftPlaylistVideoIds.length} videos
                        {!draftDirty && draftPlaylistVideoIds.length > 0 && (
                            <a href={`/api/playlist/${selectedPlaylistId}/playlist.m3u8`}>Download m3u8 file</a>
                        )}
                    </div>
                )}
                {draftDirty && <button onClick={syncPlaylist}>Sync Entries</button>}
                <div>
                    {selectedPlaylistId && (
                        <button onClick={toggleView}>
                            {view === 'video' ? 'Open Playlist Editor' : 'Return to Video List'}
                        </button>
                    )}
                </div>
            </div>
        </footer>
    );
}
