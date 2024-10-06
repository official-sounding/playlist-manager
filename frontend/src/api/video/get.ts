import { Tag } from '../../model/tag';
import { RawVideo, Video } from '../../model/video';
import { prettyPrintDuration } from '../../utils/prettyPrintDuration';

export const videoGet = async () => {
    const res = await fetch('/api/video');
    const result = (await res.json()) as unknown as RawVideo[];
    return result.map(enrichVideo);
};

export function enrichVideo(raw: RawVideo): Video {
    return {
        ...raw,
        tags: raw.tags.sort(sortTags),
        prettyDuration: prettyPrintDuration(raw.duration),
    };
}

function sortTags(a: Tag, b: Tag) {
    return a.title.localeCompare(b.title);
}
