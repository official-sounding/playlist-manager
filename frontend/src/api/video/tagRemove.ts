import { Tag } from "../../model/tag";

export type VideoTagRemoveRequest = { videoId: number; tag: Tag; }

export const videoTagRemove = async ({ videoId, tag }: VideoTagRemoveRequest) => {
    await fetch(`/api/video/${videoId}/tag/${tag.id}`, { method: 'DELETE' });
    return { videoId, tag };
}