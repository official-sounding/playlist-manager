import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { videoGet } from "../../api/video";
import { Video } from "../../model/video";
import { applyThunk, SliceWithRequest } from "../thunk-utils";


export type VideoSlice = SliceWithRequest & {
    allVideos: Video[],
};

const initialState: VideoSlice = { allVideos: [], requestState: { } };

const getAllVideos = createAsyncThunk('video/allVideos', async () => videoGet())

export const tagSlice = createSlice({
    name: 'video',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        applyThunk(builder, getAllVideos, (state, payload) => state.allVideos = payload);
      },
});

export { getAllVideos };

export default tagSlice.reducer;