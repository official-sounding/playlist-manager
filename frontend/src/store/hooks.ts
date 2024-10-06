import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './root';
import { SliceKeysWithRequestState, RequestState, initialRequestState, SimpleAsyncThunk } from './thunk-utils';
import { useDebounceCallback } from 'usehooks-ts';
import { updatePlaylist } from './slices/playlist';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export function useThunkState(slice: SliceKeysWithRequestState<RootState>, req: string): RequestState {
    return useAppSelector((state) => state[slice].requestState[req] ?? initialRequestState);
}

export function useDispatchThunkIfInitial<T>(slice: SliceKeysWithRequestState<RootState>, thunk: SimpleAsyncThunk<T>) {
    const dispatch = useAppDispatch();

    const status = useThunkState(slice, thunk.typePrefix);

    if (status.state === 'initial') {
        dispatch(thunk());
    }
}

export function useDebouncedSync() {
    const dispatch = useAppDispatch();
    return useDebounceCallback(() => dispatch(updatePlaylist()), 5000, { maxWait: 30000 });
}
