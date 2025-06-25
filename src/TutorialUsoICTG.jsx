import { useState } from "react";


// Substitutos simples para os componentes visuais
const Button = ({ children, ...props }) => (
  <button
    {...props}
    className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-blue-700 transition"
  >
    {children}
  </button>
);

const Card = ({ children }) => (
  <div className="bg-white p-6 shadow-md rounded-xl w-full max-w-4xl">
    {children}
  </div>
);

const CardContent = ({ children }) => <div>{children}</div>;

// Lista das imagens e textos
const imagens = [
  {
    src: "/print/0_ínicio.png",
    titulo: "Início do Dispositivo",
    descricao:
      "Este é o início do uso do monitor fetal iCTG. Apresentamos os dois transdutores: um para batimentos cardíacos e outro para contrações uterinas.",
  },
  {
    src: "/print/10_adptadorAC.png",
    titulo: "Adaptador AC",
    descricao:
      "Utilize o adaptador AC para carregar os dispositivos antes do uso.",
  },
  {
    src: "/print/14_conecte_os_cabos_.png",
    titulo: "Conectando os Cabos",
    descricao:
      "Conecte os cabos de ramificação e o adaptador de conversão ao transdutor.",
  },
  {
    src: "/print/19_ligar-tablet.png",
    titulo: "Ligue o Tablet",
    descricao:
      "Ligue o tablet e abra o aplicativo 'fetal monitor Petit CTG'.",
  },
  {
    src: "/print/23_add_paciente.png",
    titulo: "Cadastro do Paciente",
    descricao:
      "Acesse o menu e adicione um novo paciente com os dados básicos.",
  },
  {
    src: "/print/27_ligar_transdutores.png",
    titulo: "Ligue os Transdutores",
    descricao:
      "Pressione o botão de ligar por 3 segundos em cada transdutor.",
  },
  {
    src: "/print/29_conexão_correta.png",
    titulo: "Conexão Bluetooth",
    descricao:
      "Verifique se a conexão foi feita. Um ícone de check deve aparecer.",
  },
  {
    src: "/print/34_passar_gel_nesse.png",
    titulo: "Aplicar Gel",
    descricao:
      "Aplique o gel apenas no transdutor de batimentos cardíacos.",
  },
  {
    src: "/print/38_colocar-cinta.png",
    titulo: "Fixação com Cinta",
    descricao:
      "Use a cinta abdominal para fixar o transdutor. Não aperte demais.",
  },
  {
    src: "/print/45_definir_tempo_iniciar_medicao.png",
    titulo: "Início da Medição",
    descricao:
      "Selecione a duração (ex: 40 min), toque em iniciar e relaxe.",
  },
  {
    src: "/print/49_retirar_limpar.png",
    titulo: "Encerramento",
    descricao:
      "Ao finalizar, remova os transdutores, limpe-os e desligue.",
  },
];

export default function TutorialICTG() {
  const [index, setIndex] = useState(0);

  const next = () => {
    if (index < imagens.length - 1) setIndex(index + 1);
  };

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <Card>
        <CardContent className="flex flex-col items-center">
          <img
            src={imagens[index].src}
            alt={imagens[index].titulo}
            className="rounded-xl border w-full max-w-xl shadow mb-4"
          />
          <h2 className="text-xl font-semibold text-center">
            {imagens[index].titulo}
          </h2>
          <p className="text-gray-700 text-center mt-2 mb-6">
            {imagens[index].descricao}
          </p>
          <div className="flex gap-4 justify-center">
            <Button disabled={index === 0} onClick={prev}>
              Anterior
            </Button>
            <Button disabled={index === imagens.length - 1} onClick={next}>
              Próximo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
