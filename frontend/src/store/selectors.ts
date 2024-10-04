import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '.';
import { Video } from '../model/video';

export const hydratedDraftPlaylist = createSelector(
    [(state: RootState) => state.playlist.draftPlaylistVideoIds, (state: RootState) => state.video.videoIdMap],
    (draftPlaylistVideoIds: number[], videoIdMap: Map<number, Video>) => {
        const videos = draftPlaylistVideoIds.map((id) => videoIdMap.get(id)).filter((v) => !!v);
        return videos;
    }
);
