import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type ConfigState = {
    showThumbnails: boolean;
};

const initialState: ConfigState = { showThumbnails: true };

export const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        updateShowThumbnails: (state, action: PayloadAction<boolean>) => {
            state.showThumbnails = action.payload;
        },
    },
});

export const { updateShowThumbnails } = configSlice.actions;

export default configSlice.reducer;
