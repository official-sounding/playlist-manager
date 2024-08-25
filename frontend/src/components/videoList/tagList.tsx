import { FormEvent, useMemo } from 'react';
import { Video } from '../../model/video';
import { useAppDispatch, useAppSelector } from '../../store';
import { serialize } from '../../utils/serialize';
import { addTagToVideo, removeTagFromVideo } from '../../store/slices/video';
import { Tag } from '../../model/tag';

import styles from './tagList.module.css';


type Args = { video: Video };

export function TagList({ video }: Args) {
    const videoId = video.id;
    const allTags = useAppSelector((state) => state.tag.allTags);
    const dispatch = useAppDispatch();
    const tagIdSet = useMemo(() => new Set(video.tags.map((t) => t.id)), [video.tags]);
    const availableTags = useMemo(() => allTags.filter((t) => !tagIdSet.has(t.id)), [allTags, tagIdSet]);

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form: HTMLFormElement = e.currentTarget;
        const { tagId } = serialize(form);
        const tag = availableTags.find((t) => `${t.id}` === tagId);

        if (tag) {
            dispatch(addTagToVideo({ videoId, tag }));
        }
    };

    const removeTag = (tag: Tag) => {
        dispatch(removeTagFromVideo({ videoId, tag }))
    }

    return (
        <div>
            <ul className={styles.tagList}>
                {video.tags.map((t) => (
                    <li key={t.id}>{t.title} <button className={styles.removeBtn} onClick={() => removeTag(t)}>&times;</button></li>
                ))}
            </ul>
            {availableTags.length > 0 && (
                <form onSubmit={submit}>
                    <select className={styles.tagSelect} name='tagId'>
                        {availableTags.map((t) => (
                            <option key={t.id} value={t.id}>{t.title}</option>
                        ))}
                    </select>
                    <button className={styles.submitBtn} type='submit'>Add</button>
                </form>
            )}
        </div>
    );
}
