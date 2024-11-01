import { DefaultError, QueryKey, useSuspenseQuery, UseSuspenseQueryOptions } from '@tanstack/react-query';

export function useWrappedQuery<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
>(options: UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
    const { data } = useSuspenseQuery(options);
    return data;
}
