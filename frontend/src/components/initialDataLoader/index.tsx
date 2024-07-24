import { useDispatchThunkIfInitial } from "../../store";
import { getAllTags } from "../../store/slices/tag"
import { getAllVideos } from "../../store/slices/video";

export function InitialDataLoader() {
    useDispatchThunkIfInitial('tag', getAllTags);
    useDispatchThunkIfInitial('video', getAllVideos);

    return <></>
}