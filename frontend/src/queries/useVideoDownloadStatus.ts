import { useSuspenseQuery } from '@tanstack/react-query';
import { jobFromId } from '../api/video';
// import { useWrappedQuery } from './useWrappedQuery';
// import { useCallback } from 'react';

export function getVideosDownloadStatusQueryKey(jobId: string) {
    return ['videoDownload', jobId];
}

export function useVideoDownloadStatus(jobId: string) {
    // const queryClient = useQueryClient();

    // const reset = useCallback(() => {
    //     queryClient.invalidateQueries({ queryKey: getVideosDownloadStatusQueryKey(jobId) });
    // }, [jobId, queryClient]);

    const { data, refetch } = useSuspenseQuery({
        queryKey: getVideosDownloadStatusQueryKey(jobId),
        queryFn: () => jobFromId(jobId),
    });

    return { data, refetch };
}
