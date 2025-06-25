import React, { useState, useContext, createContext, useEffect } from 'react';
import { useUser } from './UserContext'; // Importar o useUser para identificar o usuário

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const { user } = useUser(); // Obter o usuário atual
  const [progress, setProgress] = useState({});

  // Efeito para CARREGAR o progresso do localStorage quando o usuário muda (ao logar)
  useEffect(() => {
    if (user) {
      const userProgressKey = `progress_${user.name}_${user.role}`;
      const savedProgress = localStorage.getItem(userProgressKey);
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      } else {
        setProgress({}); // Reseta o progresso se for um novo usuário sem dados salvos
      }
    } else {
      setProgress({}); // Limpa o progresso ao fazer logout
    }
  }, [user]); // Depende do 'user' para re-executar

  // Efeito para SALVAR o progresso no localStorage sempre que ele mudar
  useEffect(() => {
    if (user && Object.keys(progress).length > 0) {
      const userProgressKey = `progress_${user.name}_${user.role}`;
      localStorage.setItem(userProgressKey, JSON.stringify(progress));
    }
  }, [progress, user]); // Depende de 'progress' e 'user'

  const saveQuizResult = (moduleId, score, totalQuestions) => {
    setProgress(prev => ({
      ...prev,
      [moduleId]: { completed: true, score, totalQuestions }
    }));
  };

  const value = { progress, saveQuizResult };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressContext);
}