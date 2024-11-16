import { createSelector } from '@reduxjs/toolkit';
import { AppState } from '.';
import { Video } from '../model/video';
import { Playlist } from '../model/playlist';

export const hydratedDraftPlaylistEntries = createSelector(
    [(state: AppState) => state.playlist.draftPlaylistVideoIds, (_, videoIdMap: Record<number, Video>) => videoIdMap],
    (draftPlaylistVideoIds: number[], videoIdMap: Record<number, Video>) => {
        const videos = draftPlaylistVideoIds.map((id) => videoIdMap[id]).filter((v) => !!v);
        return videos;
    }
);

export const currentPlaylistTitle = createSelector(
    [(state: AppState) => state.playlist.selectedPlaylistId, (_, allPlaylists: Playlist[]) => allPlaylists],
    (selectedPlaylistId: number | undefined, allPlaylists: Playlist[]): string | undefined => {
        if (!selectedPlaylistId) {
            return undefined;
        }

        return allPlaylists.find((p) => p.id === selectedPlaylistId)?.title;
    }
);
