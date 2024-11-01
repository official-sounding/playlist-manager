import { videoGet } from '../api/video';
import { useWrappedQuery } from './useWrappedQuery';

export function getVideosQueryKey() {
    return ['videos'];
}

export function useVideos() {
    return useWrappedQuery({
        queryKey: getVideosQueryKey(),
        queryFn: videoGet,
    });
}
