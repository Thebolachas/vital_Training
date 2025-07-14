import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../Context/UserContext.jsx';
import { ROLES } from '../utils/userRoles'; // Importar ROLES para consistência

// Componente ProtectedRoute para proteger rotas específicas
const ProtectedRoute = ({ children, allowedRoles }) => { // Usar children para renderizar o conteúdo
  const { user, loading } = useUser();  // Pega o usuário do contexto

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Verificando autenticação...</div>;
  }

  // Se o usuário não estiver autenticado, redireciona para a tela de login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se a rota exigir uma role específica, verifica se o usuário tem essa role
  // A verificação é mais robusta agora, usando o enum ROLES
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Se o usuário não tiver a role permitida, redireciona para /home
    return <Navigate to="/home" replace />;
  }

  // Se tudo estiver ok, renderiza o componente filho
  return children;
};

export default ProtectedRoute;