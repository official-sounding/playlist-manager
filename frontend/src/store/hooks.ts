import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './root';
import { SliceKeysWithRequestState, RequestState, initialRequestState } from './thunk-utils';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();


export function useThunkState(slice: SliceKeysWithRequestState<RootState>, req: string): RequestState {
    return useAppSelector((state) => state[slice].requestState[req] ?? initialRequestState);
}


