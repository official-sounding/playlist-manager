import './App.css';
import { VideoList } from './components/videoList';
import { InitialDataLoader } from './components/initialDataLoader';
import { PlaylistFooter } from './components/playlistFooter';
import { useAppSelector } from './store';
import { assertNever } from './utils/assertNever';
import { PlaylistEditor } from './components/playlistEditor';

function ViewMapper() {
    const view = useAppSelector(({ config }) => config.view);

    switch (view) {
        case 'video':
            return <VideoList />;
        case 'playlist':
            return <PlaylistEditor />;
        default:
            assertNever(view);
    }
}

function App() {
    return (
        <>
            <InitialDataLoader />
            <div id='root-content'>
                <ViewMapper />
            </div>
            <PlaylistFooter />
        </>
    );
}

export default App;
