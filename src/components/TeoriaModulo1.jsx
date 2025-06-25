// src/modules/Modulo1/TeoriaModulo1.jsx
import React from "react";
import { FaBoxOpen, FaTabletAlt, FaBatteryHalf, FaBluetooth, FaExchangeAlt } from "react-icons/fa";

export default function TeoriaModulo1() {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg text-gray-800">
      <h2 className="text-2xl font-bold mb-4">📦 Módulo 1: Conteúdo da Embalagem e Instalação Inicial</h2>
      <p className="mb-4">O iCTG é fornecido com todos os itens essenciais para seu uso imediato. Abaixo estão os componentes:</p>
      <ul className="list-disc pl-5 mb-6">
        <li><FaBoxOpen className="inline mr-2 text-blue-600" />1 Transdutor Fetal (FHR)</li>
        <li><FaBoxOpen className="inline mr-2 text-blue-600" />1 Transdutor de Contração Uterina (TOCO)</li>
        <li><FaTabletAlt className="inline mr-2 text-green-600" />1 App para tablet</li>
        <li><FaBatteryHalf className="inline mr-2 text-yellow-600" />1 Carregador AC bivolt</li>
        <li><FaBoxOpen className="inline mr-2 text-pink-600" />1 Bolsa de transporte</li>
      </ul>
      <h3 className="text-xl font-semibold mb-2">⚙️ Especificações Técnicas</h3>
      <ul className="list-disc pl-5">
        <li><FaBatteryHalf className="inline mr-2 text-purple-600" />Carregamento: 1h → 6~10h de uso contínuo</li>
        <li><FaBluetooth className="inline mr-2 text-blue-400" />Conexão: Bluetooth 4.1 LE</li>
        <li><FaExchangeAlt className="inline mr-2 text-red-600" />Faixa: 127~197 (TOCO), 115~160 (FHR)</li>
      </ul>
    </div>
  );
}