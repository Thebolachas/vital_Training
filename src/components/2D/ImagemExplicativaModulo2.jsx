import React from "react";

const componentes = [
  {
    titulo: "Transdutor Fetal (FHR)",
    imagem: "/print/ICTG_imagens/1_transdutor_batimento.png",
    descricao: "Detecta e transmite os batimentos cardíacos fetais com precisão."
  },
  {
    titulo: "Transdutor de Contração Uterina (TOCO)",
    imagem: "/print/ICTG_imagens/5_transdutorcontracoes.png",
    descricao: "Monitora as contrações uterinas em tempo real."
  },
  {
    titulo: "App para Tablet",
    imagem: "/print/ICTG_imagens/4_volumeapp.png",
    descricao: "Interface digital para controle e visualização dos dados do iCTG."
  },
  {
    titulo: "Carregador AC Bivolt",
    imagem: "/print/ICTG_imagens/10_adaptadorAC.png",
    descricao: "Carregador compatível com diferentes voltagens, ideal para mobilidade."
  }
];

const especificacoesTecnicas = [
  {
    titulo: "Carregamento",
    detalhe: "1h → 6~10h de uso contínuo"
  },
  {
    titulo: "Conexão",
    detalhe: "Bluetooth 4.1 LE"
  },
  {
    titulo: "Faixa de Detecção",
    detalhe: "127~197 (TOCO), 115~160 (FHR)"
  }
];

export default function ImagemExplicativaModulo2() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📸 Imagem Explicativa – Módulo 2</h2>
      <p className="mb-6">
        Explore visualmente os principais componentes do iCTG apresentados neste módulo:
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

      <div className="mt-10">
        <h3 className="text-xl font-bold mb-3">⚙️ Especificações Técnicas</h3>
        <ul className="list-disc ml-6">
          {especificacoesTecnicas.map((spec, i) => (
            <li key={i}>
              <strong>{spec.titulo}:</strong> {spec.detalhe}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
