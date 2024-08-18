import { Tag } from "../../model/tag";

export type VideoTagCreateRequest = { videoId: number; tagStr: string; }

export const videoTagCreate = async ({ videoId, tagStr }: VideoTagCreateRequest) => {
    const body = JSON.stringify({ title: tagStr });
    const res = await fetch(`/api/video/${videoId}/tag`, { method: 'POST', body });

    const tag = (await res.json()) as unknown as Tag;
    return { videoId, tag };
}