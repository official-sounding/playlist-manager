import { Video } from "../../model/video";

type Args = { video: Video };
export function TagList({ video }: Args) {
    return <ul>
        {video.tags.map(t => <li>{t.title}</li>)}
    </ul>
}