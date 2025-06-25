import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { modulosData } from '../Data/dadosModulos.jsx';
import { useUser } from '../Context/UserContext.jsx';
import { useProgress } from '../Context/ProgressContext.jsx';

const ProgressStatus = ({ user, progress }) => {
  if (!user) return null;

  const baseModules = ['1', '2', '3'];
  const advancedModules = ['4', '5'];
  const privilegedRoles = ['Médico(a)', 'Residente', 'Estudante'];
  
  const isPrivileged = privilegedRoles.includes(user.role);
  const requiredModules = isPrivileged ? [...baseModules, ...advancedModules] : baseModules;
  const completedCount = requiredModules.filter(id => progress[id]?.completed).length;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Seu Progresso</h3>
      <div className="mb-2">
        <span className="font-semibold">{completedCount} de {requiredModules.length} módulos concluídos</span>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(completedCount / requiredModules.length) * 100}%` }}></div>
        </div>
      </div>
      <ul className="list-inside list-disc space-y-1 text-gray-600">
        {requiredModules.map(id => (
          <li key={id}>
            Módulo {id}: {modulosData[id].title.split(':')[1]} - 
            {progress[id]?.completed ? 
              <span className="font-bold text-green-600"> Concluído ✓</span> : 
              <span className="font-semibold text-orange-500"> Pendente</span>
            }
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function HomePage() {
  const { user, logout } = useUser();
  const { progress } = useProgress();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const privilegedRoles = ['Médico(a)', 'Residente', 'Estudante'];
  const restrictedModuleIds = ['4', '5', 'médico'];

  const modulosVisiveis = Object.keys(modulosData).filter(id => {
    if (restrictedModuleIds.includes(id)) {
      return user && privilegedRoles.includes(user.role);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">
          Olá, {user ? user.name.split(' ')[0] : 'Visitante'}!
          <span className="text-sm font-normal text-gray-500 ml-2">({user ? user.role : ''})</span>
        </h1>
        {user ? (
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            Logout
          </button>
        ) : (
          <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            Fazer Login
          </Link>
        )}
      </header>

      <main className="p-4 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-gray-800 mb-2">Plataforma de Treinamento </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Escolha um módulo para iniciar seu aprendizado.</p>
        </div>
        
        <ProgressStatus user={user} progress={progress} />
        
        <div className="w-full max-w-4xl mx-auto space-y-8">
          {/* --- CORREÇÃO: O CÓDIGO JSX QUE FALTAVA ESTÁ ABAIXO --- */}
          {modulosVisiveis.map(id => (
            <div key={id} className={`p-6 rounded-xl shadow-lg border ${modulosData[id].color === 'teal' ? 'bg-teal-50 border-teal-200' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between">
                 <h2 className={`text-2xl font-bold mb-4 ${modulosData[id].color === 'teal' ? 'text-teal-800' : 'text-gray-800'}`}>{modulosData[id].title}</h2>
                 {progress[id]?.completed && (
                    <span className="text-green-500 font-bold text-2xl" title="Módulo Concluído!">✓</span>
                 )}
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                {modulosData[id].teoria2D && (
                  <Link to={`/modulo/${id}/teoria`} className="flex-1 text-center bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105">
                    Ver Teoria
                  </Link>
                )}
                {modulosData[id].simulacao3D && (
                  <Link to={`/modulo/${id}/simulacao`} className="flex-1 text-center bg-cyan-500 text-black font-semibold py-3 px-6 rounded-lg hover:bg-cyan-400 transition-all transform hover:scale-105">
                    Iniciar Simulação
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}