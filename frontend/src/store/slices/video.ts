import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jobFromId, videoGet } from "../../api/video";
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

export const tagSlice = createSlice({
    name: 'video',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        applyThunk(builder, getAllVideos, (state, payload) => state.allVideos = payload);
        applyThunk(builder, getVideoStatus, (state, payload) => state.downloadRequests[payload.job.id] = payload);
      },
});

export { getAllVideos, getVideoStatus };

export default tagSlice.reducer;