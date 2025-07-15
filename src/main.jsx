// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; 
import { BrowserRouter } from 'react-router-dom'; // <--- Adicione esta importação

import { UserProvider } from './Context/UserContext'; // Certifique-se de que este e o ProgressProvider também estão sendo usados se forem parte do seu contexto
import { ProgressProvider } from './Context/ProgressContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* <--- Adicione o BrowserRouter aqui */}
      <UserProvider> {/* Mantenha seus Providers aqui dentro do BrowserRouter */}
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </UserProvider>
    </BrowserRouter> {/* <--- Feche o BrowserRouter aqui */}
  </React.StrictMode>,
);