import { useDispatchThunkIfInitial } from '../../store';
import { getAllPlaylists } from '../../store/slices/playlist';

export function InitialDataLoader() {
    useDispatchThunkIfInitial('playlist', getAllPlaylists);

    return <></>;
}
