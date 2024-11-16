import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Playlist } from '../../model/playlist';
import { arrayMove } from '@dnd-kit/sortable';

export type PlaylistSlice = {
    selectedPlaylistId: number | undefined;
    draftPlaylistVideoIds: number[];
    draftDirty: boolean;
};

const initialState: PlaylistSlice = {
    selectedPlaylistId: undefined,
    draftPlaylistVideoIds: [],
    draftDirty: false,
};

export const playlistSlice = createSlice({
    name: 'playlist',
    initialState,
    reducers: {
        selectPlaylist: (state, action: PayloadAction<Playlist>) => {
            const playlist = action.payload;
            if (playlist) {
                state.selectedPlaylistId = playlist.id;
                state.draftPlaylistVideoIds = playlist.entries.map((v) => v.id);
            }
        },
        addVideoToDraft: (
            state,
            { payload: { videoId, position } }: PayloadAction<{ videoId: number; position?: number }>
        ) => {
            if (position === undefined) {
                state.draftPlaylistVideoIds.push(videoId);
            } else {
                state.draftPlaylistVideoIds.splice(position, 0, videoId);
            }

            state.draftDirty = true;
        },
        removeVideoFromDraft: (state, { payload }: PayloadAction<number>) => {
            const idx = state.draftPlaylistVideoIds.indexOf(payload);
            if (idx !== -1) {
                state.draftPlaylistVideoIds.splice(idx, 1);
            }

            state.draftDirty = true;
        },
        reorderVideoInDraft: (state, { payload }: PayloadAction<{ active: number; over: number }>) => {
            const { active, over } = payload;
            const oldIndex = state.draftPlaylistVideoIds.indexOf(active);
            const newIndex = state.draftPlaylistVideoIds.indexOf(over);

            state.draftPlaylistVideoIds = arrayMove(state.draftPlaylistVideoIds, oldIndex, newIndex);
            state.draftDirty = true;
        },
        updatePlaylist: (state, { payload }: PayloadAction<Playlist>) => {
            state.draftPlaylistVideoIds = [...payload.entries.map((e) => e.id)];
            state.draftDirty = false;
        },
    },
});

export const { selectPlaylist, addVideoToDraft, removeVideoFromDraft, reorderVideoInDraft, updatePlaylist } =
    playlistSlice.actions;

export default playlistSlice.reducer;
