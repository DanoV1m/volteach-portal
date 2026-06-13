import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { DevPerfOverlay } from './components/DevPerfOverlay.tsx';
import { initVitals } from './utils/vitals.ts';
import './index.css';

// Register performance observers before first render so early metrics are captured
initVitals();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
      {import.meta.env.DEV && <DevPerfOverlay />}
    </ErrorBoundary>
  </StrictMode>,
);
