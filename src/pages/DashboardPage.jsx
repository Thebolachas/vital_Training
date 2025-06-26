import React, { useState, useEffect } from 'react';
import { useUser } from '../Context/UserContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { db } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const TestimonialCard = ({ feedback }) => {
  const renderStars = (rating) => '★'.repeat(rating || 0) + '☆'.repeat(5 - (rating || 0));
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
      <p className="text-gray-800 italic">"{feedback.openText}"</p>
      <p className="text-right font-bold mt-4 text-blue-700">- {feedback.userName} ({feedback.userRole})</p>
      <div className="mt-4 pt-4 border-t text-sm text-gray-600 space-y-1">
        <p>Conteúdo: <span className="text-yellow-500">{renderStars(feedback.ratings.conteudo)}</span></p>
        <p>Mídia: <span className="text-yellow-500">{renderStars(feedback.ratings.imagens)}</span></p>
        <p>Aprendizado: <span className="text-yellow-500">{renderStars(feedback.ratings.aprendizado)}</span></p>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useUser();
  const navigate = useNavigate();
  const [allUserData, setAllUserData] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Carregar dados de usuários e progressos
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const progressSnapshot = await getDocs(collection(db, 'progress'));
      const progressMap = {};
      progressSnapshot.forEach(doc => { progressMap[doc.id] = doc.data(); });

      const combinedData = usersList.map(u => ({ ...u, progress: progressMap[u.id] || {} }));
      setAllUserData(combinedData);
      
      // Carregar feedbacks do Firestore
      const feedbacksSnapshot = await getDocs(collection(db, 'feedbacks'));
      const feedbacksList = feedbacksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFeedbacks(feedbacksList);

      // Processar dados para gráficos
      const roleCounts = usersList.reduce((acc, u) => ({ ...acc, [u.role]: (acc[u.role] || 0) + 1 }), {});
      setRoleData(Object.keys(roleCounts).map(role => ({ name: role, value: roleCounts[role] })));
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard: ", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (!authLoading) {
      if (user?.role === 'Desenvolvedor') {
        fetchData();
      } else {
        navigate('/home');
      }
    }
  }, [user, authLoading, navigate]);

  const handleDeleteUser = async (userToDelete) => {
    if (window.confirm(`Tem certeza que deseja deletar o usuário "${userToDelete.name}" e todo o seu progresso?`)) {
      try {
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
  
  if (authLoading || isLoading) {
    return <div className="p-8 text-center">Carregando dados...</div>;
  }
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <header className="bg-white p-4 rounded-xl shadow-md mb-8 flex justify-between items-center">
        {/* ... Header ... */}
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
         {/* ... Gráficos ... */}
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow mb-8">
        {/* ... Tabela de Usuários ... */}
      </div>

      <div className="mt-8">
        <h2 className="text-3xl font-black text-gray-800 mb-6">Feedbacks e Depoimentos</h2>
        {feedbacks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbacks.map(fb => <TestimonialCard key={fb.id} feedback={fb} />)}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl text-center"><p className="text-gray-500">Nenhum feedback recebido ainda.</p></div>
        )}
      </div>
    </div>
  );
}