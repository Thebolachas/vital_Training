import React from "react";

const componentes = [
  {
    titulo: "Visão geral do iCTG",
    imagem: "/ICTG_imagens/0_inicio.png",
    descricao: "Apresentação geral do dispositivo iCTG."
  },
  {
    titulo: "Transdutor de Batimento Fetal",
    imagem: "/ICTG_imagens/1_transdutor_batimento.png",
    descricao: "Detecta os batimentos cardíacos do feto com precisão."
  },
  {
    titulo: "Ligando o dispositivo",
    imagem: "/ICTG_imagens/2_ligar.png",
    descricao: "Mostra como ligar corretamente o dispositivo iCTG."
  },
  {
    titulo: "Controle de volume",
    imagem: "/ICTG_imagens/3_volume.png",
    descricao: "Ajuste manual do volume do dispositivo."
  },
  {
    titulo: "Ligando o sistema secundário",
    imagem: "/ICTG_imagens/6_ligar2.png",
    descricao: "Ativação do segundo componente do sistema iCTG."
  },
  {
    titulo: "Ajuste de volume via app",
    imagem: "/ICTG_imagens/4_volumenoapp.png",
    descricao: "Configuração de volume diretamente no aplicativo."
  },
  {
    titulo: "Configuração no aplicativo",
    imagem: "/ICTG_imagens/8_configuracao_no_app.png",
    descricao: "Interface digital para controle dos dados e ajustes."
  },
  {
    titulo: "Adaptador AC Bivolt",
    imagem: "/ICTG_imagens/10_adptadorac.png",
    descricao: "Fonte de energia bivolt para alimentação do dispositivo."
  }
];

export default function ImagemExplicativaModulo1() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📸 Imagem Explicativa – Módulo 1</h2>
      <p className="mb-6">
        Explore abaixo os componentes visuais do iCTG e entenda sua instalação e funcionamento:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {componentes.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow">
            <img
              src={item.imagem}
              alt={item.titulo}
              className="w-full h-auto object-contain rounded mb-2"
              onClick={() => alert(item.descricao)}
            />
            <p className="text-center font-semibold">{item.titulo}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
