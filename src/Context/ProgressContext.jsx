// src/Context/ProgressContext.jsx
import React, { useState, useContext, createContext, useEffect, useCallback } from 'react';
import { useUser } from './UserContext';  // Certificando-se que useUser está importado corretamente
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const { user } = useUser();  // Usando o hook useUser para obter o usuário
  const [progress, setProgress] = useState({});

  // Efeito para CARREGAR o progresso do Firestore quando o usuário loga
  useEffect(() => {
    const fetchProgress = async () => {
      if (user && user.uid) {
        const progressDocRef = doc(db, 'progress', user.uid);
        const progressDoc = await getDoc(progressDocRef);
        if (progressDoc.exists()) {
          setProgress(progressDoc.data());
        } else {
          setProgress({});
        }
      }
    };
    fetchProgress();
  }, [user]);

  // Função para SALVAR o progresso no Firestore
  const saveProgress = useCallback(async (newProgress) => {
    if (user && user.uid) {
      const progressDocRef = doc(db, 'progress', user.uid);
      try {
        await setDoc(progressDocRef, newProgress, { merge: true });
      } catch (error) {
        console.error("Erro ao salvar progresso:", error);
      }
    }
  }, [user]);

  // Atualiza o estado local e chama a função para salvar no Firestore
  const saveQuizResult = (moduleId, score, totalQuestions) => {
    const newProgressState = {
      ...progress,
      [moduleId]: { completed: true, score, totalQuestions }
    };
    setProgress(newProgressState);
    saveProgress(newProgressState);
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
