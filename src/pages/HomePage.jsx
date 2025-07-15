// src/pages/HomePage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useUser } from '../Context/UserContext.jsx';
import { useProgress } from '../Context/ProgressContext.jsx';
import { modulosData } from '../Data/dadosModulos.jsx';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FeedbackModal from '../components/FeedbackModal.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import { isAdmin as checkIsAdmin, isPrivileged as checkIsPrivileged, ROLES } from '../utils/userRoles.js';

export default function HomePage() {
  const { user, loading: userLoading, logout, markFeedbackAsGiven } = useUser();
  const { progress, loading: progressLoading } = useProgress();
  const location = useLocation();
  const navigate = useNavigate();

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
  const [feedbackGivenLocally, setFeedbackGivenLocally] = useState(false);

  const userHasCertificate = useMemo(() => {
    if (!user || !progress || progressLoading) return false;

    const baseModules = ['1', '2', '3', '4'];
    const advancedModules = ['5'];
    let requiredModules = [];

    if (checkIsAdmin(user.role)) {
      requiredModules = Object.keys(modulosData);
    } else if (checkIsPrivileged(user.role)) {
      requiredModules = [...baseModules, ...advancedModules];
    } else {
      requiredModules = baseModules;
    }

    const modulesWithQuizzes = requiredModules.filter(id => modulosData[id]?.teoria2D || modulosData[id]?.simulacao3D);
    const completedRequiredQuizzes = modulesWithQuizzes.filter(id => progress[id]?.completed).length;

    return completedRequiredQuizzes === modulesWithQuizzes.length && modulesWithQuizzes.length > 0;
  }, [user, progress, progressLoading]);

  useEffect(() => {
    if (!userLoading && user && userHasCertificate && user.feedbackPromptDismissed === false) {
      setShowFeedbackPrompt(true);
    } else {
      setShowFeedbackPrompt(false);
    }
    setFeedbackGivenLocally(user?.feedbackPromptDismissed || false);
  }, [user, userLoading, userHasCertificate]);

  useEffect(() => {
    if (location.state?.completedModuleId && location.state?.allCorrect) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const handleOpenFeedbackModal = () => {
    setIsFeedbackModalOpen(true);
  };

  const handleCloseFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
  };

  const onFeedbackSubmitted = async () => {
    if (user?.uid) {
      await markFeedbackAsGiven(user.uid);
      setFeedbackGivenLocally(true);
      setShowFeedbackPrompt(false);
      handleCloseFeedbackModal();
    }
  };

  const modulesToDisplay = useMemo(() => {
    if (!user) return [];
    
    const allModuleIds = Object.keys(modulosData).sort((a, b) => parseInt(a) - parseInt(b));
    
    if (checkIsAdmin(user.role) || checkIsPrivileged(user.role)) {
      return allModuleIds;
    } else {
      return ['1', '2', '3', '4'].filter(id => allModuleIds.includes(id));
    }
  }, [user, modulosData]);

  const totalModules = Object.keys(modulosData).length;
  const completedModulesCount = Object.keys(modulosData).filter(moduleId => progress[moduleId]?.completed).length;

  if (userLoading || progressLoading) {
    return <div className="text-center p-8">Carregando dados do usuário e progresso...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-md mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-800 mb-2 sm:mb-0">Olá, {user?.name || 'Usuário'}!</h1>
        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 sm:gap-4">
          {checkIsAdmin(user?.role) && (
            <Link to="/dashboard" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base">
              Dashboard Adm
            </Link>
          )}
          <Link to="/profile" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base">
            Meu Perfil
          </Link>
          <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base">
            Logout
          </button>
        </div>
      </header>

      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-4">Seu Progresso Geral</h2>
        <ProgressBar value={completedModulesCount} max={totalModules} />
        <p className="text-center mt-2 text-gray-600">Você completou {completedModulesCount} de {totalModules} módulos.</p>
      </div>

      {showFeedbackPrompt && user && userHasCertificate && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          {feedbackGivenLocally ? (
            <p className="text-center text-green-700 text-lg font-semibold animate-fade-in-up">
              Obrigado pelo seu feedback!
            </p>
          ) : (
            <div className={`flex flex-col sm:flex-row items-center justify-center p-4 rounded-lg ${true ? 'bg-blue-50 border border-blue-200 animate-blink' : 'bg-gray-50'}`}>
              <p className="text-blue-800 text-lg font-semibold mb-3 sm:mb-0 sm:mr-4 text-center sm:text-left">
                Seu certificado está pronto! Que tal nos dar um feedback sobre o treinamento?
              </p>
              <button
                onClick={handleOpenFeedbackModal}
                className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                Dar Feedback
              </button>
            </div>
          )}
        </div>
      )}

      {userHasCertificate && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-4">Certificado de Conclusão</h2>
            <p className="text-gray-600 mb-6">Parabéns! Você concluiu os módulos necessários e seu certificado está pronto.</p>
            <Link to="/certificate" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg hover:shadow-xl">
              Emitir Certificado
            </Link>
        </div>
      )}


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {modulesToDisplay.map(id => {
          const modulo = modulosData[id];
          const moduloProgress = progress[id] || {};
          const isCompleted = moduloProgress.completed;

          return (
            <div key={id} className={`bg-white rounded-xl shadow-md p-6 transform transition-transform duration-300 ${isCompleted ? 'border-2 border-green-500' : 'hover:scale-[1.02]'}`}>
              <h2 className="text-xl font-bold text-gray-800 mb-3">{modulo.title}</h2>
              <p className="text-gray-600 text-sm mb-4">{modulo.description}</p>
              <div className="flex justify-between items-center">
                {modulo.teoria2D && (
                  <Link
                    to={`/modulo/${id}/teoria`}
                    className="bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Acessar Teoria
                  </Link>
                )}
                {modulo.simulacao3D && (
                  <Link
                    to={`/modulo/${id}/simulacao`}
                    className="bg-purple-600 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Iniciar Simulação 3D
                  </Link>
                )}
                {isCompleted && (
                  <span className="text-green-500 font-bold text-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      {/* CORREÇÃO AQUI: Caminho SVG corrigido */}
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Concluído!
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={handleCloseFeedbackModal}
        user={user}
        onFeedbackSubmitted={onFeedbackSubmitted}
      />
    </div>
  );
}