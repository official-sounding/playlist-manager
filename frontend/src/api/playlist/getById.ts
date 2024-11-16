import { Playlist } from '../../model/playlist';

export const playlistGetById = async (id: number) => {
    const res = await fetch(`/api/playlist/${id}`);
    const result = (await res.json()) as unknown as Playlist;
    return result;
};
