import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getVideosQueryKey } from '../queries/useVideos';
import { videoTagRemove } from '../api/video/tagRemove';

export function useRemoveTag() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: videoTagRemove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getVideosQueryKey() });
        },
    });
}
