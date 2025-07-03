import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { modulosData } from '../Data/dadosModulos.jsx';
import { useUser } from '../Context/UserContext.jsx';
import { useProgress } from '../Context/ProgressContext.jsx';
import FeedbackModal from '../components/FeedbackModal.jsx';

const ProgressStatus = ({ user, progress }) => {
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

  const baseModules = ['1', '2', '3', '4']; // Base módulos (todos acessíveis para a maioria dos usuários)
  const advancedModules = ['4', '5']; // IDs dos módulos avançados
  const privilegedRoles = ['Médico(a)', 'Residente', 'Estudante'];
  const isPrivileged = privilegedRoles.includes(user.role);

  let requiredModules = [];

  // Lógica para determinar os módulos relevantes para cada perfil
  if (user.role === 'Adm') { // Se o usuário for 'Adm', considere todos os módulos
    requiredModules = Object.keys(modulosData);
  } else if (isPrivileged) { // Se for um perfil privilegiado, inclui módulos base e avançados
    requiredModules = [...baseModules, ...advancedModules];
  } else { // Para outros perfis (Enfermagem, Outro), apenas módulos base
    requiredModules = baseModules;
  }

  // Filtra módulos que realmente têm quiz (se houver algum módulo sem quiz que não deve contar para o progresso)
  const modulesWithQuizzes = requiredModules.filter(id => modulosData[id]?.teoria2D || modulosData[id]?.simulacao3D);

  // Calcula a contagem de módulos concluídos baseando-se nos módulos que o usuário DEVE fazer
  const completedCount = modulesWithQuizzes.filter(id => progress[id]?.completed).length;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Seu Progresso de Treinamento</h3>
      <div className="mb-2">
        <div className="flex justify-between font-semibold text-gray-700 mb-1">
          <span>Progresso</span>
          <span>{completedCount} de {modulesWithQuizzes.length} módulos concluídos</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / modulesWithQuizzes.length) * 100 || 0}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  const { user, logout } = useUser();
  const { progress } = useProgress();
  const navigate = useNavigate();
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const privilegedRoles = ['Médico(a)', 'Residente', 'Estudante'];
  const restrictedModuleIds = ['5']; // Módulo 5 é restrito a perfis privilegiados
  const specialModuleId = 'médico'; // ID do módulo especial que deve ser oculto para "Enfermagem" e "Outro"

  const modulosVisiveis = Object.keys(modulosData).filter(id => {
    // 'Adm' agora vê todos os módulos
    if (user?.role === 'Adm') return true;

    // Lógica para módulos restritos a perfis privilegiados
    if (restrictedModuleIds.includes(id)) {
      return user && privilegedRoles.includes(user.role);
    }

    // Exclui o "Módulo Especial: Análise Avançada de Cardiotoco" para Enfermagem e Outro
    if (user?.role === 'Enfermagem' || user?.role === 'Outro') {
      return id !== specialModuleId; // Exclui apenas o módulo especial, mas permite o módulo 4
    }

    return true; // Módulos base são visíveis para todos
  });

  return (
    <>
      <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setFeedbackModalOpen(false)} user={user} />
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-30">
          <h1 className="text-xl font-bold text-gray-800">Olá, {user?.name ? user.name.split(' ')[0] : 'Visitante'}!</h1>
          <div>
            {user && user.role !== 'Adm' && ( // Apenas não-Adms podem dar feedback aqui
              <button onClick={() => setFeedbackModalOpen(true)} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors mr-4">
                Dar Feedback
              </button>
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

            <ProgressStatus user={user} progress={progress} />

            <div className="w-full max-w-4xl mx-auto space-y-8">
              {modulosVisiveis.map(id => (
                <div
                  key={id}
                  className={`p-6 rounded-xl shadow-lg border ${modulosData[id].color === 'teal' ? 'bg-teal-50 border-teal-200' : 'bg-white border-gray-200'}`}
                >
                  <div className="flex items-center justify-between">
                    <h2 className={`text-2xl font-bold mb-4 ${modulosData[id].color === 'teal' ? 'text-teal-800' : 'text-gray-800'}`}>
                      {modulosData[id].title}
                    </h2>
                    {progress[id]?.completed && (
                      <span className="text-green-500 font-bold text-2xl" title="Módulo Concluído!">✓</span>
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
