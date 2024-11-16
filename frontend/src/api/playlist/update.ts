import { Playlist } from '../../model/playlist';

export type UpdateEntry = { videoId: number; entryOrder: number };
export type PlaylistUpdateRequest = { toAdd: UpdateEntry[]; toRemove: number[]; toUpdate: UpdateEntry[] };

export const playlistUpdate = async ({ id, entries }: { id: number; entries: number[] }) => {
    const res = await fetch(`/api/playlist/${id}`, {
        method: 'PUT',
        body: JSON.stringify(entries),
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    });
    const result = (await res.json()) as unknown as Playlist;
    return result;
};
