import { Video } from '../../model/video';

import styles from './tagList.module.css';
import { useRemoveTag } from '../../mutations/useRemoveTag';

type Args = { video: Video };

export function TagList({ video }: Args) {
    const videoId = video.id;
    const { mutate: removeTag } = useRemoveTag();

    return (
        <div>
            <ul className={styles.tagList}>
                {video.tags.map((t) => (
                    <li key={t.id}>
                        {t.title}{' '}
                        <button className={styles.removeBtn} onClick={() => removeTag({ videoId, tag: t })}>
                            &times;
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
