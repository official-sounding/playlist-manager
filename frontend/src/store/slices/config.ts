import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type View = 'video' | 'playlist';

export type ConfigState = {
    view: View;
};

const initialState: ConfigState = { view: 'video' };

export const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        updateView: (state, action: PayloadAction<View>) => {
            state.view = action.payload;
        },
    },
});

export const { updateView } = configSlice.actions;

export default configSlice.reducer;
