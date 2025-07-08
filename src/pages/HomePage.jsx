// src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { modulosData } from '../Data/dadosModulos.jsx';
import { useUser } from '../Context/UserContext.jsx';
import { useProgress } from '../Context/ProgressContext.jsx';
import FeedbackModal from '../components/FeedbackModal.jsx';
import { db } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

const ProgressStatus = ({ user, progress, showFeedbackPrompt }) => {
  if (!user) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-blue-50 p-6 rounded-xl text-center border border-blue-200">
        <h3 className="text-xl font-bold text-blue-800 mb-2">Bem-vindo(a) ao TreinaFácil!</h3>
        <p className="text-blue-700">
          <Link to="/login" className="font-bold underline hover:text-blue-900">Faça o login</Link> para salvar seu progresso e ter acesso a todos os módulos.
        </p>
      </div>
    );
  }

  const baseModules = ['1', '2', '3', '4'];
  const advancedModules = ['5'];
  const privilegedRoles = ['Médico(a)', 'Residente', 'Estudante'];
  const isPrivileged = privilegedRoles.includes(user.role);

  let requiredModules = [];

  if (user.role === 'Adm') {
    requiredModules = Object.keys(modulosData);
  } else if (isPrivileged) {
    requiredModules = [...baseModules, ...advancedModules];
  } else {
    requiredModules = baseModules;
  }

  const modulesWithQuizzes = requiredModules.filter(id => modulosData[id]?.teoria2D || modulosData[id]?.simulacao3D);
  const completedCount = modulesWithQuizzes.filter(id => progress[id]?.completed).length;
  const totalCount = modulesWithQuizzes.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  let progressMessage = `Você completou ${completedCount} de ${totalCount} módulos.`;
  if (totalCount > 0) {
    if (completedCount === totalCount) {
      progressMessage = `Parabéns! Você concluiu todos os ${totalCount} módulos.`;
    } else {
      progressMessage = `Você está ${completionPercentage.toFixed(0)}% mais perto de dominar a plataforma! (${completedCount} de ${totalCount} módulos)`;
    }
  } else {
    progressMessage = "Inicie seu treinamento para acompanhar seu progresso.";
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Seu Progresso de Treinamento</h3>
      <div className="mb-2">
        <div className="flex justify-between font-semibold text-gray-700 mb-1">
          <span>Progresso</span>
          <span>{progressMessage}</span>
        </div>
        {showFeedbackPrompt && (
          <p className="text-orange-600 font-bold text-lg text-center mt-2 animate-blink">
            🎉 Agora que você completou o curso, nos dê um feedback!
          </p>
        )}
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage || 0}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  const { user, logout, setUser } = useUser();
  const { progress } = useProgress();
  const navigate = useNavigate();
  const location = useLocation();
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
  
  const [isUserPanelVisible, setIsUserPanelVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  // Lógica de filtragem para os módulos visíveis por função
  const modulosVisiveis = Object.keys(modulosData).filter(id => {
    if (user?.role === 'Adm') return true; // Admin vê todos os módulos

    if (user?.role === 'Enfermagem') {
      return id !== '5' && id !== 'médico'; // Limita aos módulos 1 a 4
    }

    return true; // Caso contrário, mostra os módulos disponíveis para o usuário
  });

  useEffect(() => {
    if (location.state && location.state.completedModuleId) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleFeedbackSubmittedAndClearPrompt = async () => {
    setFeedbackModalOpen(false);
    if (user && user.uid) {
      const userDocRef = doc(db, 'users', user.uid);
      try {
        await updateDoc(userDocRef, {
          feedbackPromptDismissed: true,
        });
        setUser(prevUser => ({ ...prevUser, feedbackPromptDismissed: true }));
      } catch (error) {
        console.error("Erro ao marcar prompt de feedback como dispensado:", error);
      }
    }
    setShowFeedbackPrompt(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const checkCompletionForCertificate = () => {
    if (!user) return false;
    const baseModulesForCert = ['1', '2', '3', '4'];

    const modulesWithQuizzesForCertificate = baseModulesForCert.filter(id => modulosData[id]?.teoria2D || modulosData[id]?.simulacao3D);
    const completedCountForCertificate = modulesWithQuizzesForCertificate.filter(id => progress[id]?.completed).length;

    return completedCountForCertificate === modulesWithQuizzesForCertificate.length && modulesWithQuizzesForCertificate.length > 0;
  };

  const showCertificateLink = user && checkCompletionForCertificate();

  return (
    <>
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        user={user}
        isObligatory={false}
        onFeedbackSubmitted={handleFeedbackSubmittedAndClearPrompt}
        userNameForFeedback={user?.name}
      />
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-30">
          <h1 className="text-xl font-bold text-gray-800">Olá, {user?.name ? user.name.split(' ')[0] : 'Visitante'}!</h1>
          <div className="flex items-center gap-4">
            {user && user.role === 'Adm' && (
              <Link to="/dashboard" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                Voltar ao Dashboard
              </Link>
            )}
            {user && user.role !== 'Adm' && (
              <button
                onClick={() => setFeedbackModalOpen(true)}
                className={`bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors ${showFeedbackPrompt ? 'animate-blink' : ''}`}
              >
                Dar Feedback
              </button>
            )}
            {showCertificateLink && (
              <Link to="/certificate" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg">
                Ver Certificado
              </Link>
            )}
            {user?.role === 'Adm' && (
              <span className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-2.5 py-0.5 rounded">
                MODO ADMINISTRADOR
              </span>
            )}
            {user ? (
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg">Logout</button>
            ) : (
              <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg">Fazer Login</Link>
            )}
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <main className="py-8">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-black text-gray-800 mb-2">Plataforma de Treinamento monitor fetal iCTG</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">Escolha um módulo para iniciar seu aprendizado.</p>
            </div>

            <ProgressStatus user={user} progress={progress} showFeedbackPrompt={showFeedbackPrompt} />

            <div className="text-center mb-4">
              <button
                onClick={() => setIsUserPanelVisible(!isUserPanelVisible)}
                className="bg-blue-600 text-white p-3 rounded-md transition-all transform hover:scale-105"
              >
                {isUserPanelVisible ? 'Ocultar Dados' : 'Ver Dados do Usuário'}
              </button>
            </div>

            {isUserPanelVisible && (
              <div className="space-y-6 mt-4 transition-all ease-in-out duration-500 transform opacity-100">
                <div>
                  <h3 className="font-semibold text-lg text-gray-700">Dados de Cadastro</h3>
                  <p><strong>Nome:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-gray-700">Mudar Senha</h3>
                  {isEditingPassword ? (
                    <div>
                      <input
                        type="password"
                        placeholder="Nova senha"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                      />
                      <button
                        onClick={handlePasswordChange}
                        className="mt-2 bg-blue-600 text-white p-3 rounded-md"
                      >
                        Alterar Senha
                      </button>
                      {error && <p className="text-red-500 mt-2">{error}</p>}
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditingPassword(true)}
                      className="bg-blue-600 text-white p-3 rounded-md"
                    >
                      Editar Senha
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="w-full max-w-4xl mx-auto space-y-8">
              {modulosVisiveis.map(id => (
                <div key={id} className="p-6 rounded-xl shadow-lg border bg-white border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold mb-4">{modulosData[id].title}</h2>
                    {progress[id]?.completed && (
                      <span className="text-green-500 font-bold text-2xl" title="Módulo Concluído!">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    {modulosData[id].teoria2D && (
                      <Link
                        to={`/modulo/${id}/teoria`}
                        className="flex-1 text-center bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105"
                      >
                        Ver Teoria
                      </Link>
                    )}
                    {modulosData[id].simulacao3D && (
                      <Link
                        to={`/modulo/${id}/simulacao`}
                        className="flex-1 text-center bg-cyan-500 text-black font-semibold py-3 px-6 rounded-lg hover:bg-cyan-400 transition-all transform hover:scale-105"
                      >
                        Iniciar Simulação
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
