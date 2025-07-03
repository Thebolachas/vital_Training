// src/pages/RegistrationPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Context/UserContext.jsx';
import PasswordModal from '../components/PasswordModal.jsx';

export default function RegistrationPage() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Enfermagem');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim() === '') {
      alert('Por favor, insira o seu nome.');
      return;
    }

    if (role === 'Adm') { // Verifica o perfil 'Adm' para abrir o modal
      setIsModalOpen(true);
    } else {
      await login(name, role);
      navigate('/home'); // Redireciona para a Home para outros perfis
    }
  };

  const handlePasswordConfirm = async (password) => {
    if (password === '12345@') { // Senha de Adm
      await login(name, role);
      navigate('/dashboard'); // Redireciona para o Dashboard
    } else {
      alert('Senha incorreta!');
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <PasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handlePasswordConfirm}
      />
      <div className="h-screen w-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Identificação</h1>
          <p className="text-center text-gray-500 mb-8">Acesse para ter uma experiência personalizada.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite Aqui"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Função</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option>Enfermagem</option>
                <option>Médico(a)</option>
                <option>Estudante</option>
                <option>Adm</option> {/* Opção para o perfil 'Adm' */}
                <option>Outro</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105"
            >
              Entrar no Treinamento
            </button>
          </form>
        </div>
      </div>
    </>
  );
}