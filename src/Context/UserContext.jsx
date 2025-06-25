import React, { createContext, useState, useContext, useEffect } from 'react';


// Cria o contexto para armazenar os dados do usuário.
const UserContext = createContext();


// Componente Provedor que irá envolver nosso aplicativo.
export function UserProvider({ children }) {
  // Ao iniciar, ele tenta ler os dados do usuário do localStorage.
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('ictgUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Falha ao ler o usuário do localStorage", error);
      return null;
    }
  });


  // A função login agora salva no localStorage e atualiza o estado.
  const login = (name, role) => {
    const userData = { name, role };
    try {
      localStorage.setItem('ictgUser', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Falha ao salvar o usuário no localStorage", error);
    }
  };


  const logout = () => {
    localStorage.removeItem('ictgUser');
    setUser(null);
  };


  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}


// Hook customizado para facilitar o acesso aos dados do usuário.
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
}


