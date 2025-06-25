import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// ✅ CORREÇÃO: O ficheiro de CSS principal fica na raiz de 'src'
import './index.css';

// Não há mais necessidade de importar o UserProvider ou o BrowserRouter aqui,
// pois eles já estão corretamente dentro do App.jsx

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
