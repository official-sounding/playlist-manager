import { getTags } from '../api/tag/get';
import { useWrappedQuery } from './useWrappedQuery';

export function getTagsQueryKey() {
    return ['tags'];
}

export function useTags() {
    return useWrappedQuery({
        queryKey: getTagsQueryKey(),
        queryFn: getTags,
    });
}
