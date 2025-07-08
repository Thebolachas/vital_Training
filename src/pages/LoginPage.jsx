// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../Context/UserContext.jsx';
import PasswordModal from '../components/PasswordModal.jsx'; // Manter para o login Adm

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Para mensagens de sucesso (recuperação de senha)
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Para modal de senha Adm
  const [currentLoginUser, setCurrentLoginUser] = useState(null); // Para guardar o user após login para verificação Adm

  const navigate = useNavigate();
  // Usamos loginWithEmail e resetPassword do UserContext
  const { loginWithEmail, resetPassword } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    if (email.trim() === '' || password.trim() === '') {
      setError('Opa! Por favor, preencha seu e-mail e sua senha para continuar.');
      setIsLoading(false);
      return;
    }

    const result = await loginWithEmail(email, password);

    if (result.success) {
      setCurrentLoginUser(result.user); // Guarda o usuário para verificar a role
      // Se for Adm, abre o modal de senha fixa
      if (result.user.role === 'Adm') {
        setIsModalOpen(true);
      } else {
        setSuccessMessage('Login bem-sucedido! Redirecionando...');
        navigate('/home'); // Redireciona usuários normais
      }
    } else {
      // Mensagem de erro já virá formatada do UserContext
      setError(result.error || 'Erro ao fazer login. Tente novamente.');
    }
    setIsLoading(false);
  };

  const handlePasswordConfirm = async (admPassword) => {
    setIsModalOpen(false);
    setIsLoading(true);

    if (admPassword === '12345@') { // Senha fixa do Adm
      // Se a senha do Adm estiver correta, o login já foi feito pelo loginWithEmail
      // Apenas redireciona
      setSuccessMessage('Login de administrador bem-sucedido! Redirecionando...');
      navigate('/dashboard');
    } else {
      setError('Senha de administrador incorreta! Tente novamente.');
    }
    setIsLoading(false);
  };

  // Função para lidar com a recuperação de senha
  const handleResetPassword = async () => {
    setError('');
    setSuccessMessage('');
    if (email.trim() === '') {
      setError('Por favor, digite seu e-mail no campo acima para enviarmos o link de recuperação.');
      return;
    }

    setIsLoading(true);
    const result = await resetPassword(email); // Chamada ao UserContext
    if (result.success) {
      setSuccessMessage('Um e-mail de recuperação de senha foi enviado para seu endereço. Por favor, verifique sua caixa de entrada (e a pasta de spam)!');
      setEmail(''); // Limpa o campo de email
      setPassword(''); // Limpa a senha também
    } else {
      // Mensagem de erro já virá formatada do UserContext
      setError(result.error || 'Não foi possível enviar o e-mail de recuperação. Tente novamente mais tarde.');
    }
    setIsLoading(false);
  };

  return (
    <>
      <PasswordModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setIsLoading(false); setError('Login de administrador cancelado.'); }}
        onConfirm={handlePasswordConfirm}
      />
      <div className="h-screen w-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Fazer Login</h1>
          <p className="text-center text-gray-500 mb-8">Acesse sua conta para continuar.</p>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="seuemail@exemplo.com"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="********"
                disabled={isLoading}
              />
              {/* NOVO: Link para recuperação de senha */}
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
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105 disabled:bg-blue-400 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600">Não tem uma conta?</p>
            <Link to="/register" className="text-blue-600 font-semibold hover:underline mt-2 inline-block">
              Cadastre-se
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}