import { Video } from '../../model/video';
import { useAppDispatch, useDraftPlaylist } from '../../store';
import { CSS } from '@dnd-kit/utilities';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { addVideoToDraft, removeVideoFromDraft, reorderVideoInDraft } from '../../store/slices/playlist';

import styles from './playlistEditor.module.css';
import { VideoSearch } from './videoSearch';
import { useUpdatePlaylist } from '../../mutations/useUpdatePlaylist';

function SortableItem({ video }: { video: Video }) {
    const dispatch = useAppDispatch();
    const { debouncedUpdatePlaylist } = useUpdatePlaylist();
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: video.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const removeVideo = () => {
        dispatch(removeVideoFromDraft(video.id));
        debouncedUpdatePlaylist();
    };

    return (
        <div ref={setNodeRef} style={style} className={styles.videoItem}>
            <div>
                <button {...attributes} {...listeners} className={styles.dragHandle}>
                    D
                </button>
                <a href={video.videoUrl} target='_blank'>
                    {video.title}
                </a>{' '}
                ({video.prettyDuration})
            </div>
            <div>
                <button className={styles.removeBtn} onClick={removeVideo}>
                    &times;
                </button>
            </div>
        </div>
    );
}

export function PlaylistEditor() {
    const dispatch = useAppDispatch();
    const { debouncedUpdatePlaylist } = useUpdatePlaylist();
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const { title, videos, totalDuration } = useDraftPlaylist();

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (active.id !== over?.id && typeof active.id === 'number' && typeof over?.id === 'number') {
            dispatch(reorderVideoInDraft({ active: active.id, over: over.id }));
            debouncedUpdatePlaylist();
        }
    }

    function onSearchSelect(video: Video) {
        dispatch(addVideoToDraft({ videoId: video.id }));
        debouncedUpdatePlaylist();
    }

    return (
        <>
            <h1>Playlist: {title}</h1>
            <h2>
                {videos.length} entries &mdash; {totalDuration}
            </h2>

            <hr />
            <VideoSearch onSelect={onSearchSelect} />
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={videos} strategy={verticalListSortingStrategy}>
                    {videos.map((video) => (
                        <SortableItem key={video.id} video={video} />
                    ))}
                </SortableContext>
            </DndContext>
        </>
    );
}
