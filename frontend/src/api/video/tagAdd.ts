import { Tag } from "../../model/tag";

export type VideoTagAddRequest = { videoId: number; tag: Tag; }

export const videoTagAdd = async ({ videoId, tag }: VideoTagAddRequest) => {
    await fetch(`/api/video/${videoId}/tag/${tag.id}`, { method: 'POST' });
    return { videoId, tag };
}