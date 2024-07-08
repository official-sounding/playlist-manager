export type Video = {
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

export type Tag = {
    id: number;
    title: string
}
