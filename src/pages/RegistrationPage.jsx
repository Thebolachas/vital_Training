// src/pages/RegistrationPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../Context/UserContext.jsx';
import NotificationModal from '../components/NotificationModal';
import { ROLES } from '../utils/userRoles';
import logo from '/print/logo-vital.png';
import { Eye, EyeOff } from 'lucide-react';

export default function RegistrationPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState(ROLES.ENFERMAGEM); // O estado que guarda a profissão
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { registerWithEmail } = useUser();

  // --- FUNÇÃO CORRIGIDA ---
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);
    setIsModalOpen(false);

    // Validações
    if (name.trim() === '') {
      setError('Ops! Para se cadastrar, precisamos do seu nome completo.');
      setIsModalOpen(true);
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Sua senha é muito curta. Use pelo menos 6 caracteres.');
      setIsModalOpen(true);
      setIsLoading(false);
      return;
    }

    // --- MUDANÇA AQUI ---
    // Agora passamos a 'role' do estado para a função do contexto
    const result = await registerWithEmail(name, email, password, role); 
    // --- FIM DA MUDANÇA ---

    if (result.success) {
      setSuccessMessage('Cadastro realizado com sucesso! Redirecionando...');
      setIsModalOpen(true); 
      setTimeout(() => navigate('/home'), 1500); 
    } else {
      setError(result.error || 'Não foi possível completar seu cadastro.');
      setIsModalOpen(true);
    }

    setIsLoading(false);
  };
  // --- FIM DA CORREÇÃO ---

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
                Cadastre-se
            </h2>
            <p className="text-center text-gray-500 mb-8">
                Crie sua conta para acessar o treinamento.
            </p>

            {(error || successMessage) && isModalOpen && (
                <NotificationModal message={error || successMessage} onClose={closeModal} />
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
                 <div>
                    <label htmlFor="name" className="sr-only">Nome Completo</label>
                    <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Seu nome completo"
                    required
                    disabled={isLoading}
                    />
                </div>
                 <div>
                    <label htmlFor="email" className="sr-only">E-mail</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Seu e-mail institucional"
                        required
                        disabled={isLoading}
                    />
                 </div>
                 <div className="relative">
                    <label htmlFor="password" className="sr-only">Senha</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 pr-10"
                        placeholder="Crie uma senha (mín. 6 caracteres)"
                        required
                        disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                      aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                 </div>
                 <div>
                    <label htmlFor="role" className="sr-only">Função</label>
                    <select
                    id="role"
                    value={role} // O valor é controlado pelo estado
                    onChange={(e) => setRole(e.target.value)} // O onChange atualiza o estado
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                    required
                    disabled={isLoading}
                    >
                        {Object.values(ROLES).filter(r => r !== ROLES.ADM).map(roleOption => ( 
                           <option key={roleOption} value={roleOption}>{roleOption}</option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105 disabled:bg-blue-400 disabled:cursor-wait flex justify-center items-center"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        'Cadastrar'
                    )}
                </button>
            </form>

            <div className="text-center mt-6">
                <p className="text-gray-600">
                   Já tem uma conta?
                </p>
                <Link
                    to="/login"
                    className="text-blue-600 font-semibold hover:underline mt-2 inline-block"
                >
                    Fazer Login
                </Link>
            </div>
        </div>
      </div>
    </>
  );
}