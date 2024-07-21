import { Video } from "../../model/video";
import { useAppSelector } from "../../store";

type Args = { video: Video };
export function TagList({ video }: Args) {
    const allTags = useAppSelector(state => state.tag.allTags);

    return <>
    <ul>
        {video.tags.map(t => <li>{t.title}</li>)}
    </ul>
    <select>
        {allTags.map(t => <option value={t.id}>{t.title}</option>)}
    </select>
    </>
}