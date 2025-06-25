import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function IntroPage() {
  const navigate = useNavigate();
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleStart = () => {
    setIsFadingOut(true);
    // Espera a animação de fade-out terminar antes de navegar
    setTimeout(() => {
      navigate('/login');
    }, 800); // Duração deve ser a mesma da transição no CSS
  };

  return (
    <div 
      className={`
        h-screen w-screen bg-black text-white flex flex-col transition-opacity duration-[800ms] ease-in-out
        ${isFadingOut ? 'opacity-0' : 'opacity-100'}
      `}
    >
      {/* Seção Superior - Vazia, para dar espaço */}
      <div className="flex-1"></div>

      {/* Seção Central - O Foco */}
      <div className="flex-[2] flex flex-col items-center justify-center text-center px-4">
        <div className="w-full h-48 flex justify-center items-center">
            <img 
               
                className="max-h-full max-w-[280px] md:max-w-xs animate-float" // Animação de flutuação
            />
        </div>

        {/* Texto inspirado na Apple */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mt-8">
          Menos fios. Mais vida. 
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mt-4 max-w-2xl">
         Monitoramento fetal  simples e poderoso.
        </p>
      </div>
      
      {/* Seção Inferior - Ação */}
      <div className="flex-1 flex items-center justify-center">
        <button
          onClick={handleStart}
          className="bg-white text-black font-bold py-3 px-12 rounded-full text-lg hover:bg-gray-200 transition-all transform hover:scale-105"
        >
          Iniciar
        </button>
      </div>
    </div>
  );
}
