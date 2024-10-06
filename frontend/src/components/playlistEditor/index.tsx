import { Video } from '../../model/video';
import { useAppDispatch, useAppSelector } from '../../store';
import { currentPlaylistTitle, hydratedDraftPlaylistEntries } from '../../store/selectors';

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
import { removeVideoFromDraft, reorderVideoInDraft } from '../../store/slices/playlist';

import styles from './playlistEditor.module.css';
import { useMemo } from 'react';
import { prettyPrintDuration } from '../../utils/prettyPrintDuration';

function SortableItem({ video }: { video: Video }) {
    const dispatch = useAppDispatch();
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: video.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const removeVideo = () => {
        dispatch(removeVideoFromDraft(video.id));
    }

    return (
        <div ref={setNodeRef} style={style} className={styles.videoItem} {...attributes} {...listeners}>
            <div>
            <a href={video.videoUrl} target='_blank'>{video.title}</a> ({video.prettyDuration})
            </div>
            <div>
                <button onClick={removeVideo}>&times;</button>
            </div>

        </div>
    );
}

export function PlaylistEditor() {
    const dispatch = useAppDispatch();
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
          coordinateGetter: sortableKeyboardCoordinates,
        })
      );

    const title = useAppSelector(currentPlaylistTitle);
    const playlistVideos = useAppSelector(hydratedDraftPlaylistEntries);

    const totalDuration = useMemo(() => prettyPrintDuration(playlistVideos.reduce((p,c) => p+c.duration, 0)), [playlistVideos]);

    function handleDragEnd(event: DragEndEvent) {
        const {active, over} = event;
        
        if (active.id !== over?.id && typeof active.id === 'number' && typeof over?.id === 'number') {

          dispatch(reorderVideoInDraft({ active: active.id, over: over.id }));
        }
      }

    return (
        <>
            <h1>Playlist: {title}</h1>
            <h2>{playlistVideos.length} entries &mdash; {totalDuration}</h2>

            <hr />
            <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={playlistVideos}
        strategy={verticalListSortingStrategy}
      >
        {playlistVideos.map(video => <SortableItem key={video.id} video={video} />)}
      </SortableContext>
    </DndContext>
        </>
    );
}
