import { Video } from "./video";

export type Playlist = {
    id: number;
    title: string;
    entries: Video[];
    createdAt: string;
}