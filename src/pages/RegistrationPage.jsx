// src/pages/RegistrationPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../Context/UserContext.jsx';
import PasswordModal from '../components/PasswordModal.jsx';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function RegistrationPage() {
  // isRegistering começa como false, o que significa que a tela inicial é a de Login
  const [isRegistering, setIsRegistering] = useState(false); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Apenas para o cadastro
  const [role, setRole] = useState('Enfermagem');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAuthOperation, setCurrentAuthOperation] = useState(null);

  const navigate = useNavigate();
  const { registerWithEmail, loginWithEmail, resetPassword } = useUser();

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    if (email.trim() === '' || password.trim() === '') {
      setError('Opa! Por favor, preencha seu e-mail e sua senha para continuar.');
      setIsLoading(false);
      return;
    }

    if (isRegistering) { // Fluxo de CADASTRO
      if (name.trim() === '') {
        setError('Ops! Para se cadastrar, precisamos do seu nome completo.');
        setIsLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Sua senha é muito curta. Use pelo menos 6 caracteres para sua segurança.');
        setIsLoading(false);
        return;
      }

      if (role === 'Adm') {
        setCurrentAuthOperation('register');
        setIsModalOpen(true);
        setIsLoading(false);
        return;
      }

      const result = await registerWithEmail(name, email, password, role);
      if (result.success) {
        setSuccessMessage('Cadastro realizado com sucesso! Você já pode acessar.');
        navigate('/home');
      } else {
        setError(result.error || 'Não foi possível completar seu cadastro. Tente novamente.');
      }

    } else { // Fluxo de LOGIN
      if (role === 'Adm') {
        setCurrentAuthOperation('login');
        setIsModalOpen(true);
        setIsLoading(false);
        return;
      }

      const result = await loginWithEmail(email, password);
      if (result.success) {
        setSuccessMessage('Login bem-sucedido! Redirecionando...');
        navigate('/home');
      } else {
        setError(result.error || 'Não foi possível fazer o login. Verifique seu e-mail e senha.');
      }
    }
    setIsLoading(false);
  };

  const handlePasswordConfirm = async (admPassword) => {
    setIsModalOpen(false);
    setIsLoading(true);

    if (admPassword === '12345@') {
      let result = { success: false, user: null };

      if (currentAuthOperation === 'register') {
        result = await registerWithEmail(name, email, password, role);
      } else if (currentAuthOperation === 'login') {
        result = await loginWithEmail(email, password);
      }

      if (result.success) {
        try {
          await addDoc(collection(db, 'admin_logins'), {
            uid: result.user.uid,
            name: result.user.name,
            role: result.user.role,
            email: result.user.email,
            timestamp: serverTimestamp(),
          });
          setSuccessMessage('Login de administrador bem-sucedido! Redirecionando...');
        } catch (logError) {
          console.error("Erro ao registrar login de Adm:", logError);
          setError('Erro ao registrar login de Adm. Mas login ok.'); // Não deve bloquear o login
        }
        navigate('/dashboard');
      } else {
        setError(result.error || `Ocorreu um erro na autenticação de administrador.`);
      }
    } else {
      setError('Senha de administrador incorreta! Tente novamente.');
    }
    setIsLoading(false);
  };

  const handleResetPassword = async () => {
    setError('');
    setSuccessMessage('');
    if (email.trim() === '') {
      setError('Por favor, digite seu e-mail no campo acima para enviarmos o link de recuperação.');
      return;
    }

    setIsLoading(true);
    const result = await resetPassword(email);
    if (result.success) {
      setSuccessMessage('Um e-mail de recuperação de senha foi enviado para seu endereço. Por favor, verifique sua caixa de entrada (e a pasta de spam)!');
      setEmail('');
      setPassword(''); // Limpa a senha também
    } else {
      setError(result.error || 'Não foi possível enviar o e-mail de recuperação. Tente novamente mais tarde.');
    }
    setIsLoading(false);
  };

  return (
    <>
      <PasswordModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsLoading(false);
          setError('Operação de administrador cancelada.');
        }}
        onConfirm={handlePasswordConfirm}
      />
      <div className="h-screen w-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            {isRegistering ? 'Cadastre-se' : 'Fazer Login'}
          </h1>
          <p className="text-center text-gray-500 mb-8">
            {isRegistering ? 'Crie sua conta para acessar o treinamento.' : 'Acesse sua conta para continuar.'}
          </p>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

          <form onSubmit={handleAuthSubmit} className="space-y-6">
            {/* Campo Nome Completo só aparece no CADASTRO */}
            {isRegistering && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Seu nome"
                  disabled={isLoading}
                />
              </div>
            )}
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
              {/* NOVO LOCAL: Link para recuperação de senha, agora SEM CONDIÇÃO isRegistering */}
              {/* Ele aparecerá sempre que o campo de senha for visível */}
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
            {/* Campo Função só aparece no CADASTRO */}
            {isRegistering && (
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Função</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                >
                  <option>Enfermagem</option>
                  <option>Médico(a)</option>
                  <option>Estudante</option>
                  <option>Adm</option>
                  <option>Outro</option>
                </select>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105 disabled:bg-blue-400 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Carregando...' : (isRegistering ? 'Cadastrar' : 'Entrar')}
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
                setName('');
              }}
              className="text-blue-600 font-semibold hover:underline mt-2 inline-block"
              disabled={isLoading}
            >
              {isRegistering ? 'Fazer Login' : 'Cadastre-se'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}