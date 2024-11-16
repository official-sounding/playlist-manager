import { useDispatch, useSelector } from 'react-redux';
import type { AppState, AppDispatch } from './root';
import { currentPlaylistTitle, hydratedDraftPlaylistEntries } from './selectors';
import { usePlaylists } from '../queries/usePlaylists';
import { useVideos } from '../queries/useVideos';
import { useCallback, useMemo } from 'react';
import { Video } from '../model/video';
import { prettyPrintDuration } from '../utils/prettyPrintDuration';
import { updateView, View } from './slices/config';
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<AppState>();

export function useDraftPlaylist() {
    const playlists = usePlaylists();
    const allVideos = useVideos();

    const title = useAppSelector((s) => currentPlaylistTitle(s, playlists));

    const videoIdMap = useMemo(
        () =>
            allVideos.reduce<Record<number, Video>>((prev, curr) => {
                prev[curr.id] = curr;
                return prev;
            }, {}),
        [allVideos]
    );
    const videos = useAppSelector((state) => hydratedDraftPlaylistEntries(state, videoIdMap));
    const totalDuration = useMemo(() => prettyPrintDuration(videos.reduce((p, c) => p + c.duration, 0)), [videos]);

    return { title, videos, totalDuration };
}

export function useViewToggle(): [View, () => void] {
    const dispatch = useAppDispatch();
    const view = useAppSelector((state) => state.config.view);
    const toggleView = useCallback(() => {
        const newView: View = view === 'playlist' ? 'video' : 'playlist';
        dispatch(updateView(newView));
    }, [dispatch, view]);

    return [view, toggleView];
}
