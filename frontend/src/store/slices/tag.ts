import { Tag } from '../../model/tag';
import { getTags } from '../../api/tag/get';
import { applyThunk, SliceWithRequest } from '../thunk-utils';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';



export type TagSlice = SliceWithRequest & {
    allTags: Tag[],
};

const initialState: TagSlice = { allTags: [], requestState: { } };

/*const { currentRequestId, loading } = getState().users
  if (loading !== 'pending' || requestId !== currentRequestId) {
    return
  } */
const getAllTags = createAsyncThunk('tag/allTags', async () => getTags())

export const tagSlice = createSlice({
    name: 'tag',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        applyThunk(builder, getAllTags, (state, payload) => state.allTags = payload);
      },
});

export { getAllTags };

export default tagSlice.reducer;
