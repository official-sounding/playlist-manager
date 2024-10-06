import { Video } from '../../model/video';
import { useAppDispatch } from '../../store';
import { removeTagFromVideo } from '../../store/slices/video';
import { Tag } from '../../model/tag';

import styles from './tagList.module.css';

type Args = { video: Video };

export function TagList({ video }: Args) {
    const videoId = video.id;
    const dispatch = useAppDispatch();

    const removeTag = (tag: Tag) => {
        dispatch(removeTagFromVideo({ videoId, tag }));
    };

    return (
        <div>
            <ul className={styles.tagList}>
                {video.tags.map((t) => (
                    <li key={t.id}>
                        {t.title}{' '}
                        <button className={styles.removeBtn} onClick={() => removeTag(t)}>
                            &times;
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
