import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './Context/UserContext.jsx';
import { ProgressProvider } from './Context/ProgressContext.jsx';

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

// Componente de proteção para a rota do dashboard
const ProtectedRoutes = () => {
  const { user, loading } = useUser();

  if (loading) {
    return <div className="p-10 text-center">Verificando autenticação...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<IntroPage />} />
      <Route path="/login" element={<RegistrationPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/modulo/:id/teoria" element={<ModulePage2D />} />
      <Route path="/modulo/:id/simulacao" element={<ModulePage3D />} />
      <Route path="/certificate" element={<CertificatePage />} />
      
      {/* Rota protegida para desenvolvedor */}
      <Route
        path="/dashboard"
        element={
          user?.role === 'Desenvolvedor'
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
      <ProgressProvider>
        <Router>
          <ProtectedRoutes />
        </Router>
      </ProgressProvider>
    </UserProvider>
  );
}
