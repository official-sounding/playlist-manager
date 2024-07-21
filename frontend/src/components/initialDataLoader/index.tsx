import { useAppDispatch, useThunkState } from "../../store";
import { getAllTags } from "../../store/tagSlice"

export function InitialDataLoader() {
    const dispatch = useAppDispatch();

    const tagStatus = useThunkState('tag', getAllTags.typePrefix);

    if(tagStatus.state === 'initial') {
        dispatch(getAllTags());
    }

    return <></>
}