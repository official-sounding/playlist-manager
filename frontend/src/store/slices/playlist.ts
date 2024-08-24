import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Playlist } from "../../model/playlist";
import { playlistGet } from "../../api/playlist/get";
import { applyThunk, SliceWithRequest } from "../thunk-utils";

export type PlaylistSlice = SliceWithRequest & {
    allPlaylists: Record<number, Playlist>;
    selectedPlaylistId: number | undefined;
    draftPlaylistVideoIds: number[];
}

const initialState: PlaylistSlice = { allPlaylists: {}, selectedPlaylistId: undefined, draftPlaylistVideoIds: [], requestState: {} };

const getAllPlaylists = createAsyncThunk('playlist/allPlaylists', playlistGet)

export const playlistSlice = createSlice({
    name: 'playlist',
    initialState,
    reducers: {
        selectPlaylist: (state, action: PayloadAction<number>) => {
            if(state.allPlaylists[action.payload]) {
                state.selectedPlaylistId = action.payload;
                state.draftPlaylistVideoIds = state.allPlaylists[action.payload].entries.map(v => v.id);
            }
        },
        addVideoToDraft: (state, { payload: { videoId, position } }: PayloadAction<{ videoId: number, position?: number}>) => {
            if(position === undefined) {
                state.draftPlaylistVideoIds.push(videoId);
            } else {
                state.draftPlaylistVideoIds.splice(position, 0, videoId);
            }
        },
        removeVideoFromDraft: (state, { payload }: PayloadAction<number>) => {
            const idx = state.draftPlaylistVideoIds.indexOf(payload);
            if(idx !== -1) {
                state.draftPlaylistVideoIds.splice(idx, 1);
            }
        }
    },
    extraReducers: (builder) => {
        applyThunk(builder, getAllPlaylists, (state, payload) => state.allPlaylists = payload);
    }
});

export const { selectPlaylist, addVideoToDraft, removeVideoFromDraft } = playlistSlice.actions;
export { getAllPlaylists };

export default playlistSlice.reducer;