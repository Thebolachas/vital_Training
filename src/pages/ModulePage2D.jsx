// src/pages/ModulePage2D.jsx
import React, { useState, useContext, createContext, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { modulosData } from '../Data/dadosModulos.jsx'; // Certifique-se que modulosData está importado
import { useUser } from '../Context/UserContext.jsx';
import { useProgress } from '../Context/ProgressContext.jsx'; // Correção na importação

// (Funções ImagemExplicativa e Quiz são componentes auxiliares neste arquivo)

function ImagemExplicativa({ imagens, onGoToQuiz, moduloId }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!imagens || imagens.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <p className="text-gray-500 italic">Nenhum estudo de caso com imagem disponível para este módulo ainda.</p>
        <div className="mt-8">
          <button onClick={onGoToQuiz} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
            Ir para o Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {imagens.map((item, index) => (
          <div key={index} className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow flex flex-col items-center" onClick={() => setSelectedImage(item)}>
            <img src={item.imagem} alt={item.titulo} className="w-full h-40 object-contain rounded mb-2" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/fee2e2/991b1b?text=Imagem+indisponível'; }}/>
            <p className="text-center font-semibold text-gray-700 mt-auto">{item.titulo}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center"><button onClick={onGoToQuiz} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">Ir para o Quiz</button></div>
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setSelectedImage(null)}>
          <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <img src={selectedImage.imagem} alt={selectedImage.titulo} className="w-full h-auto object-contain rounded mb-4 max-h-[60vh]"/>
            <h3 className="text-2xl font-bold mb-2 text-gray-800">{selectedImage.titulo}</h3>
            <p className="text-gray-600">{selectedImage.descricao}</p>
            <button onClick={() => setSelectedImage(null)} className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold transition-colors">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Quiz({ questions, moduloId }) { // Nome do parâmetro corrigido de 'moduleId' para 'moduloId'
  const navigate = useNavigate();
  const { user } = useUser();
  const { progress, saveQuizResult } = useProgress();

  const [indice, setIndice] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [respondido, setRespondido] = useState(false);
  const [selecionado, setSelecionado] = useState(null);
  const [quizFinalizado, setQuizFinalizado] = useState(false);
  const [showCertificateButton, setShowCertificateButton] = useState(false);
  const [podeRefazer, setPodeRefazer] = useState(false);

  // Lógica para encontrar o próximo módulo
  const allModuleIds = Object.keys(modulosData).sort((a, b) => parseInt(a) - parseInt(b));
  const currentModuleIndex = allModuleIds.indexOf(moduloId); // Usar moduloId
  const nextModuleId = currentModuleIndex !== -1 && currentModuleIndex < allModuleIds.length - 1
                       ? allModuleIds[currentModuleIndex + 1]
                       : null;
  const nextModuleTitle = nextModuleId ? modulosData[nextModuleId]?.title : null;
  const nextModulePath = nextModuleId ? `/modulo/${nextModuleId}/teoria` : '/home';


  const perguntaAtual = questions[indice];

  const verificarResposta = (i) => {
    if (respondido) return;
    setSelecionado(i);
    setRespondido(true);
    if (i === perguntaAtual.correta) {
      setAcertos(prev => prev + 1);
    }
  };

  const handleFinishQuiz = () => {
    const finalScore = respondido ? (selecionado === perguntaAtual.correta ? acertos + 1 : acertos) : acertos;
    const acertouTudo = finalScore === questions.length;

    // LÓGICA ESPECIAL PARA ADMINISTRADOR: NÃO COMPUTA PROGRESSO, SEMPRE PODE REFAZER
    if (user?.role === 'Adm') {
      setPodeRefazer(true);
      setQuizFinalizado(true);
      setShowCertificateButton(true); // Adm sempre pode ver o certificado (se quiser testar o fluxo)
      // Navega para a home com estado, mesmo sendo Adm
      navigate('/home', { state: { completedModuleId: moduloId, allCorrect: acertouTudo } }); // Usar moduloId
      return;
    }
    
    // Lógica normal para outros usuários: Salva o progresso
    saveQuizResult(moduloId, finalScore, questions.length); // Usar moduloId

    if (!acertouTudo) {
      setPodeRefazer(true);
    }
    setQuizFinalizado(true);

    // Lógica do botão de certificado para usuários não-Adm:
    const baseModulesRequired = ['1', '2', '3', '4'];
    const advancedModulesRequired = ['5'];
    const privilegedRoles = ['Médico(a)', 'Residente', 'Estudante'];
    const isPrivilegedUser = user && privilegedRoles.includes(user.role);

    let allRequiredDone = false;
    if (user?.role === 'Adm') {
      allRequiredDone = Object.keys(modulosData).every(id => progress[id]?.completed);
    } else if (isPrivilegedUser) {
      allRequiredDone = [...baseModulesRequired, ...advancedModulesRequired].every(id => progress[id]?.completed);
    } else {
      allRequiredDone = baseModulesRequired.every(id => progress[id]?.completed);
    }

    if (allRequiredDone) {
      setShowCertificateButton(true);
    }
    // NOVO: Navega para a home com estado para usuários não-Adm também
    navigate('/home', { state: { completedModuleId: moduloId, allCorrect: acertouTudo } }); // Usar moduloId
  };

  const proxima = () => {
    if (indice + 1 < questions.length) {
      setIndice(indice + 1);
      setRespondido(false);
      setSelecionado(null);
    } else {
      handleFinishQuiz(); // Chama handleFinishQuiz que agora faz a navegação
    }
  };

  const refazerQuiz = () => {
    // Resetando todos os estados
    setIndice(0);
    setAcertos(0);
    setRespondido(false);
    setSelecionado(null);
    setQuizFinalizado(false);
    setPodeRefazer(false); // Desabilitando o botão de refazer até o quiz ser finalizado
  };

  if (quizFinalizado) {
    const userName = user?.name ? user.name.split(' ')[0] : 'colega';
    const finalMessage = acertouTudo
      ? `Incrível, ${userName}! Você dominou este módulo!`
      : `Mais uma etapa vencida, ${userName}, continue assim!`;

    return (
      <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-lg text-center animate-fade-in-up">
        {/* Aplica a nova classe de animação ao texto da mensagem final */}
        <h2 className="text-3xl font-bold mb-4 text-blue-600 animate-bounce-in-text">{finalMessage}</h2>
        <p className="text-lg mb-6">Você acertou {acertos} de {questions.length} perguntas.</p>

        {user?.role === 'Adm' && (
          <p className="text-sm text-yellow-800 bg-yellow-100 p-2 rounded mb-4">
            Este resultado não foi computado em seu progresso geral (Modo Administrador).
          </p>
        )}

        {podeRefazer && (
          <button
            onClick={refazerQuiz}
            className="w-full mb-4 bg-yellow-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Refazer Quiz
          </button>
        )}

        {showCertificateButton && (
          <Link
            to="/certificate"
            className="w-full block bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl mb-4"
          >
            Gerar Certificado de Conclusão
          </Link>
        )}
        
        {/* Este botão de navegação foi removido daqui e a navegação agora acontece no handleFinishQuiz */}
        {/* Se quiser manter um botão para "voltar para seleção de módulos" para casos onde não há próximo módulo ou não houve acerto total, você pode adicionar aqui novamente */}
        {/* O handleFinishQuiz já navega, então o user já estará na HomePage */}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {user?.role === 'Adm' && (
        <p className="text-sm text-yellow-800 bg-yellow-100 p-2 rounded mb-4">
          MODO ADMINISTRADOR: Testando Quiz. Este resultado não será salvo.
        </p>
      )}
      <p className="text-sm text-gray-500 mb-2">Pergunta {indice + 1} de {questions.length}</p>
      <h2 className="text-xl font-bold mb-4">{perguntaAtual.pergunta}</h2>
      <div className="space-y-3">
        {perguntaAtual.opcoes.map((op, i) => (
          <button
            key={i}
            onClick={() => verificarResposta(i)}
            disabled={respondido}
            className={`block w-full text-left p-4 rounded-lg border-2 transition-all text-gray-700 ${
              respondido
                ? i === perguntaAtual.correta
                  ? 'bg-green-100 border-green-500 font-bold'
                  : i === selecionado
                    ? 'bg-red-100 border-red-500'
                    : 'bg-gray-100 border-gray-300'
                : 'bg-white border-gray-300 hover:bg-blue-50 hover:border-blue-400'
            }`}
          >
            {op}
          </button>
        ))}
      </div>
      {respondido && (
        <div className={`mt-4 p-4 rounded-lg ${selecionado === perguntaAtual.correta ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'}`}>
          <p className="font-semibold">{selecionado === perguntaAtual.correta ? 'Resposta Correta!' : 'Resposta Incorreta.'}</p>
          <p className="text-sm mt-1">{perguntaAtual.feedback}</p>
        </div>
      )}
      {respondido && (
        <button
          onClick={proxima}
          className="mt-6 w-full px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
        >
          {indice + 1 < questions.length ? 'Próxima Pergunta' : 'Ver Resultado Final'}
        </button>
      )}
    </div>
  );
}

// Componente principal do MóduloPage2D
export default function ModulePage2D() {
  const { id } = useParams();
  const moduloData = modulosData[id];
  const [etapa, setEtapa] = useState("teoria"); // Estado local para a etapa atual

  if (!moduloData || !moduloData.teoria2D) {
    return (
      <div className="text-center p-10 bg-gray-100 min-h-screen flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-gray-700">Conteúdo não encontrado ou indisponível.</h2>
        <Link to="/home" className="mt-4 text-blue-600 hover:underline">Voltar</Link>
      </div>
    );
  }

  // Prepara o conteúdo do módulo com base nos dados do modulosData
  const moduloParaRenderizar = {
    id: id,
    title: moduloData.title,
    color: moduloData.color,
    teoria: () => moduloData.teoria2D.teoria(),
    imagens: moduloData.teoria2D.imagens,
    quiz: moduloData.teoria2D.quiz
  };

  const activeTabClasses = { 
    blue: 'border-b-4 border-blue-500 text-blue-600', 
    pink: 'border-b-4 border-pink-500 text-pink-600', 
    purple: 'border-b-4 border-purple-500 text-purple-600', 
    teal: 'border-b-4 border-teal-500 text-teal-600',
    orange: 'border-b-4 border-orange-500 text-orange-600', // Adicionado para Módulo 4
  };

  const renderEtapa = () => {
    switch (etapa) {
      case "teoria": return moduloParaRenderizar.teoria();
      case "imagens": return <ImagemExplicativa imagens={moduloParaRenderizar.imagens} onGoToQuiz={() => setEtapa('quiz')} moduloId={moduloParaRenderizar.id} />;
      case "quiz": return <Quiz questions={moduloParaRenderizar.quiz} moduloId={moduloParaRenderizar.id} />; // Passar moduloId aqui
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <header className="flex justify-between items-center mb-10 pb-4 border-b-2 border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800">{moduloData.title}</h1>
        <Link to="/home" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Voltar</Link>
      </header>
      <main>
        <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
          <div className="mb-6 flex justify-center border-b-2 border-gray-200">
            {["teoria", "imagens", "quiz"].map(aba => {
              // Somente renderiza a aba se o conteúdo existir
              if (!moduloParaRenderizar[aba] || (Array.isArray(moduloParaRenderizar[aba]) && moduloParaRenderizar[aba].length === 0)) return null;
              
              let tabLabel = aba === 'imagens'
                ? (moduloParaRenderizar.id === 'médico' ? 'Análise de Imagem (estudo de caso)' : 'Imagens Explicativas')
                : aba.charAt(0).toUpperCase() + aba.slice(1); // Capitaliza a primeira letra

              return (
                <button
                  key={aba}
                  onClick={() => setEtapa(aba)}
                  className={`py-2 px-6 text-lg font-semibold transition-colors duration-300 ${etapa === aba ? activeTabClasses[moduloParaRenderizar.color] || 'border-b-4 border-gray-500 text-gray-600' : "text-gray-500 hover:text-gray-900"}`}
                >
                  {tabLabel}
                </button>
              );
            })}
          </div>
          <div>{renderEtapa()}</div>
        </div>
      </main>
    </div>
  );
}
