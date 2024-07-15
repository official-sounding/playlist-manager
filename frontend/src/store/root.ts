import { configureStore } from '@reduxjs/toolkit';
import config from './configSlice';

export const store = configureStore({
    reducer: {
        config,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
