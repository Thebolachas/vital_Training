import React, { useState, useContext, createContext, useEffect } from 'react';
import { auth, db } from '../firebaseConfig'; // Importar do nosso arquivo de config
import { signInAnonymously, onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para saber se a autenticação está carregando

  useEffect(() => {
    // Este é o 'vigia' do Firebase. Ele roda sempre que o status de login muda.
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Usuário está logado. Vamos buscar os dados dele (nome e perfil) no Firestore.
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          // Combina os dados do Auth e do Firestore
          setUser({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName,
            ...userDoc.data() // Pega o 'role' que salvamos
          });
        }
      } else {
        // Usuário deslogou
        setUser(null);
      }
      setLoading(false); // Terminou de carregar
    });

    return () => unsubscribe(); // Limpa o 'vigia' ao desmontar o componente
  }, []);

  const login = async (name, role) => {
    try {
      const userCredential = await signInAnonymously(auth);
      const firebaseUser = userCredential.user;

      // Salva o nome no perfil de autenticação
      await updateProfile(firebaseUser, { displayName: name });
      
      // Salva o perfil (role) e o nome em um documento separado no Firestore
      // Usamos o ID único do usuário (uid) como nome do documento
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        name: name,
        role: role,
      });

      // Atualiza o estado local do usuário
      setUser({
        uid: firebaseUser.uid,
        name: name,
        role: role,
      });
    } catch (error) {
      console.error("Erro ao fazer login anônimo:", error);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  // Não renderiza o app enquanto a autenticação inicial não for checada
  if (loading) {
    return <div className="w-screen h-screen flex items-center justify-center"><p>Carregando...</p></div>;
  }
  
  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}