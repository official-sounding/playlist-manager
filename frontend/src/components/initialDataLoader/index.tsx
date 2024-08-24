import { useDispatchThunkIfInitial } from "../../store";
import { getAllPlaylists } from "../../store/slices/playlist";
import { getAllTags } from "../../store/slices/tag"
import { getAllVideos } from "../../store/slices/video";

export function InitialDataLoader() {
    useDispatchThunkIfInitial('tag', getAllTags);
    useDispatchThunkIfInitial('video', getAllVideos);
    useDispatchThunkIfInitial('playlist', getAllPlaylists);

    return <></>
}