import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Playlist } from '../../model/playlist';
import { playlistGet } from '../../api/playlist/get';
import { applyThunk, SliceWithRequest } from '../thunk-utils';
import { playlistCreate } from '../../api/playlist/create';
import { playlistUpdate, PlaylistUpdateRequest } from '../../api/playlist/update';
import { arrayMove } from '@dnd-kit/sortable';

export type PlaylistSlice = SliceWithRequest & {
    allPlaylists: Playlist[];
    selectedPlaylistId: number | undefined;
    draftPlaylistVideoIds: number[];
    draftDirty: boolean;
};

const initialState: PlaylistSlice = {
    allPlaylists: [],
    selectedPlaylistId: undefined,
    draftPlaylistVideoIds: [],
    draftDirty: false,
    requestState: {},
};

const getAllPlaylists = createAsyncThunk('playlist/allPlaylists', playlistGet);
const createPlaylist = createAsyncThunk('playlist/createPlaylist', playlistCreate);
const updatePlaylist = createAsyncThunk('playlist/updatePlaylist', async (_, { getState }) => {
    const {
        playlist: { allPlaylists, selectedPlaylistId, draftDirty, draftPlaylistVideoIds },
    } = getState() as { playlist: PlaylistSlice };

    const playlist = allPlaylists.find((p) => p.id === selectedPlaylistId);

    if (!playlist) {
        return undefined as unknown as Playlist;
    }

    if (!draftDirty) {
        return playlist;
    }

    const currentEntries = playlist.entries.map((e, idx) => ({ videoId: e.id, entryOrder: idx }));
    const draftEntries = draftPlaylistVideoIds.map((videoId, entryOrder) => ({ videoId, entryOrder }));

    const update: PlaylistUpdateRequest = {
        toAdd: [],
        toRemove: [],
        toUpdate: [],
    };

    // for each entry in the draftEntries list
    // 1. if not present in currentEntries, add to "toAdd"
    // 2. if present in currentEntries as a different entryOrder, add to "toUpdate"
    draftEntries.forEach((e) => {
        const current = currentEntries.find((ce) => ce.videoId === e.videoId);
        if (!current) {
            update.toAdd.push(e);
            return;
        }

        if (current.entryOrder !== e.entryOrder) {
            update.toUpdate.push(e);
        }
    });

    // for each entry in the currentEntries list
    // if not present in draftEntries, add to "toRemove"
    currentEntries.forEach((e) => {
        const draft = draftEntries.find((de) => de.videoId === e.videoId);

        if (!draft) {
            update.toRemove.push(e.videoId);
        }
    });

    return playlistUpdate({ id: playlist.id, entries: update });
});

export const playlistSlice = createSlice({
    name: 'playlist',
    initialState,
    reducers: {
        selectPlaylist: (state, action: PayloadAction<number>) => {
            const playlist = state.allPlaylists.find((p) => p.id === action.payload);
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
    },
    extraReducers: (builder) => {
        applyThunk(builder, getAllPlaylists, (state, payload) => (state.allPlaylists = payload));
        applyThunk(builder, createPlaylist, (state, playlist) => {
            state.allPlaylists.push(playlist);
            state.selectedPlaylistId = playlist.id;
            state.draftPlaylistVideoIds = [];
        });
        applyThunk(builder, updatePlaylist, (state, playlist) => {
            const idx = state.allPlaylists.findIndex((p) => p.id === playlist.id);
            state.allPlaylists.splice(idx, 1, playlist);
            state.draftPlaylistVideoIds = [...playlist.entries.map((e) => e.id)];
            state.draftDirty = false;
        });
    },
});

export const { selectPlaylist, addVideoToDraft, removeVideoFromDraft, reorderVideoInDraft } = playlistSlice.actions;
export { getAllPlaylists, createPlaylist, updatePlaylist };

export default playlistSlice.reducer;
