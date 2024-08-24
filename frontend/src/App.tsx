import './App.css';
import { VideoList } from './components/videoList';
import { InitialDataLoader } from './components/initialDataLoader';
import { PlaylistFooter } from './components/playlistFooter';

function App() {
    return (
        <>

                        <InitialDataLoader />
                        <div id="root-content">
                        <VideoList />
                        </div>
                        <PlaylistFooter />
        </>
    );
}

export default App;
