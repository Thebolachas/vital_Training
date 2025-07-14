// src/Context/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ROLES } from '../utils/userRoles'; // Importar ROLES para consistência e segurança

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar dados do usuário no Firestore, incluindo a função (role)
  const fetchUserData = async (firebaseUser) => {
    if (!firebaseUser) {
      setUser(null);
      return null;
    }
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = { uid: firebaseUser.uid, email: firebaseUser.email, ...userDocSnap.data() };
        setUser(userData);
        return userData;
      } else {
        // Se o documento do usuário não existir (raro, mas pode acontecer se for criado fora do app)
        // Criar um documento básico com a função padrão
        const defaultUserData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || 'Novo Usuário', // Nome padrão
          role: ROLES.OUTRO, // Função padrão SEGURA para garantir que não é Adm sem permissão
          feedbackPromptDismissed: false,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        };
        await setDoc(userDocRef, defaultUserData, { merge: true });
        setUser(defaultUserData);
        return defaultUserData;
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário no Firestore:", error);
      // Retorna dados básicos com uma função segura em caso de erro
      return { uid: firebaseUser.uid, email: firebaseUser.email, name: firebaseUser.displayName || 'Usuário', role: ROLES.OUTRO };
    }
  };

  // Observador de estado de autenticação do Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      await fetchUserData(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe(); // Limpeza do listener
  }, []);

  // Função para registrar novo usuário com e-mail e senha
  const registerWithEmail = async (name, email, password) => { // NÃO RECEBE 'role' como parâmetro aqui
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const userDocRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(userDocRef, {
        name,
        email,
        role: ROLES.ENFERMAGEM, // ATENÇÃO: A FUNÇÃO É DEFINIDA AQUI DE FORMA SEGURA (ex: Enfermagem), NÃO PELO CLIENTE!
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        feedbackPromptDismissed: false,
      });

      const newUser = { uid: firebaseUser.uid, email: firebaseUser.email, name, role: ROLES.ENFERMAGEM, feedbackPromptDismissed: false };
      setUser(newUser);
      return { success: true, user: newUser };
    } catch (error) {
      console.error("Erro no cadastro:", error);
      let errorMessage = "Erro ao cadastrar. ";
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage += "Este e-mail já está cadastrado. Tente fazer login ou recuperar a senha.";
          break;
        case 'auth/invalid-email':
          errorMessage += "Opa! O e-mail parece inválido. Por favor, verifique e tente novamente.";
          break;
        case 'auth/weak-password':
          errorMessage += "Sua senha é muito fraca. Use pelo menos 6 caracteres (letras, números, símbolos).";
          break;
        default:
          errorMessage += "Ocorreu um erro inesperado. Tente novamente mais tarde.";
      }
      return { success: false, error: errorMessage };
    }
  };

  // Função para fazer login com e-mail e senha
  const loginWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      console.log("UID do usuário autenticado APÓS LOGIN:", firebaseUser.uid); // <--- LOG PARA DEBUGAR

      const userDocRef = doc(db, 'users', firebaseUser.uid);
      await updateDoc(userDocRef, {
        lastLogin: serverTimestamp(),
      });

      const fetchedUser = await fetchUserData(firebaseUser);
      return { success: true, user: fetchedUser };
    } catch (error) {
      console.error("Erro no login:", error);
      let errorMessage = "Erro ao fazer login. ";
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMessage += "E-mail ou senha inválidos. Por favor, verifique e tente novamente.";
          break;
        case 'auth/invalid-email':
          errorMessage += "Opa! O e-mail parece inválido. Por favor, verifique e tente novamente.";
          break;
        case 'auth/too-many-requests':
          errorMessage += "Muitas tentativas falhas. Sua conta foi temporariamente bloqueada por segurança. Tente novamente mais tarde.";
          break;
        default:
          errorMessage += "Ocorreu um erro inesperado. Tente novamente mais tarde.";
      }
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log("Usuário deslogado com sucesso.");
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error("Erro ao enviar e-mail de recuperação:", error);
      let errorMessage = "Erro ao enviar o link. ";
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage += "Nenhum usuário encontrado com este e-mail. Por favor, verifique o endereço.";
          break;
        case 'auth/invalid-email':
          errorMessage += "O e-mail digitado é inválido. Por favor, verifique.";
          break;
        default:
          errorMessage += "Ocorreu um erro inesperado. Tente novamente mais tarde.";
      }
      return { success: false, error: errorMessage };
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, registerWithEmail, loginWithEmail, logout, resetPassword }}>
      {children}
    </UserContext.Provider>
  );
};