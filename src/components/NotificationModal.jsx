// src/components/NotificationModal.jsx
import React from 'react';

export default function NotificationModal({ isOpen, onClose, notifications }) {
  if (!isOpen) return null;

  const hasNewUsers = notifications.newUsers && notifications.newUsers.length > 0;
  const hasNewFeedbacks = notifications.newFeedbacks && notifications.newFeedbacks.length > 0;
  const hasRecentAdminLogins = notifications.recentAdminLogins && notifications.recentAdminLogins.length > 0;


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Notificações Recentes</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            &times;
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-grow">
          {!hasNewUsers && !hasNewFeedbacks && !hasRecentAdminLogins && (
            <p className="text-gray-600 text-center">Nenhum aviso recente.</p>
          )}

          {hasNewUsers && (
            <div className="mb-4">
              <h3 className="font-semibold text-lg text-blue-700 mb-2">Novos Usuários Cadastrados:</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {notifications.newUsers.map(user => (
                  <li key={user.id}>
                    **{user.name}** ({user.role}) cadastrado em {user.createdAt?.toDate().toLocaleDateString('pt-BR') || 'N/A'}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasNewFeedbacks && (
            <div className="mb-4">
              <h3 className="font-semibold text-lg text-green-700 mb-2">Novos Feedbacks Recebidos:</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {notifications.newFeedbacks.map(feedback => (
                  <li key={feedback.id}>
                    Feedback de **{feedback.userName}** ({feedback.userRole}) em {feedback.timestamp?.toDate().toLocaleDateString('pt-BR') || 'N/A'}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasRecentAdminLogins && (
            <div className="mb-4">
              <h3 className="font-semibold text-lg text-yellow-700 mb-2">Logins Recentes de Administradores:</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {notifications.recentAdminLogins.map(log => (
                  <li key={log.id}>
                    **{log.name}** logou em {log.timestamp?.toDate().toLocaleString('pt-BR') || 'N/A'}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="p-4 border-t text-right">
          <button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}