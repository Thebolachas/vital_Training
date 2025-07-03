// src/components/QuizModulo2.jsx
import React, { useState } from 'react';

export default function QuizModulo2() {
  const [resposta, setResposta] = useState('');
  const [resultado, setResultado] = useState(null);

  const handleSubmit = () => {
    if (resposta === 'b') {
      setResultado('Correto!');
    } else {
      setResultado('Resposta incorreta. A correta é (b).');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Quiz - Operação do iCTG</h2>
      <p>1. Qual tecnologia conecta o iCTG ao sistema central?</p>
      <div className="space-y-2">
        <label><input type="radio" name="q1" value="a" onChange={(e) => setResposta(e.target.value)} /> a) Bluetooth</label><br />
        <label><input type="radio" name="q1" value="b" onChange={(e) => setResposta(e.target.value)} /> b) Wi-Fi e VPN</label><br />
        <label><input type="radio" name="q1" value="c" onChange={(e) => setResposta(e.target.value)} /> c) Infravermelho</label>
      </div>
      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">Responder</button>
      {resultado && <p className="font-semibold">{resultado}</p>}
    </div>
  );
}
