import { Tag } from '../../model/tag';

export const getTags = async () => {
    const res = await fetch('/api/tag');
    const result = (await res.json()) as unknown as Tag[];
    return result;
};