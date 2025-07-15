import React, { useContext, lazy, Suspense } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './Context/UserContext.jsx';
import { ProgressProvider, useProgress } from './Context/ProgressContext.jsx';

// Importar páginas estaticamente (pequenas ou sempre carregadas)
import IntroPage from './pages/IntroPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegistrationPage from './pages/RegistrationPage.jsx';
import HomePage from './pages/HomePage.jsx';

// Lazy load de páginas maiores ou menos acessadas
const ModulePage2D = lazy(() => import('./pages/ModulePage2D.jsx'));
const ModulePage3D = lazy(() => import('./pages/ModulePage3D.jsx'));
const CertificatePage = lazy(() => import('./pages/CertificatePage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx')); // Importa ProfilePage

import ProtectedRoute from './components/ProtectedRoute.jsx';

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
    <h2 className="text-2xl sm:text-4xl font-bold text-gray-700 mb-4">404 - Página Não Encontrada</h2>
    <p className="text-sm sm:text-lg text-gray-500 mb-8">O caminho que você tentou acessar não existe.</p>
    <Link
      to="/home"
      className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
    >
      Voltar para a Página Principal
    </Link>
  </div>
);

function AppContent() {
  const { loading: userLoading } = useUser();
  const { loading: progressLoading } = useProgress();

  if (userLoading || progressLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl text-gray-700">
        Carregando aplicação...
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen text-2xl text-gray-700">Carregando conteúdo...</div>}>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        
        {/* Rotas Protegidas */}
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/modulo/:id/teoria" element={<ProtectedRoute><ModulePage2D /></ProtectedRoute>} />
        <Route path="/modulo/:id/simulacao" element={<ProtectedRoute><ModulePage3D /></ProtectedRoute>} />
        <Route path="/certificate" element={<ProtectedRoute><CertificatePage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["Adm"]}><DashboardPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        
        {/* Rota para página não encontrada */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

// O componente App principal NÃO DEVE MAIS TER O BrowserRouter AQUI.
// Ele é responsável apenas por prover os contextos e renderizar AppContent.
export default function App() {
  return (
    <UserProvider>
      <ProgressProvider>
        <AppContent />
      </ProgressProvider>
    </UserProvider>
  );
}