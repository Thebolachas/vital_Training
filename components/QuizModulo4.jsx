import React, { useState } from 'react';

const perguntas = [
  {
    pergunta: 'Por que é importante calibrar o iCTG antes do uso?',
    opcoes: ['Não é necessário', 'Para evitar erros de leitura', 'Para limpar o dispositivo', 'Por padrão do hospital'],
    resposta: 1,
  },
  {
    pergunta: 'Qual é um erro comum ao usar o iCTG?',
    opcoes: ['Desligá-lo após o uso', 'Posicionar incorretamente os sensores', 'Conferir os batimentos', 'Salvar os dados'],
    resposta: 1,
  },
  {
    pergunta: 'Antes de aplicar, deve-se:',
    opcoes: ['Resetar o aparelho', 'Aplicar álcool', 'Fazer checklist de segurança', 'Checar o prontuário'],
    resposta: 2,
  },
];

export default function QuizModulo4({ onFinalizar }) {
  const [indice, setIndice] = useState(0);
  const [acertos, setAcertos] = useState(0);

  const responder = (opcao) => {
    if (opcao === perguntas[indice].resposta) setAcertos(acertos + 1);
    const proxima = indice + 1;
    if (proxima < perguntas.length) {
      setIndice(proxima);
    } else {
      onFinalizar(acertos + (opcao === perguntas[indice].resposta ? 1 : 0));
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h3 className="text-xl font-bold mb-4">{perguntas[indice].pergunta}</h3>
      <div className="space-y-2">
        {perguntas[indice].opcoes.map((opcao, idx) => (
          <button
            key={idx}
            onClick={() => responder(idx)}
            className="block w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {opcao}
          </button>
        ))}
      </div>
    </div>
  );
}
