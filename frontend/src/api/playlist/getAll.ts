import { Playlist } from '../../model/playlist';

export const playlistGetAll = async () => {
    const res = await fetch('/api/playlist');
    const result = (await res.json()) as unknown as Playlist[];
    return result;
};
