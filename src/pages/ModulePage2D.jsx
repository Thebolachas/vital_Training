import React, { useState, useContext, createContext, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { modulosData } from '../Data/dadosModulos.jsx';
import { useUser } from '../Context/UserContext.jsx';
import { useProgress } from '../Context/ProgressContext.jsx';


// O componente ImagemExplicativa não precisa de alterações
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


function Quiz({ questions, moduleId }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const { progress, saveQuizResult } = useProgress();
  
  const [indice, setIndice] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [respondido, setRespondido] = useState(false);
  const [selecionado, setSelecionado] = useState(null);
  const [quizFinalizado, setQuizFinalizado] = useState(false);
  const [showCertificateButton, setShowCertificateButton] = useState(false);
  
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
    const updatedProgress = { 
      ...progress, 
      [moduleId]: { completed: true, score: finalScore, totalQuestions: questions.length } 
    };

    saveQuizResult(moduleId, finalScore, questions.length);
    setQuizFinalizado(true);

    const baseModulesRequired = ['1', '2', '3'];
    const advancedModulesRequired = ['1', '2', '3', '4', '5'];
    const privilegedRoles = ['Médico(a)', 'Residente', 'Estudante'];
    const isPrivilegedUser = user && privilegedRoles.includes(user.role);

    let allRequiredDone = false;
    if (isPrivilegedUser && moduleId === '5') {
      allRequiredDone = advancedModulesRequired.every(id => updatedProgress[id]?.completed);
    } else if (user?.role === 'Enfermagem' && moduleId === '3') {
      allRequiredDone = baseModulesRequired.every(id => updatedProgress[id]?.completed);
    }
    
    if (allRequiredDone) {
      setShowCertificateButton(true);
    }
  };

  const proxima = () => {
    if (indice + 1 < questions.length) {
      setIndice(indice + 1);
      setRespondido(false);
      setSelecionado(null);
    } else {
      handleFinishQuiz();
    }
  };
  
  if (quizFinalizado) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-lg text-center animate-fade-in-up">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">Módulo Concluído!</h2>
          <p className="text-lg mb-6">Você acertou {acertos} de {questions.length} perguntas.</p>
          
          {showCertificateButton && (
            <Link 
              to="/certificate"
              className="w-full block bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl mb-4"
            >
              Gerar Certificado de Conclusão
            </Link>
          )}

          <button
            onClick={() => navigate('/home')}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar à Seleção de Módulos
          </button>
      </div>
    );
  }

  // --- CORREÇÃO: O CÓDIGO JSX QUE FALTAVA ESTÁ ABAIXO ---
  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg">
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


function ModuleContainer({ modulo }) {
  const [etapa, setEtapa] = useState("teoria");
  const abas = ["teoria", "imagens", "quiz"];
  const activeTabClasses = { blue: 'border-b-4 border-blue-500 text-blue-600', pink: 'border-b-4 border-pink-500 text-pink-600', purple: 'border-b-4 border-purple-500 text-purple-600', teal: 'border-b-4 border-teal-500 text-teal-600' };
  const renderEtapa = () => { switch (etapa) { case "teoria": return modulo.teoria(); case "imagens": return <ImagemExplicativa imagens={modulo.imagens} onGoToQuiz={() => setEtapa('quiz')} moduloId={modulo.id} />; case "quiz": return <Quiz questions={modulo.quiz} moduleId={modulo.id} />; default: return null; } };
  
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
      <div className="mb-6 flex justify-center border-b-2 border-gray-200">
        {abas.map(aba => {
          if (modulo[aba] === undefined || (Array.isArray(modulo[aba]) && modulo[aba].length === 0)) {
              return null;
          }
          let tabLabel;
          if (aba === 'imagens') {
            tabLabel = modulo.id === 'médico' ? 'Análise de Imagem (estudo de caso)' : 'Imagens Explicativas';
          } else {
            tabLabel = aba.charAt(0).toUpperCase() + aba.slice(1);
          }
          return (
            <button
              key={aba}
              onClick={() => setEtapa(aba)}
              className={`py-2 px-6 text-lg font-semibold transition-colors duration-300 ${etapa === aba ? activeTabClasses[modulo.color] || 'border-b-4 border-gray-500 text-gray-600' : "text-gray-500 hover:text-gray-900"}`}
            >
              {tabLabel}
            </button>
          );
        })}
      </div>
      <div>{renderEtapa()}</div>
    </div>
  );
}

export default function ModulePage2D() {
  const { id } = useParams();
  const moduloData = modulosData[id];
  if (!moduloData || !moduloData.teoria2D) { return <div className="text-center p-10"><h2>Conteúdo não encontrado ou indisponível.</h2><Link to="/">Voltar</Link></div>; }
  const moduloParaRenderizar = { id, title: moduloData.title, color: moduloData.color, ...moduloData.teoria2D };
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <header className="flex justify-between items-center mb-10 pb-4 border-b-2 border-gray-200"><h1 className="text-3xl font-bold text-gray-800">{moduloData.title}</h1><Link to="/home" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Voltar</Link></header>
      <main><ModuleContainer modulo={moduloParaRenderizar} /></main>
    </div>
  );
}