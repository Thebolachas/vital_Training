import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../Context/UserContext.jsx';  // Certifique-se de que você tem o contexto de usuário

// Componente ProtectedRoute para proteger rotas específicas
const ProtectedRoute = ({ element, role }) => {
  const { user } = useUser();  // Pega o usuário do contexto

  // Se o usuário não estiver autenticado, redireciona para a tela de login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se a rota exigir uma role específica, verifica se o usuário tem essa role
  if (role && user.role !== role) {
    return <Navigate to="/home" replace />;
  }

  // Se tudo estiver ok, renderiza o componente
  return element;
};

export default ProtectedRoute;
