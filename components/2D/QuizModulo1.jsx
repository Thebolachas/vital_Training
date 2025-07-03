import React, { useState } from 'react';

const perguntas = [
  {
    pergunta: 'Qual é a principal função do iCTG?',
    opcoes: [
      'Realizar ultrassonografias 3D',
      'Avaliar batimentos cardíacos fetais e contrações uterinas',
      'Emitir laudos laboratoriais',
    ],
    correta: 1,
  },
  {
    pergunta: 'Como o iCTG se conecta ao sistema de análise?',
    opcoes: [
      'Via USB com notebook dedicado',
      'Via Wi-Fi conectado à TV',
      'Via Bluetooth com app em tablet ou smartphone',
    ],
    correta: 2,
  },
  {
    pergunta: 'Qual é um dos diferenciais do iCTG?',
    opcoes: [
      'Necessita de estrutura hospitalar completa',
      'Funciona somente conectado a cabos fixos',
      'É portátil e ideal para áreas remotas',
    ],
    correta: 2,
  },
];

export default function QuizModulo1({ onFinalizar }) {
  const [indice, setIndice] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [respondido, setRespondido] = useState(false);
  const [selecionado, setSelecionado] = useState(null);

  const perguntaAtual = perguntas[indice];

  const verificarResposta = (i) => {
    setSelecionado(i);
    setRespondido(true);
    if (i === perguntaAtual.correta) setAcertos(acertos + 1);
  };

  const proxima = () => {
    if (indice + 1 < perguntas.length) {
      setIndice(indice + 1);
      setRespondido(false);
      setSelecionado(null);
    } else {
      onFinalizar(acertos);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">{perguntaAtual.pergunta}</h2>
      <div className="space-y-2">
        {perguntaAtual.opcoes.map((op, i) => (
          <button
            key={i}
            onClick={() => verificarResposta(i)}
            disabled={respondido}
            className={`block w-full text-left p-3 rounded-lg border transition
              ${respondido ?
                i === perguntaAtual.correta ? 'bg-green-100 border-green-500' :
                i === selecionado ? 'bg-red-100 border-red-500' : 'bg-gray-100 border-gray-300'
              : 'bg-white border-gray-300 hover:bg-blue-50'}`}
          >
            {op}
          </button>
        ))}
      </div>
      {respondido && (
        <button
          onClick={proxima}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Próxima
        </button>
      )}
    </div>
  );
}
