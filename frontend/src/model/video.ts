import { Tag } from "./tag";

export type RawVideo = {
    id: number;
    videoId: string;
    filename: string;
    title: string;
    artist?: string;
    duration: number;
    uploadedAt?: string;
    createdAt: string;
    videoUrl: string;
    thumbnailUrl: string;
    tags: Tag[];
};

export type Video = RawVideo & {
    prettyDuration: string
}
