import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { InterfaceShell } from './components/InterfaceShell.tsx';
import './index.css';
import './shell.css';
import './workbench.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <InterfaceShell>
        <App />
      </InterfaceShell>
    </ErrorBoundary>
  </StrictMode>,
);
