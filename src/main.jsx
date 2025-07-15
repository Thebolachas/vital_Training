import React, { useEffect } from 'react'; // Import useEffect
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

function AppInitializer() {
  useEffect(() => {
    const setAppHeight = () => {
      // Define uma variável CSS '--app-height' com a altura interna da janela
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    };

    // Define a altura inicial ao carregar a página
    setAppHeight();

    // Atualiza a altura sempre que a janela for redimensionada
    window.addEventListener('resize', setAppHeight);

    // Função de limpeza para remover o event listener quando o componente for desmontado
    return () => window.removeEventListener('resize', setAppHeight);
  }, []); // O array vazio [] garante que o efeito rode apenas uma vez (ao montar) e a função de limpeza (ao desmontar)

  return (
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <AppInitializer />
);