// src/components/QuizModulo3.jsx
import React, { useState } from "react";

const perguntas = [
  {
    pergunta: "Qual é o principal benefício do uso do iCTG em áreas remotas?",
    opcoes: [
      "Custo elevado de operação",
      "Portabilidade e acesso remoto aos dados",
      "Necessidade de infraestrutura hospitalar",
      "Alta complexidade de uso"
    ],
    correta: 1
  },
  {
    pergunta: "Em qual situação abaixo o iCTG foi usado com sucesso em domicílio?",
    opcoes: [
      "Paciente com infarto",
      "Gestante com acompanhamento de alto risco",
      "Paciente com apendicite",
      "Gestante no segundo mês de gestação"
    ],
    correta: 1
  },
  {
    pergunta: "Qual é uma boa prática ao usar o iCTG?",
    opcoes: [
      "Manter o celular próximo para melhor conexão",
      "Posicionar os sensores sem verificar o sinal fetal",
      "Utilizar com sensores mal posicionados",
      "Verificar a carga do dispositivo e conexão Bluetooth"
    ],
    correta: 3
  }
];

export default function QuizModulo3({ onFinalizar }) {
  const [atual, setAtual] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [respondido, setRespondido] = useState(false);
  const [respostaCerta, setRespostaCerta] = useState(null);

  const perguntaAtual = perguntas[atual];

  const responder = (index) => {
    if (respondido) return;
    setRespondido(true);
    setRespostaCerta(index === perguntaAtual.correta);
    if (index === perguntaAtual.correta) setAcertos(acertos + 1);
  };

  const proxima = () => {
    if (atual + 1 < perguntas.length) {
      setAtual(atual + 1);
      setRespondido(false);
      setRespostaCerta(null);
    } else {
      onFinalizar(acertos);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">
        Pergunta {atual + 1} de {perguntas.length}
      </h2>
      <p className="text-lg mb-6">{perguntaAtual.pergunta}</p>
      <ul className="space-y-3">
        {perguntaAtual.opcoes.map((opcao, i) => (
          <li
            key={i}
            onClick={() => responder(i)}
            className={`p-3 border rounded cursor-pointer hover:bg-gray-100 ${
              respondido
                ? i === perguntaAtual.correta
                  ? "bg-green-100"
                  : i === respostaCerta
                  ? "bg-red-100"
                  : ""
                : ""
            }`}
          >
            {opcao}
          </li>
        ))}
      </ul>
      {respondido && (
        <button
          onClick={proxima}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Próxima
        </button>
      )}
    </div>
  );
}
