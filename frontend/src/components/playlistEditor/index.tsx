import { Video } from '../../model/video';
import { useAppDispatch, useAppSelector } from '../../store';
import { hydratedDraftPlaylist } from '../../store/selectors';
import { updateView } from '../../store/slices/config';

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
import { reorderVideoInDraft } from '../../store/slices/playlist';

function SortableItem({ video }: { video: Video }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: video.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {video.title}
        </div>
    );
}

export function PlaylistEditor() {
    const dispatch = useAppDispatch();
    const returnToVideos = () => dispatch(updateView('video'));
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
          coordinateGetter: sortableKeyboardCoordinates,
        })
      );

    const playlist = useAppSelector(hydratedDraftPlaylist);

    function handleDragEnd(event: DragEndEvent) {
        const {active, over} = event;
        
        if (active.id !== over?.id && typeof active.id === 'number' && typeof over?.id === 'number') {

          dispatch(reorderVideoInDraft({ active: active.id, over: over.id }));
        }
      }

    return (
        <>
            <h1>Playlist Editor</h1>
            <button onClick={returnToVideos}>&lt;&lt; Return to Video List</button>
            <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={playlist}
        strategy={verticalListSortingStrategy}
      >
        {playlist.map(video => <SortableItem key={video.id} video={video} />)}
      </SortableContext>
    </DndContext>
        </>
    );
}
