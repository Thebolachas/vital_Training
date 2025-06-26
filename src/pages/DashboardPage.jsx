import React, { useState, useEffect } from 'react';
import { useUser } from '../Context/UserContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { db } from '../firebaseConfig'; // Importar o db
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'; // Importar funções do Firestore

const TestimonialCard = ({ feedback }) => { /* ... (código do card sem alterações) ... */ };

export default function DashboardPage() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [allUserData, setAllUserData] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Função para carregar todos os dados do Firestore
  const fetchData = async () => {
    setLoadingData(true);
    // Carregar dados de usuários e seus perfis
    const usersCollectionRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollectionRef);
    const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Carregar dados de progresso
    const progressCollectionRef = collection(db, 'progress');
    const progressSnapshot = await getDocs(progressCollectionRef);
    const progressMap = {};
    progressSnapshot.forEach(doc => {
      progressMap[doc.id] = doc.data();
    });

    // Combinar dados de usuário com progresso
    const combinedData = usersList.map(u => ({
      ...u,
      progress: progressMap[u.id] || {}
    }));
    
    setAllUserData(combinedData);

    // Carregar feedbacks
    const savedFeedbacks = JSON.parse(localStorage.getItem('feedbacks')) || []; // Feedback ainda pode vir do localStorage por enquanto
    setFeedbacks(savedFeedbacks);

    // Processar dados para gráficos
    const roleCounts = usersList.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});
    setRoleData(Object.keys(roleCounts).map(role => ({ name: role, value: roleCounts[role] })));
    setLoadingData(false);
  };
  
  useEffect(() => {
    if (user?.role === 'Desenvolvedor') {
      fetchData();
    }
  }, [user]);

  const handleDeleteUser = async (userToDelete) => {
    if (window.confirm(`Tem certeza que deseja deletar o usuário "${userToDelete.name}" e todo o seu progresso?`)) {
      try {
        // Deleta o documento do usuário e o de progresso
        await deleteDoc(doc(db, 'users', userToDelete.id));
        await deleteDoc(doc(db, 'progress', userToDelete.id));
        alert('Usuário deletado com sucesso!');
        fetchData(); // Recarrega os dados para atualizar a tela
      } catch (error) {
        console.error("Erro ao deletar usuário: ", error);
        alert('Falha ao deletar usuário.');
      }
    }
  };

  // ... (lógica de logout e proteção de rota) ...
  
  if (loadingData) return <div className="p-8">Carregando dados do dashboard...</div>

  // ... (resto do seu JSX do Dashboard, substituindo a tabela) ...
  // A tabela agora usa 'userToDelete.id' para a chave de deleção
  // ... (o JSX para o dashboard da resposta anterior pode ser usado, apenas mudando o onClick do botão de deletar para handleDeleteUser(data))
}