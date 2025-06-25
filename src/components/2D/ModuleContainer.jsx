// src/components/ModuleContainer.jsx
import React, { useState } from 'react';

// Recebe um objeto com as "partes" do módulo
export default function ModuleContainer({ teoria, imagens, quiz }) {
  // Define a etapa inicial baseada no que está disponível
  const [etapa, setEtapa] = useState('teoria');

  const renderEtapa = () => {
    switch (etapa) {
      case 'teoria': return teoria;
      case 'imagens': return imagens;
      case 'quiz': return quiz;
      default: return null;
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <div className="mb-4 flex justify-center space-x-4">
        {/* Botão de Teoria (sempre existe) */}
        <button onClick={() => setEtapa('teoria')} className={`py-2 px-4 rounded ${etapa === 'teoria' ? 'bg-blue-600 text-white' : '...'}`}>
          Teoria
        </button>

        {/* Botão de Imagens (só aparece se 'imagens' for fornecido) */}
        {imagens && (
          <button onClick={() => setEtapa('imagens')} className={`py-2 px-4 rounded ${etapa === 'imagens' ? 'bg-blue-600 text-white' : '...'}`}>
            Imagem Explicativa
          </button>
        )}

        {/* Botão de Quiz (sempre existe) */}
        {quiz && (
          <button onClick={() => setEtapa('quiz')} className={`py-2 px-4 rounded ${etapa === 'quiz' ? 'bg-blue-600 text-white' : '...'}`}>
            Quiz
          </button>
        )}
      </div>
      {renderEtapa()}
    </div>
  );
}