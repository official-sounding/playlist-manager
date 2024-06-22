import { Suspense } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

import './App.css';
import { VideoList } from './components/videoList';
import { ConfigProvider } from './providers/config';

function App() {
    return (
        <>
            <ConfigProvider>
                <ErrorBoundary fallback={<h1>Oh no!</h1>}>
                    <Suspense fallback={<h1>Loading</h1>}>
                        <VideoList />
                    </Suspense>
                </ErrorBoundary>
            </ConfigProvider>
        </>
    );
}

export default App;
