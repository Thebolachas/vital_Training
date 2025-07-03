import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function IntroPage() {
  const navigate = useNavigate();
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleStart = () => {
    setIsFadingOut(true);
    // Espera a animação de fade-out terminar antes de navegar
    setTimeout(() => {
      navigate('/login'); // Agora redireciona para a tela de login
    }, 800); // Duração da transição
  };

  return (
    <div 
      className={`
        h-screen w-screen bg-gradient-to-r from-pink-100 to-blue-200 text-white flex flex-col transition-opacity duration-[800ms] ease-in-out
        ${isFadingOut ? 'opacity-0' : 'opacity-100'}
      `}
    >
      {/* Seção Superior - Vazia, para dar espaço */}
      <div className="flex-1"></div>

      {/* Seção Central - O Foco */}
      <div className="flex-[2] flex flex-col items-center justify-center text-center px-4">
        

        {/* Texto inspirado*/}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mt-8">
          Menos fios. Mais vida.
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mt-4 max-w-2xl">
          Monitoramento fetal simples e poderoso.
        </p>
      </div>
      
      {/* Seção Inferior - Ação */}
      <div className="flex-1 flex items-center justify-center">
        <button
          onClick={handleStart}
          className="bg-blue-300 text-black font-bold py-3 px-12 rounded-full text-lg hover:bg-blue-400 transition-all transform hover:scale-105"
        >
          Iniciar
        </button>
      </div>
    </div>
  );
}
