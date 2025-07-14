// src/pages/RegistrationPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../Context/UserContext.jsx';
import NotificationModal from '../components/NotificationModal'; // Usar o NotificationModal padrão
import { ROLES } from '../utils/userRoles'; // Importar ROLES para o select
import logo from '/print/logo-vital.png'; // <--- CORREÇÃO AQUI: Alterado para logo-vital.png
import '../App.css';

export default function RegistrationPage() {
  const [isRegistering, setIsRegistering] = useState(true); // Começa como cadastro
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState(ROLES.ENFERMAGEM); // Definir um valor inicial padrão seguro
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Para exibir mensagens via modal

  const navigate = useNavigate();
  const { registerWithEmail, loginWithEmail, resetPassword } = useUser();

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);
    setIsModalOpen(false); // Fechar qualquer modal anterior

    if (email.trim() === '' || password.trim() === '') {
      setError('Opa! Por favor, preencha seu e-mail e sua senha para continuar.');
      setIsModalOpen(true);
      setIsLoading(false);
      return;
    }

    if (isRegistering) { // Fluxo de CADASTRO
      if (name.trim() === '') {
        setError('Ops! Para se cadastrar, precisamos do seu nome completo.');
        setIsModalOpen(true);
        setIsLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Sua senha é muito curta. Use pelo menos 6 caracteres para sua segurança.');
        setIsModalOpen(true);
        setIsLoading(false);
        return;
      }

      const result = await registerWithEmail(name, email, password); // Removido 'role' do parâmetro

      if (result.success) {
        setSuccessMessage('Cadastro realizado com sucesso! Você já pode acessar.');
        setIsModalOpen(true);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(result.error || 'Não foi possível completar seu cadastro. Tente novamente.');
        setIsModalOpen(true);
      }

    } else { // Fluxo de LOGIN (Este componente também é usado para login, caso o usuário alterne)
      const result = await loginWithEmail(email, password);
      if (result.success) {
        setSuccessMessage('Login bem-sucedido! Redirecionando...');
        navigate('/home');
      } else {
        setError(result.error || 'Não foi possível fazer o login. Verifique seu e-mail e senha.');
        setIsModalOpen(true);
      }
    }
    setIsLoading(false);
  };

  const handleResetPassword = async () => {
    setError('');
    setSuccessMessage('');
    setIsModalOpen(false); // Fechar qualquer modal anterior

    if (email.trim() === '') {
      setError('Por favor, digite seu e-mail no campo acima para enviarmos o link de recuperação.');
      setIsModalOpen(true);
      return;
    }

    setIsLoading(true);
    const result = await resetPassword(email);
    if (result.success) {
      setSuccessMessage('Um e-mail de recuperação de senha foi enviado para seu endereço. Por favor, verifique sua caixa de entrada (e a pasta de spam)!');
      setIsModalOpen(true);
      setEmail('');
      setPassword('');
    } else {
      setError(result.error || 'Não foi possível enviar o e-mail de recuperação. Tente novamente mais tarde.');
      setIsModalOpen(true);
    }
    setIsLoading(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError('');
    setSuccessMessage('');
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
            <h2 className="text-3xl font-bold text-gray-800 mb-6 animate-bounce-in-text">
                {isRegistering ? 'Cadastre-se' : 'Fazer Login'}
            </h2>
            <p className="text-center text-gray-500 mb-8">
                {isRegistering ? 'Crie sua conta para acessar o treinamento.' : 'Acesse sua conta para continuar.'}
            </p>

            <form onSubmit={handleAuthSubmit} className="space-y-6">
                {isRegistering && (
                <div>
                    <label htmlFor="name" className="sr-only">Nome Completo</label>
                    <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Seu nome"
                    required
                    disabled={isLoading}
                    />
                </div>
                )}
                <div>
                <label htmlFor="email" className="sr-only">E-mail</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="seuemail@exemplo.com"
                    required
                    disabled={isLoading}
                />
                </div>
                <div>
                <label htmlFor="password" className="sr-only">Senha</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="********"
                    required
                    disabled={isLoading}
                />
                <div className="text-right mt-1">
                    <button
                    type="button"
                    onClick={handleResetPassword}
                    className="text-blue-600 hover:underline text-sm"
                    disabled={isLoading}
                    >
                    Esqueceu sua senha?
                    </button>
                </div>
                </div>
                {isRegistering && (
                <div>
                    <label htmlFor="role" className="sr-only">Função</label>
                    <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={isLoading}
                    >
                        <option value={ROLES.ENFERMAGEM}>{ROLES.ENFERMAGEM}</option>
                        <option value={ROLES.MEDICO}>{ROLES.MEDICO}</option>
                        <option value={ROLES.ESTUDANTE}>{ROLES.ESTUDANTE}</option>
                        <option value={ROLES.RESIDENTE}>{ROLES.RESIDENTE}</option>
                        <option value={ROLES.OUTRO}>{ROLES.OUTRO}</option>
                    </select>
                </div>
                )}
                <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105 disabled:bg-blue-400 disabled:cursor-not-allowed"
                disabled={isLoading}
                >
                {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    isRegistering ? 'Cadastrar' : 'Entrar'
                )}
                </button>
            </form>

            <div className="text-center mt-6">
                <p className="text-gray-600">
                {isRegistering ? 'Já tem uma conta?' : 'Não tem uma conta?'}
                </p>
                <button
                onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError('');
                    setSuccessMessage('');
                    setEmail('');
                    setPassword('');
                    setName(''); // Limpar nome ao alternar
                    setRole(ROLES.ENFERMAGEM); // Resetar função para um valor padrão seguro
                }}
                className="text-blue-600 font-semibold hover:underline mt-2 inline-block"
                disabled={isLoading}
                >
                {isRegistering ? 'Fazer Login' : 'Cadastre-se'}
                </button>
            </div>
        </div>
      </div>
      {(error || successMessage) && (
          <NotificationModal message={error || successMessage} onClose={closeModal} />
      )}
    </>
  );
}