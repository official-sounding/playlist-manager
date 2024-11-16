import { useAppDispatch, useAppSelector, useViewToggle } from '../../store';
import styles from './playlistFooter.module.css';
import { selectPlaylist } from '../../store/slices/playlist';
import { usePlaylists } from '../../queries/usePlaylists';
import { useCreatePlaylist } from '../../mutations/useCreatePlaylist';

export function PlaylistFooter() {
    const allPlaylists = usePlaylists();
    const { mutate: createPlaylist } = useCreatePlaylist();

    const { selectedPlaylistId, draftPlaylistVideoIds, draftDirty } = useAppSelector((state) => state.playlist);
    const [view, toggleView] = useViewToggle();

    const dispatch = useAppDispatch();

    const playlistId = selectedPlaylistId ?? -1;

    const addPlaylist = () => {
        const title = prompt('Enter the playlist title');
        if (title) {
            createPlaylist({ title });
        }
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <div>
                    <select
                        disabled={draftDirty}
                        value={playlistId}
                        className={styles.playlistSelect}
                        onChange={(e) =>
                            dispatch(selectPlaylist(allPlaylists.find((p) => p.id === Number(e.target.value))!))
                        }>
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
                        {draftPlaylistVideoIds.length} videos&nbsp;
                        {!draftDirty && draftPlaylistVideoIds.length > 0 && (
                            <a href={`/api/playlist/${selectedPlaylistId}/playlist.m3u8`}>Download m3u8 file</a>
                        )}
                        {draftDirty && 'Unsaved Changes'}
                    </div>
                )}
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
