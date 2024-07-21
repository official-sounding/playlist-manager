import { ActionReducerMapBuilder, createAsyncThunk, Draft, SerializedError } from '@reduxjs/toolkit';

type InitialState = { state: 'initial' };
type ActiveState = { state: 'pending' | 'fulfilled', requestId: string };
type ErrorState = { state: 'error', error: SerializedError };

export type RequestState = InitialState | ActiveState | ErrorState;

export type SliceWithRequest = { requestState: Record<string,RequestState> };
export type SliceKeysWithRequestState<Obj> = {
    [K in keyof Obj]:
        Obj[K] extends SliceWithRequest ?
            K :
            never
}[keyof Obj]

export const initialRequestState: InitialState = { state: 'initial' };

export function applyThunk<S extends SliceWithRequest, R>(builder: ActionReducerMapBuilder<S>, thunk: ReturnType<typeof createAsyncThunk<R, void>>, applicator: (s: Draft<S>, p: R) => void) {
    builder
          .addCase(thunk.pending, (state, action) => {
            if (state.requestState[thunk.typePrefix]?.state !== 'pending') {
                state.requestState[thunk.typePrefix] = { state: 'pending', requestId: action.meta.requestId };
            }
          })
          .addCase(thunk.fulfilled, (state, action) => {
            const { requestId } = action.meta
            const current = state.requestState[thunk.typePrefix];
            if(current?.state === 'pending' && current.requestId === requestId) {
              applicator(state, action.payload);
              state.requestState[thunk.typePrefix] = { state: 'fulfilled', requestId };
            }
          })
          .addCase(thunk.rejected, (state, action) => {
            const { requestId } = action.meta
            const current = state.requestState[thunk.typePrefix];
            if(current?.state === 'pending' && current.requestId === requestId) {
                state.requestState[thunk.typePrefix] = { state: 'error', error: action.error };
              }
          })
}