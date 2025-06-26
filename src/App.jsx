import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { UserProvider } from './Context/UserContext.jsx';
import { ProgressProvider } from './Context/ProgressContext.jsx';

import IntroPage from './pages/IntroPage.jsx';
import RegistrationPage from './pages/RegistrationPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ModulePage2D from './pages/ModulePage2D.jsx';
import ModulePage3D from './pages/ModulePage3D.jsx';
import CertificatePage from './pages/CertificatePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx'; // Importar a nova página

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
    <h2 className="text-4xl font-bold text-gray-700 mb-4">404 - Página Não Encontrada</h2>
    <p className="text-gray-500 mb-8">O caminho que você tentou acessar não existe.</p>
    <Link to="/home" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
      Voltar para a Página Principal
    </Link>
  </div>
);

export default function App() {
  return (
    <UserProvider>
      <ProgressProvider>
        <Router>
          <Routes>
            <Route path="/" element={<IntroPage />} />
            <Route path="/login" element={<RegistrationPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/modulo/:id/teoria" element={<ModulePage2D />} />
            <Route path="/modulo/:id/simulacao" element={<ModulePage3D />} />
            <Route path="/certificate" element={<CertificatePage />} />
            
            {/* ROTA NOVA PARA O DASHBOARD */}
            <Route path="/dashboard" element={<DashboardPage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </ProgressProvider>
    </UserProvider>
  );
}