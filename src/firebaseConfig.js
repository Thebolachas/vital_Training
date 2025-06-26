import { initializeApp } from "firebase/app";
// --- ALTERAÇÃO: Importando as ferramentas que realmente usamos ---
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Seu objeto de configuração está perfeito. Ele será usado aqui.
const firebaseConfig = {
  apiKey: "AIzaSyDxG31iFH8RUH8DNpc_pR6yAOSRgWFX_Bs",
  authDomain: "vitaltraining-87ed4.firebaseapp.com",
  projectId: "vitaltraining-87ed4",
  storageBucket: "vitaltraining-87ed4.firebasestorage.app",
  messagingSenderId: "412617217857",
  appId: "1:412617217857:web:962149d0a6b572ea0a33c0",
  measurementId: "G-YVLN7Z4GZ4"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// --- ALTERAÇÃO: Inicializando e exportando o banco de dados e a autenticação ---
// Isso permite que outros arquivos importem 'db' e 'auth' para conversar com o Firebase
export const db = getFirestore(app);
export const auth = getAuth(app);

// A parte de analytics que o Firebase sugere pode ser adicionada depois.
// Por enquanto, vamos focar no que é essencial para o app funcionar.