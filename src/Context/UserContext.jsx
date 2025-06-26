import React, { useState, useContext, createContext, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { signInAnonymously, onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  // O 'loading' agora representa todo o processo de verificação de auth + perfil
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged é o vigia do Firebase para status de login
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser.displayName) {
        // Se o Firebase diz que o usuário está logado E JÁ TEM UM NOME DEFINIDO...
        
        // ...buscamos os dados extras dele (o perfil/role) no Firestore.
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          // Se encontramos o documento, criamos o objeto de usuário completo
          setUser({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName,
            role: userDoc.data().role 
          });
        } else {
          // Se não encontramos (caso raro de erro), consideramos deslogado
          setUser(null);
        }
      } else {
        // Se não há usuário no Firebase, o usuário está deslogado.
        setUser(null);
      }
      // Só terminamos o carregamento DEPOIS de todo o processo
      setLoading(false);
    });

    return () => unsubscribe(); // Limpeza do listener
  }, []);

  const login = async (name, role) => {
    try {
      const userCredential = await signInAnonymously(auth);
      const firebaseUser = userCredential.user;

      // 1. Salva o nome no perfil de autenticação do Firebase
      await updateProfile(firebaseUser, { displayName: name });
      
      // 2. Salva o perfil (role) e o nome no banco de dados Firestore,
      //    usando o ID único (uid) como chave do documento.
      await setDoc(doc(db, "users", firebaseUser.uid), {
        name: name,
        role: role,
      });

      // 3. Atualiza o estado local para uma resposta imediata da UI
      setUser({
        uid: firebaseUser.uid,
        name: name,
        role: role,
      });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {/* O '!loading' garante que os filhos só renderizem após a verificação inicial */}
      {!loading && children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}