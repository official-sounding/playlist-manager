import { Tag } from '../../model/tag';
import { wrapAsync } from '../wrapAsync';

export const tagGet = wrapAsync(async () => {
    const res = await fetch('/api/tag');
    const result = (await res.json()) as unknown as Tag[];
    return result;
});
