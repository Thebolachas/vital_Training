import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Importação dos Provedores de Contexto
// UserProvider gerencia os dados do usuário logado.
// ProgressProvider gerencia o estado de conclusão dos módulos.
import { UserProvider } from './Context/UserContext.jsx';
import { ProgressProvider } from './Context/ProgressContext.jsx';

// Importação das Páginas da Aplicação
import IntroPage from './pages/IntroPage.jsx';
import RegistrationPage from './pages/RegistrationPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ModulePage2D from './pages/ModulePage2D.jsx';
import ModulePage3D from './pages/ModulePage3D.jsx';
import CertificatePage from './pages/CertificatePage.jsx'; // <-- NOVA IMPORTAÇÃO

export default function App() {
  return (
    // Os Providers envolvem toda a aplicação, garantindo que qualquer
    // componente filho possa acessar os contextos de usuário e progresso.
    <UserProvider>
      <ProgressProvider>
        <Router>
          <Routes>
            {/* Rota inicial da aplicação */}
            <Route path="/" element={<IntroPage />} />
            
            {/* Rota para a página de login/identificação */}
            <Route path="/login" element={<RegistrationPage />} />
            
            {/* Rota para a página principal com a seleção de módulos */}
            <Route path="/home" element={<HomePage />} />
            
            {/* Rotas dinâmicas para os módulos de treinamento */}
            <Route path="/modulo/:id/teoria" element={<ModulePage2D />} />
            <Route path="/modulo/:id/simulacao" element={<ModulePage3D />} />

            {/* NOVA ROTA: Rota para a página de geração do certificado */}
            <Route path="/certificate" element={<CertificatePage />} />
            
            {/* Rota de fallback para páginas não encontradas (404) */}
            <Route path="*" element={
              <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
                <h2 className="text-4xl font-bold text-gray-700 mb-4">404 - Página Não Encontrada</h2>
                <p className="text-gray-500 mb-8">O caminho que você tentou acessar não existe.</p>
                <Link to="/home" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                  Voltar para a Página Principal
                </Link>
              </div>
            } />
          </Routes>
        </Router>
      </ProgressProvider>
    </UserProvider>
  );
}