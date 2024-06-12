import { Video } from "../../model/video";
import { wrapAsync } from "../wrapAsync";

export const videoGet = wrapAsync(async () => {
    const res = await fetch('/api/video');
    const result = await res.json() as unknown as Video[];
    return result;
})