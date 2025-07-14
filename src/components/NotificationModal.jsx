// src/components/NotificationModal.jsx
import React, { useEffect, useRef } from 'react';

// Este modal é adaptável para exibir mensagens simples OU dados de notificação
export default function NotificationModal({ isOpen, onClose, message, notifications }) {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    // Foca no modal ou no botão de fechar para acessibilidade
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    } else if (modalRef.current) {
      modalRef.current.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]); // Depende de isOpen e onClose

  if (!isOpen) return null;

  // Determinar se o modal está sendo usado para mensagens simples ou notificações complexas
  const isSimpleMessage = typeof message === 'string';
  const hasNotifications = notifications && (
    (notifications.newUsers && notifications.newUsers.length > 0) ||
    (notifications.newFeedbacks && notifications.newFeedbacks.length > 0) ||
    (notifications.recentAdminLogins && notifications.recentAdminLogins.length > 0)
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in-up" // Usando nova classe de animação
      onClick={onClose} // Permite clicar fora para fechar
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex="-1" // Torna o overlay focável para foco inicial
      ref={modalRef}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col animate-pop-in" // Usando nova classe de animação
        onClick={(e) => e.stopPropagation()} // Impede cliques internos de fechar o modal
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 id="modal-title" className="text-xl font-bold text-gray-800">
            {isSimpleMessage ? 'Aviso' : 'Notificações Recentes'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded"
            ref={closeButtonRef}
            aria-label="Fechar"
          >
            &times;
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-grow">
          {isSimpleMessage ? (
            <p className="text-gray-600 text-center">{message}</p>
          ) : (
            <>
              {!hasNotifications && (
                <p className="text-gray-600 text-center">Nenhum aviso recente.</p>
              )}

              {notifications.newUsers && notifications.newUsers.length > 0 && (
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

              {notifications.newFeedbacks && notifications.newFeedbacks.length > 0 && (
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

              {notifications.recentAdminLogins && notifications.recentAdminLogins.length > 0 && (
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
            </>
          )}
        </div>

        <div className="p-4 border-t text-right">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}