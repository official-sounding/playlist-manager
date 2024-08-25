import { Playlist } from '../../model/playlist';

export const playlistCreate = async (req: { title: string }) => {
    const res = await fetch('/api/playlist', {
        method: 'POST',
        body: JSON.stringify(req),
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    });
    const result = (await res.json()) as unknown as Playlist;
    return result;
};
