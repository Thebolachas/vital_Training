import React, { useState } from 'react';

export default function PasswordModal({ isOpen, onClose, onConfirm }) {
  const [password, setPassword] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm(password);
    setPassword(''); // Limpa o campo após a tentativa
  };

  return (
    // Fundo escuro (overlay)
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      {/* Caixa do modal */}
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Acesso Restrito</h2>
        <p className="text-center text-gray-600 mb-6">Por favor, insira a senha de desenvolvedor para continuar.</p>
        
        <div className="mb-4">
          <label htmlFor="dev-password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <input
            id="dev-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            onKeyUp={(e) => e.key === 'Enter' && handleConfirm()}
          />
        </div>

        <div className="flex gap-4 mt-8">
          <button onClick={onClose} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors">
            Cancelar
          </button>
          <button onClick={handleConfirm} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}