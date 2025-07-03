// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './Context/UserContext.jsx';
import { ProgressProvider, useProgress } from './Context/ProgressContext.jsx'; // Importar useProgress
import { modulosData } from './Data/dadosModulos.jsx'; // Importar modulosData

import IntroPage from './pages/IntroPage.jsx';
import RegistrationPage from './pages/RegistrationPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ModulePage2D from './pages/ModulePage2D.jsx';
import ModulePage3D from './pages/ModulePage3D.jsx';
import CertificatePage from './pages/CertificatePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
    <h2 className="text-4xl font-bold text-gray-700 mb-4">404 - Página Não Encontrada</h2>
    <p className="text-gray-500 mb-8">O caminho que você tentou acessar não existe.</p>
    <Link to="/home" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
      Voltar para a Página Principal
    </Link>
  </div>
);

const ProtectedRoutes = () => {
  const { user, loading } = useUser();
  const { progress } = useProgress(); // Obter o progresso do usuário

  if (loading) {
    return <div className="p-8 text-center">Verificando autenticação...</div>;
  }

  // Lógica para determinar se o usuário concluiu todos os módulos necessários para o certificado
  const checkCompletionForCertificate = () => {
    if (!user) return false;

    const baseModules = ['1', '2', '3', '4'];
    const advancedModules = ['5'];
    const privilegedRoles = ['Médico(a)', 'Residente', 'Estudante'];
    const isPrivileged = privilegedRoles.includes(user.role);

    let requiredModulesForCertificate = [];

    // Adapte esta lógica para refletir quais módulos são NECESSÁRIOS para o certificado
    // Exemplo: Adm precisa fazer todos os módulos existentes no modulosData
    if (user.role === 'Adm') {
        requiredModulesForCertificate = Object.keys(modulosData);
    } else if (isPrivileged) {
        requiredModulesForCertificate = [...baseModules, ...advancedModules];
    } else {
        requiredModulesForCertificate = baseModules;
    }

    const modulesWithQuizzesForCertificate = requiredModulesForCertificate.filter(id => modulosData[id]?.teoria2D || modulosData[id]?.simulacao3D);
    const completedCount = modulesWithQuizzesForCertificate.filter(id => progress[id]?.completed).length;

    return completedCount === modulesWithQuizzesForCertificate.length && modulesWithQuizzesForCertificate.length > 0;
  };

  const userHasCompletedAllRequiredModules = checkCompletionForCertificate();


  return (
    <Routes>
      <Route path="/" element={<IntroPage />} />
      <Route path="/login" element={<RegistrationPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/modulo/:id/teoria" element={<ModulePage2D />} />
      <Route path="/modulo/:id/simulacao" element={<ModulePage3D />} />
      {/* Rota do Certificado - Protegida pela conclusão dos módulos */}
      <Route
        path="/certificate"
        element={
          user && userHasCompletedAllRequiredModules
            ? <CertificatePage />
            : <Navigate to="/home" replace /> // Redireciona se não estiver logado ou não completou
        }
      />
      <Route
        path="/dashboard"
        element={
          user?.role === 'Adm'
            ? <DashboardPage />
            : <Navigate to="/home" replace />
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default function App() {
  return (
    <UserProvider>
      <ProgressProvider> {/* ProgressProvider envolve ProtectedRoutes */}
        <Router>
          <ProtectedRoutes />
        </Router>
      </ProgressProvider>
    </UserProvider>
  );
}