import { videoGet } from "../../api/video";

export function VideoList() {
    const videos = videoGet.read();

    return <ul> {
        videos.map(v => (<li>{v.title}</li>))}

    </ul>
}