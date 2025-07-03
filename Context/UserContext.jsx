import { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { signInAnonymously, onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser.displayName) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUser({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName,
            role: userDoc.data().role
          });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);  // Set loading to false after checking user status
    });

    return () => unsubscribe();
  }, []);

  const login = async (name, role) => {
    try {
      const userCredential = await signInAnonymously(auth);
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, { displayName: name });
      await setDoc(doc(db, "users", firebaseUser.uid), { name, role });

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
      {!loading && children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
