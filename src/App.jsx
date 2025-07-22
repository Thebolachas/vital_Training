// src/App.jsx
import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useUser } from './Context/UserContext.jsx';
import { useProgress } from './Context/ProgressContext.jsx';
import { modulosData } from './Data/dadosModulos.jsx';

import IntroPage from './pages/IntroPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegistrationPage from './pages/RegistrationPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ModulePage2D from './pages/ModulePage2D.jsx';
import ModulePage3D from './pages/ModulePage3D.jsx';
import CertificatePage from './pages/CertificatePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

// Importe o componente Analytics da Vercel
import { Analytics } from '@vercel/analytics/react';

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

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useUser();
  const { progress } = useProgress();

  if (loading) {
    return <div className="p-8 text-center">Verificando autenticação...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/modulo/:id/teoria" element={<ProtectedRoute><ModulePage2D /></ProtectedRoute>} />
        <Route path="/modulo/:id/simulacao" element={<ProtectedRoute><ModulePage3D /></ProtectedRoute>} />
        <Route path="/certificate" element={<ProtectedRoute><CertificatePage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["Adm"]}><DashboardPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {/* Adicione o componente Analytics aqui, no nível mais alto do seu aplicativo */}
      <Analytics />
    </>
  );
}