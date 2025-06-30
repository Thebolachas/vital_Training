import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Context/UserContext.jsx';
import PasswordModal from '../components/PasswordModal.jsx'; // Importar o modal

export default function RegistrationPage() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Enfermagem');
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar o modal
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === '') {
      alert('Por favor, insira o seu nome.');
      return;
    }

    // Se o perfil for 'Desenvolvedor', abre o modal em vez de logar
    if (role === 'Desenvolvedor') {
      setIsModalOpen(true);
    } else {
      login(name, role);
      navigate('/home');
    }
  };

  const handlePasswordConfirm = (password) => {
    // A senha correta
    if (password === 'OlíviaSusi') {
      login(name, role);
      navigate('/dashboard'); // Redireciona para o dashboard
    } else {
      alert('Senha incorreta!');
    }
    setIsModalOpen(false); // Fecha o modal
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
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Ex: Gustavo Duarte"/>
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
              <option>Residente</option>
              <option>Estudante</option>
              <option>Desenvolvedor</option>
              <option>Outro</option> {/* ⬅️ NOVO */}
</select>

              
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105">Entrar no Treinamento</button>
          </form>
        </div>
      </div>
    </>
  );
}