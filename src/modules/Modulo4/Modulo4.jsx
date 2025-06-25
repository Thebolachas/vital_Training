import React, { useState } from 'react';
import TeoriaModulo4 from '../../components/TeoriaModulo4';
import QuizModulo4 from '../../components/QuizModulo4';

export default function Modulo4() {
  const [fase, setFase] = useState('teoria');
  const [pontuacao, setPontuacao] = useState(null);

  const iniciarQuiz = () => setFase('quiz');
  const finalizarModulo = (acertos) => {
    setPontuacao(acertos);
    setFase('fim');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {fase === 'teoria' && (
        <div>
          <TeoriaModulo4 />
          <div className="text-center mt-6">
            <button
              onClick={iniciarQuiz}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Iniciar Quiz
            </button>
          </div>
        </div>
      )}

      {fase === 'quiz' && <QuizModulo4 onFinalizar={finalizarModulo} />}

      {fase === 'fim' && (
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold mb-4">Módulo Finalizado! 🎉</h2>
          <p className="text-lg text-gray-700">
            Você acertou {pontuacao} de 3 perguntas.
          </p>
          <button
            onClick={() => setFase('teoria')}
            className="mt-6 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Refazer Módulo
          </button>
        </div>
      )}
    </div>
  );
}
