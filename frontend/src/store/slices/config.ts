import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type View = 'video' | 'playlist';

export type ConfigState = {
    showThumbnails: boolean;
    view: View;
};

const initialState: ConfigState = { showThumbnails: true, view: 'video' };

export const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        updateShowThumbnails: (state, action: PayloadAction<boolean>) => {
            state.showThumbnails = action.payload;
        },
        updateView: (state, action: PayloadAction<View>) => {
            state.view = action.payload;
        },
    },
});

export const { updateShowThumbnails, updateView } = configSlice.actions;

export default configSlice.reducer;
