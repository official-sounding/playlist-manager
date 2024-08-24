import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import styles from './playlistFooter.module.css';
import { selectPlaylist } from '../../store/slices/playlist';

export function PlaylistFooter() {
    const { allPlaylists, selectedPlaylistId, draftPlaylistVideoIds } = useAppSelector((state) => state.playlist);
    const dispatch = useAppDispatch();

    const playlistList = useMemo(() => Object.values(allPlaylists), [allPlaylists]);

    const addPlaylist = () => {

    }

    return <footer className={styles.footer}>
        <div className={styles.content}>
            <div>
                <select 
                value={selectedPlaylistId} 
                onChange={(e) => dispatch(selectPlaylist(Number(e.target.value)))}>
                    <option value="" disabled selected>Select Playlist</option>
                    {playlistList.map(p => <option value={p.id}>{p.title}</option>)}
                </select>
            </div>
            <div>
                <button onClick={addPlaylist}>Add New</button>
            </div>
        </div>
        
    </footer>
}