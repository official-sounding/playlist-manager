import { useAppDispatch, useAppSelector } from "../../store"
import { hydratedDraftPlaylist } from "../../store/selectors";
import { updateView } from "../../store/slices/config";

export function PlaylistEditor() {
    const dispatch = useAppDispatch();
    const returnToVideos = () => dispatch(updateView('video'));

    const playlist = useAppSelector(hydratedDraftPlaylist);

    return <>
        <h1>Playlist Editor</h1>
        <button onClick={returnToVideos}>&lt;&lt; Return to Video List</button>
        <ul>
            {playlist.map((v) => <li key={v.id}>{v.title}</li>)}
        </ul>
    </>
}