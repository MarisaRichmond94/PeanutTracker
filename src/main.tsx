import './global.scss';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { AppContainer } from '@components';

import { App } from './app';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppContainer>
      <App />
    </AppContainer>
  </StrictMode>,
);
