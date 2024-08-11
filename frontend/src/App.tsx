import './App.css';
import { VideoList } from './components/videoList';
import { InitialDataLoader } from './components/initialDataLoader';

function App() {
    return (
        <>

                        <InitialDataLoader />
                        <VideoList />
        </>
    );
}

export default App;
