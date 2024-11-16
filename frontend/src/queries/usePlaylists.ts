import { playlistGetAll } from '../api/playlist/getAll';
import { useWrappedQuery } from './useWrappedQuery';

export function getAllPlaylistsQueryKey() {
    return ['playlists'];
}

export function usePlaylists() {
    return useWrappedQuery({
        queryKey: getAllPlaylistsQueryKey(),
        queryFn: playlistGetAll,
    });
}
