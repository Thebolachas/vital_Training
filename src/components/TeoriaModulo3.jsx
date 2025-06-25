// src/modules/Modulo3/TeoriaModulo3.jsx
import React from "react";
import { FaStopCircle, FaBroom, FaBatteryEmpty } from "react-icons/fa";

export default function TeoriaModulo3() {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg text-gray-800">
      <h2 className="text-2xl font-bold mb-4">🧹 Módulo 3: Finalização, Limpeza e Recarga</h2>
      <p className="mb-4">Após concluir o exame, siga estas recomendações:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li><FaStopCircle className="inline mr-2 text-red-600" />Finalize o exame no app com segurança.</li>
        <li><FaBroom className="inline mr-2 text-green-600" />Remova os transdutores, limpe com solução apropriada.</li>
        <li><FaBatteryEmpty className="inline mr-2 text-yellow-600" />Conecte o carregador para a próxima utilização.</li>
      </ul>
    </div>
  );
}
