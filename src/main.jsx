// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { BrowserRouter } from 'react-router-dom'; // APENAS AQUI!
import { UserProvider } from './Context/UserContext';
import { ProgressProvider } from './Context/ProgressContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* ESTE É O ÚNICO BrowserRouter NO SEU APP INTEIRO */}
      <UserProvider>
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
);