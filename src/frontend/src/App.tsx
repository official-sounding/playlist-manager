import { Suspense } from 'react'
import { ErrorBoundary } from './ErrorBoundary'

import './App.css'
import { VideoList } from './components/videoList'

function App() {

  return (
    <>
      <ErrorBoundary fallback={<h1>Oh no!</h1>}>
        <Suspense fallback={<h1>Loading</h1>}>
          <VideoList />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}

export default App
