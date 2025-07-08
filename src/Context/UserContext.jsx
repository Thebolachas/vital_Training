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

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (firebaseUser) => {
    if (firebaseUser) {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = { uid: firebaseUser.uid, email: firebaseUser.email, ...userDocSnap.data() };
        setUser(userData);
        return userData;
      } else {
        const defaultUserData = { uid: firebaseUser.uid, email: firebaseUser.email, name: firebaseUser.displayName || firebaseUser.email, role: 'Outro', feedbackPromptDismissed: false }; // NOVO: feedbackPromptDismissed
        await setDoc(userDocRef, defaultUserData, { merge: true });
        setUser(defaultUserData);
        return defaultUserData;
      }
    } else {
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      fetchUserData(firebaseUser).finally(() => setLoading(false));
    });
    return () => unsubscribe();
  }, []);

  const registerWithEmail = async (name, email, password, role) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const userDocRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(userDocRef, {
        name,
        email,
        role,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        feedbackPromptDismissed: false, // NOVO: Inicializa como false no cadastro
      });

      const newUser = { uid: firebaseUser.uid, email: firebaseUser.email, name, role, feedbackPromptDismissed: false };
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

  const loginWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

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