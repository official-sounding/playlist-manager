import { useMutation, useQueryClient } from '@tanstack/react-query';
import { videoTagAdd } from '../api/video/tagAdd';
import { getVideosQueryKey } from '../queries/useVideos';
import { getTagsQueryKey } from '../queries/useTags';

export function useAddTag() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: videoTagAdd,
        onSuccess: (data) => {
            console.log(queryClient.getQueryCache().getAll());
            queryClient.invalidateQueries({ queryKey: getVideosQueryKey(), refetchType: 'all' });
            if (data.action === 'tagCreated')
                queryClient.invalidateQueries({ queryKey: getTagsQueryKey(), refetchType: 'all' });
        },
    });
}
