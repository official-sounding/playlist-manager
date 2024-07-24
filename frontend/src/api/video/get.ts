import { Video } from '../../model/video';

export const videoGet = async () => {
    const res = await fetch('/api/video');
    const result = (await res.json()) as unknown as Video[];
    return result;
}
