// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../Context/UserContext.jsx';
import NotificationModal from '../components/NotificationModal'; // Usar o NotificationModal padrão
import logo from '/print/logo-vital.png'; // <--- CORREÇÃO AQUI: Alterado para logo-vital.png
import '../App.css'; // Certifique-se de que App.css é importado aqui

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Para exibir mensagens via modal

  const navigate = useNavigate();
  const { loginWithEmail, resetPassword } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);
    setIsModalOpen(false); // Fechar qualquer modal anterior

    if (email.trim() === '' || password.trim() === '') {
      setError('Opa! Por favor, preencha seu e-mail e sua senha para continuar.');
      setIsModalOpen(true); // Abrir modal com erro
      setIsLoading(false);
      return;
    }

    const result = await loginWithEmail(email, password);

    if (result.success) {
      setSuccessMessage('Login bem-sucedido! Redirecionando...');
      navigate('/home');
    } else {
      setError(result.error || 'Erro ao fazer login. Tente novamente.');
      setIsModalOpen(true); // Abrir modal com erro
    }
    setIsLoading(false);
  };

  const handleResetPassword = async () => {
    setError('');
    setSuccessMessage('');
    setIsModalOpen(false); // Fechar qualquer modal anterior

    if (email.trim() === '') {
      setError('Por favor, digite seu e-mail no campo acima para enviarmos o link de recuperação.');
      setIsModalOpen(true); // Abrir modal com erro
      return;
    }

    setIsLoading(true);
    const result = await resetPassword(email);
    if (result.success) {
      setSuccessMessage('Um e-mail de recuperação de senha foi enviado para seu endereço. Por favor, verifique sua caixa de entrada (e a pasta de spam)!');
      setIsModalOpen(true); // Abrir modal com sucesso
      setEmail(''); // Limpa o campo de email
      setPassword(''); // Limpa a senha também
    } else {
      setError(result.error || 'Não foi possível enviar o e-mail de recuperação. Tente novamente mais tarde.');
      setIsModalOpen(true); // Abrir modal com erro
    }
    setIsLoading(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError(''); // Limpar erro ao fechar modal
    setSuccessMessage(''); // Limpar sucesso ao fechar modal
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
            <div className="absolute top-4 left-4">
                <Link to="/" className="text-white text-lg font-bold flex items-center">
                    <img src={logo} alt="Logo" className="h-8 w-auto mr-2" />
                    iCTG TreinaFácil
                </Link>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center transform transition-all duration-300 hover:scale-105">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 animate-bounce-in-text">Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="sr-only">E-mail</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="E-mail"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">Senha</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Senha"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                        <div className="text-right mt-1">
                            <button
                                type="button"
                                onClick={handleResetPassword}
                                className="text-blue-500 hover:underline text-sm"
                                disabled={isLoading}
                            >
                                Esqueceu sua senha?
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-3 rounded-md font-semibold hover:bg-blue-600 transition duration-300 flex items-center justify-center"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            'Entrar'
                        )}
                    </button>
                </form>
                <p className="mt-4 text-gray-600">
                    Não tem uma conta?{' '}
                    <Link to="/register" className="text-blue-500 font-semibold hover:underline">
                        Cadastre-se aqui
                    </Link>
                </p>
            </div>

            {(error || successMessage) && (
                <NotificationModal message={error || successMessage} onClose={closeModal} />
            )}
        </div>
    </>
  );
}