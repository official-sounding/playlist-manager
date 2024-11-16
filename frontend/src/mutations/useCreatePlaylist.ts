import { useMutation, useQueryClient } from '@tanstack/react-query';
import { playlistCreate } from '../api/playlist/create';
import { useAppDispatch } from '../store';
import { getAllPlaylistsQueryKey } from '../queries/usePlaylists';
import { selectPlaylist } from '../store/slices/playlist';

export function useCreatePlaylist() {
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: playlistCreate,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: getAllPlaylistsQueryKey() });
            dispatch(selectPlaylist(data));
        },
    });
}
