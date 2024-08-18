import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jobFromId, videoDownload, videoGet } from "../../api/video";
import { Video } from "../../model/video";
import { applyThunk, SliceWithRequest } from "../thunk-utils";
import { QueueDetails } from "../../model/queue";
import { videoTagAdd } from "../../api/video/tagAdd";
import { videoTagCreate } from "../../api/video/tagCreate";
import { videoTagRemove } from "../../api/video/tagRemove";

export type VideoSlice = SliceWithRequest & {
    allVideos: Video[],
    downloadRequests: Record<string, QueueDetails>,
};

const initialState: VideoSlice = { allVideos: [], requestState: { }, downloadRequests: { } };

const getAllVideos = createAsyncThunk('video/allVideos', videoGet)
const getVideoStatus = createAsyncThunk('video/getVideoStatus', jobFromId)
const downloadVideo = createAsyncThunk('video/download', videoDownload);
const addTagToVideo = createAsyncThunk('video/addTag', videoTagAdd);
const createTagForVideo = createAsyncThunk('video/createTag', videoTagCreate)
const removeTagFromVideo = createAsyncThunk('video/removeTag', videoTagRemove);

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
        applyThunk(builder, addTagToVideo, (state, payload) => {
            const video = state.allVideos.find(v => v.id === payload.videoId);
            video?.tags.push(payload.tag);
        })
        applyThunk(builder, createTagForVideo, (state, payload) => {
            const video = state.allVideos.find(v => v.id === payload.videoId);
            video?.tags.push(payload.tag);
        })
        applyThunk(builder, removeTagFromVideo, (state, payload) => {
            const video = state.allVideos.find(v => v.id === payload.videoId);
            const tagIdx = video?.tags.findIndex(t => t.id === payload.tag.id) ?? -1;
            tagIdx !== -1 && video?.tags.splice(tagIdx, 1);
        })
      },
});

export const { removeVideoStatus } = tagSlice.actions;
export { getAllVideos, getVideoStatus, downloadVideo, addTagToVideo, createTagForVideo, removeTagFromVideo };

export default tagSlice.reducer;