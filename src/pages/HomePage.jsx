// src/pages/HomePage.jsx

import React, { useState, useEffect, useMemo } from 'react'; // Adicionado useMemo
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { modulosData } from '../Data/dadosModulos.jsx';
import { useUser } from '../Context/UserContext.jsx';
import { useProgress } from '../Context/ProgressContext.jsx';
import FeedbackModal from '../components/FeedbackModal.jsx';
import { db } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

const ProgressStatus = ({ user, progress, showFeedbackPrompt }) => {
    // ... (Mantido como estava, já está responsivo com w-full, max-w-4xl, p-6, etc.)
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

    // Lógica de filtragem para os módulos visíveis por função (mantida como estava)
    const modulosVisiveis = Object.keys(modulosData).filter(id => {
        if (user?.role === 'Adm') return true; 
        if (user?.role === 'Enfermagem') {
            return id !== '5' && id !== 'médico'; 
        }
        return true; 
    });

    useEffect(() => {
        // ... (mantido como estava)
    }, [location, navigate]);

    const handleFeedbackSubmittedAndClearPrompt = async () => {
        // ... (mantido como estava)
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const checkCompletionForCertificate = useMemo(() => { // Usar useMemo para otimização
        if (!user) return false;
        const baseModulesForCert = ['1', '2', '3', '4'];
        const advancedModulesForCert = ['5']; // Módulos avançados para certos perfis
        const privilegedRoles = ['Médico(a)', 'Residente', 'Estudante'];
        const isPrivilegedUser = privilegedRoles.includes(user.role);

        let modulesToConsiderForCertificate = [];

        if (user.role === 'Adm') {
            return false; // ADM não gera certificado de usuário.
        } else if (isPrivilegedUser) {
            modulesToConsiderForCertificate = [...baseModulesForCert, ...advancedModulesForCert];
        } else {
            modulesToConsiderForCertificate = baseModulesForCert;
        }

        const filteredModules = modulesToConsiderForCertificate.filter(id => modulosData[id]?.teoria2D?.quiz || modulosData[id]?.simulacao3D);
        const completedCount = filteredModules.filter(id => progress[id]?.completed).length;

        return completedCount === filteredModules.length && filteredModules.length > 0;
    }, [user, progress]); // Dependências para useMemo

    const showCertificateLink = user && checkCompletionForCertificate; // Variável para renderização

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
                <header className="bg-white shadow-md p-4 flex flex-col sm:flex-row justify-between items-center sticky top-0 z-30">
                    <h1 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0 text-center sm:text-left">Olá, {user?.name ? user.name.split(' ')[0] : 'Visitante'}!</h1>
                    <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 sm:gap-4 w-full sm:w-auto">
                        {user && user.role === 'Adm' && (
                            <Link to="/dashboard" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg transition-colors text-sm sm:text-base">
                                Dashboard
                            </Link>
                        )}
                        {user && user.role !== 'Adm' && (
                            <button
                                onClick={() => setFeedbackModalOpen(true)}
                                className={`bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg transition-colors text-sm sm:text-base ${showFeedbackPrompt ? 'animate-blink' : ''}`}
                            >
                                Feedback
                            </button>
                        )}
                        {/* Botão de Certificado no Header - visível apenas se todos os módulos necessários foram concluídos e NÃO for ADM */}
                        {showCertificateLink && ( // Usando a variável showCertificateLink
                            <Link to="/certificate" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base whitespace-nowrap">
                                Ver Certificado
                            </Link>
                        )}
                        {user?.role === 'Adm' && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs sm:text-sm font-semibold px-2 sm:px-2.5 py-0.5 rounded whitespace-nowrap"> {/* Ajuste de fonte, padding e nowrap */}
                                MODO ADMINISTRADOR
                            </span>
                        )}
                        {user ? (
                            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base">Logout</button>
                        ) : (
                            <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base">Login</Link>
                        )}
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <main className="py-8">
                        <div className="text-center mb-10 px-2 sm:px-0">
                            <h1 className="text-3xl sm:text-4xl font-black text-gray-800 mb-2">Plataforma de Treinamento monitor fetal iCTG</h1>
                            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">Escolha um módulo para iniciar seu aprendizado.</p>
                        </div>

                        <ProgressStatus user={user} progress={progress} showFeedbackPrompt={showFeedbackPrompt} />

                        {/* Botão para Ver Dados do Usuário */}
                        <div className="text-center mb-4 px-4">
                            <button
                                onClick={() => setIsUserPanelVisible(!isUserPanelVisible)}
                                className="bg-blue-600 text-white p-3 rounded-md transition-all transform hover:scale-105 w-full max-w-xs sm:max-w-md mx-auto"
                            >
                                {isUserPanelVisible ? 'Ocultar Dados' : 'Ver Dados do Usuário'}
                            </button>
                        </div>

                        {/* Painel de Dados do Usuário */}
                        {isUserPanelVisible && (
                            <div className="space-y-6 mt-4 p-4 sm:p-6 bg-white rounded-xl shadow-md w-full max-w-lg mx-auto">
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-700">Dados de Cadastro</h3>
                                    <p className="break-words"><strong>Nome:</strong> {user.name}</p>
                                    <p className="break-words"><strong>Email:</strong> {user.email}</p>
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
                                                className="mt-2 bg-blue-600 text-white p-3 rounded-md w-full sm:w-auto"
                                            >
                                                Alterar Senha
                                            </button>
                                            {error && <p className="text-red-500 mt-2">{error}</p>}
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditingPassword(true)}
                                            className="bg-blue-600 text-white p-3 rounded-md w-full sm:w-auto"
                                        >
                                            Editar Senha
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Módulos */}
                        <div className="w-full max-w-4xl mx-auto space-y-8 px-4 sm:px-0">
                            {modulosVisiveis.map(id => (
                                <div key={id} className="p-4 sm:p-6 rounded-xl shadow-lg border bg-white border-gray-200">
                                    <div className="flex flex-col sm:flex-row items-center justify-between mb-2 sm:mb-4">
                                        <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0 text-center sm:text-left">{modulosData[id].title}</h2>
                                        {progress[id]?.completed && (
                                            <span className="text-green-500 font-bold text-xl sm:text-2xl" title="Módulo Concluído!">
                                                ✓
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
                                        {modulosData[id].teoria2D && (
                                            <Link
                                                to={`/modulo/${id}/teoria`}
                                                className="flex-1 text-center bg-blue-600 text-white font-semibold py-2 px-3 sm:py-3 sm:px-6 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 text-sm sm:text-base"
                                            >
                                                Ver Teoria
                                            </Link>
                                        )}
                                        {modulosData[id].simulacao3D && (
                                            <Link
                                                to={`/modulo/${id}/simulacao`}
                                                className="flex-1 text-center bg-cyan-500 text-black font-semibold py-2 px-3 sm:py-3 sm:px-6 rounded-lg hover:bg-cyan-400 transition-all transform hover:scale-105 text-sm sm:text-base"
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