// src/pages/ProfilePage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../Context/UserContext.jsx';
import { auth } from '../firebaseConfig'; // Importa 'auth' para updatePassword
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'; // Para reautenticação e atualização
import NotificationModal from '../components/NotificationModal.jsx'; // Usar o modal de notificação

export default function ProfilePage() {
    const { user, logout } = useUser();
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const closeModal = () => {
        setIsModalOpen(false);
        setModalMessage('');
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setModalMessage('');
        setIsModalOpen(false);
        setIsLoading(true);

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setModalMessage('Por favor, preencha todos os campos de senha.');
            setIsModalOpen(true);
            setIsLoading(false);
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setModalMessage('A nova senha e a confirmação não coincidem.');
            setIsModalOpen(true);
            setIsLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setModalMessage('A nova senha deve ter pelo menos 6 caracteres.');
            setIsModalOpen(true);
            setIsLoading(false);
            return;
        }

        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                setModalMessage('Usuário não autenticado. Por favor, faça login novamente.');
                setIsModalOpen(true);
                navigate('/login'); // Redireciona para login se não houver usuário
                return;
            }

            // Reautenticar o usuário
            const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
            await reauthenticateWithCredential(currentUser, credential);

            // Se a reautenticação for bem-sucedida, atualiza a senha
            await updatePassword(currentUser, newPassword);

            setModalMessage('Senha atualizada com sucesso!');
            setIsModalOpen(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error) {
            console.error("Erro ao alterar senha:", error);
            let message = "Erro ao alterar senha. Por favor, tente novamente.";
            if (error.code === 'auth/wrong-password') {
                message = "Senha atual incorreta.";
            } else if (error.code === 'auth/requires-recent-login') {
                message = "Por favor, faça login novamente e tente mudar a senha em seguida. (Sessão expirada para segurança)";
                logout(); // Desloga o usuário para forçar um novo login
                navigate('/login');
            } else if (error.code === 'auth/weak-password') {
                message = "A nova senha é muito fraca.";
            }
            setModalMessage(message);
            setIsModalOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return <div className="text-center p-8">Carregando dados do usuário...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <header className="flex justify-between items-center bg-white p-4 rounded-xl shadow-md mb-8">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-800">Meu Perfil</h1>
                <Link to="/home" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">Voltar para Home</Link>
            </header>

            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-4">Informações do Usuário</h2>
                <div className="space-y-2 text-gray-700">
                    <p><span className="font-semibold">Nome:</span> {user.name}</p>
                    <p><span className="font-semibold">E-mail:</span> {user.email}</p>
                    <p><span className="font-semibold">Função:</span> {user.role}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-4">Alterar Senha</h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Senha Atual</label>
                        <input
                            type="password"
                            id="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
                        <input
                            type="password"
                            id="confirmNewPassword"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            'Alterar Senha'
                        )}
                    </button>
                </form>
            </div>

            {isModalOpen && (
                <NotificationModal message={modalMessage} onClose={closeModal} />
            )}
        </div>
    );
}