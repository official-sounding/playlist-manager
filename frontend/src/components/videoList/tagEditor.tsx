import { FormEvent, useMemo } from 'react';
import { Video } from '../../model/video';
import { serialize } from '../../utils/serialize';

import styles from './tagEditor.module.css';
import { useTags } from '../../queries/useTags';
import { useAddTag } from '../../mutations/useAddTag';

type Args = { video: Video };

export function TagEditor({ video }: Args) {
    const videoId = video.id;
    const allTags = useTags();

    const { mutate: addTag } = useAddTag();

    const tagIdSet = useMemo(() => new Set(video.tags.map((t) => t.id)), [video.tags]);
    const availableTags = useMemo(() => allTags.filter((t) => !tagIdSet.has(t.id)), [allTags, tagIdSet]);

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form: HTMLFormElement = e.currentTarget;
        const { tagId } = serialize(form);
        const tag = availableTags.find((t) => `${t.id}` === tagId);

        if (tag) {
            addTag({ videoId, tag });
        }
    };

    return availableTags.length > 0 ? (
        <form onSubmit={submit} className={styles.tagEditor}>
            <select className={styles.tagSelect} name='tagId'>
                {availableTags.map((t) => (
                    <option key={t.id} value={t.id}>
                        {t.title}
                    </option>
                ))}
            </select>
            <button className={styles.submitBtn} type='submit'>
                Add
            </button>
        </form>
    ) : (
        <></>
    );
}
