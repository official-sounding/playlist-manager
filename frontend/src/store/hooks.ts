import { useDispatch, useSelector } from 'react-redux';
import type { AppState, AppDispatch } from './root';
import { SliceKeysWithRequestState, RequestState, initialRequestState, SimpleAsyncThunk } from './thunk-utils';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<AppState>();

export function useThunkState(slice: SliceKeysWithRequestState<AppState>, req: string): RequestState {
    return useAppSelector((state) => state[slice].requestState[req] ?? initialRequestState);
}

export function useDispatchThunkIfInitial<T>(slice: SliceKeysWithRequestState<AppState>, thunk: SimpleAsyncThunk<T>) {
    const dispatch = useAppDispatch();

    const status = useThunkState(slice, thunk.typePrefix);

    if (status.state === 'initial') {
        dispatch(thunk());
    }
}
