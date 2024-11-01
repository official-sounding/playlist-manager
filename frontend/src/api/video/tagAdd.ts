import { Tag } from '../../model/tag';

type VideoTagAddRequest = { videoId: number; tag: Tag };
type VideoTagCreateRequest = { videoId: number; tagStr: string };

function isAddRequest(req: VideoTagRequest): req is VideoTagAddRequest {
    return 'tag' in req;
}

export type VideoTagRequest = VideoTagAddRequest | VideoTagCreateRequest;
export type VideoTagResult = {
    action: 'tagCreated' | 'videoTagged';
    videoId: number;
    tag: Tag;
};

export const videoTagAdd = async (req: VideoTagRequest): Promise<VideoTagResult> => {
    if (isAddRequest(req)) {
        const { videoId, tag } = req;
        await fetch(`/api/video/${videoId}/tag/${tag.id}`, { method: 'POST' });
        return { videoId, tag, action: 'videoTagged' };
    }

    const { videoId, tagStr } = req;
    const body = JSON.stringify({ title: tagStr });
    const res = await fetch(`/api/video/${videoId}/tag`, { method: 'POST', body });
    const tag = (await res.json()) as unknown as Tag;
    return { videoId, tag, action: 'tagCreated' };
};
