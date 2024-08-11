import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jobFromId, videoDownload, videoGet } from "../../api/video";
import { Video } from "../../model/video";
import { applyThunk, SliceWithRequest } from "../thunk-utils";
import { QueueDetails } from "../../model/queue";


export type VideoSlice = SliceWithRequest & {
    allVideos: Video[],
    downloadRequests: Record<string, QueueDetails>,
};

const initialState: VideoSlice = { allVideos: [], requestState: { }, downloadRequests: { } };

const getAllVideos = createAsyncThunk('video/allVideos', () => videoGet())
const getVideoStatus = createAsyncThunk('video/getVideoStatus', (id: string) => jobFromId(id))
const downloadVideo = createAsyncThunk('video/download', (url: string) => videoDownload(url));

export const tagSlice = createSlice({
    name: 'video',
    initialState,
    reducers: {
        removeVideoStatus: (state, action: PayloadAction<string>) => {
            if(state.downloadRequests[action.payload]) {
                delete state.downloadRequests[action.payload];
            }
        }
    },
    extraReducers: (builder) => {
        applyThunk(builder, getAllVideos, (state, payload) => state.allVideos = payload);
        applyThunk(builder, getVideoStatus, (state, payload) => state.downloadRequests[payload.job.id] = payload);
      },
});

export const { removeVideoStatus } = tagSlice.actions;
export { getAllVideos, getVideoStatus, downloadVideo };

export default tagSlice.reducer;