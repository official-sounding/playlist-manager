import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllPlaylistsQueryKey } from '../queries/usePlaylists';
import { playlistUpdate } from '../api/playlist/update';
import { useStore } from 'react-redux';
import { useCallback } from 'react';
import { useDebounceCallback } from 'usehooks-ts';
import { AppState, useAppDispatch } from '../store';
import { updatePlaylist } from '../store/slices/playlist';

export function useUpdatePlaylist() {
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();
    const store = useStore();

    const { mutate } = useMutation({
        mutationFn: playlistUpdate,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: getAllPlaylistsQueryKey() });
            dispatch(updatePlaylist(data));
        },
    });

    const debouncedMutate = useDebounceCallback(mutate, 5000, { maxWait: 30000 });

    const debouncedUpdatePlaylist = useCallback(() => {
        // using store.getState() so that we don't regenerate
        // the callback every time the data changes, avoids multiple invocations
        const {
            playlist: { draftPlaylistVideoIds, selectedPlaylistId },
        } = store.getState() as AppState;

        if (!selectedPlaylistId) {
            return;
        }

        debouncedMutate({ id: selectedPlaylistId, entries: draftPlaylistVideoIds });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store]);

    return { debouncedUpdatePlaylist };
}
