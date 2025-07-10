import React, { Suspense } from 'react'; // Import Suspense
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import './index.css';
import './i18n'; // import i18n configuration

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback='Loading...'>
      {' '}
      {/* Wrap App with Suspense */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Suspense>
  </React.StrictMode>
);
