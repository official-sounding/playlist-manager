import './App.css';
import { VideoList } from './components/videoList';
import { PlaylistFooter } from './components/playlistFooter';
import { useAppSelector } from './store';
import { assertNever } from './utils/assertNever';
import { PlaylistEditor } from './components/playlistEditor';
import { QueryClient, QueryClientProvider, useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

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
    const { reset } = useQueryErrorResetBoundary();
    return (
        <ErrorBoundary
            onReset={reset}
            fallbackRender={({ resetErrorBoundary }) => (
                <div>
                    There was an error!
                    <button onClick={() => resetErrorBoundary()}>Try again</button>
                </div>
            )}>
            <QueryClientProvider client={queryClient}>
                <div id='root-content'>
                    <ViewMapper />
                </div>
                <PlaylistFooter />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </ErrorBoundary>
    );
}

export default App;
