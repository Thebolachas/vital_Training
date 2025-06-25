import React from "react";

export default function TeoriaModulo2() {
  return (
    <div className="space-y-6 text-gray-800">
      <h2 className="text-2xl font-bold text-center">Instalação do iCTG</h2>
      <p>
        O iCTG é fornecido com todos os itens essenciais para uso imediato:
      </p>
      <ul className="list-disc list-inside">
        <li>Transdutor Fetal (FHR)</li>
        <li>Transdutor de Contração Uterina (TOCO)</li>
        <li>App para tablet</li>
        <li>Carregador AC bivolt</li>
        <li>Bolsa de transporte</li>
      </ul>

      <h3 className="text-xl font-semibold mt-6">⚙️ Especificações Técnicas</h3>
      <ul className="list-disc list-inside">
        <li>Carregamento: 1h → 6~10h de uso contínuo</li>
        <li>Conexão: Bluetooth 4.1 LE</li>
        <li>Faixa de leitura: 127~197 (TOCO), 115~160 (FHR)</li>
      </ul>

      <p className="mt-6">
        A instalação é simples: conecte os transdutores aos locais indicados no corpo da paciente, abra o app e conecte via Bluetooth.
      </p>

      <p>
        A interface do aplicativo mostra claramente os batimentos cardíacos fetais e a atividade uterina em tempo real.
      </p>

      <p>
        O dispositivo pode ser usado com cinta para manter os transdutores fixos, garantindo conforto e precisão durante o exame.
      </p>
    </div>
  );
}
