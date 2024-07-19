import { tagGet } from "../../api/tag/get";
import { Video } from "../../model/video";

type Args = { video: Video };
export function TagList({ video }: Args) {
    const allTags = tagGet.read();

    return <>
    <ul>
        {video.tags.map(t => <li>{t.title}</li>)}
    </ul>
    <select>
        {allTags.map(t => <option value={t.id}>{t.title}</option>)}
    </select>
    </>
}