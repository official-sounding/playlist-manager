import { Tag } from "../../model/tag";

export type VideoTagAddRequest = { videoId: number; tag: Tag; }

export const videoTagRemove = async ({ videoId, tag }: VideoTagAddRequest) => {
    await fetch(`/api/video/${videoId}/tag/${tag.id}`, { method: 'DELETE' });
    return { videoId, tag };
}