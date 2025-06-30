import React, { useState, useEffect } from 'react';
import { useUser } from '../Context/UserContext.jsx';
import { useNavigate } from 'react-router-dom';
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
  const { user, logout, loading: authLoading } = useUser();
  const navigate = useNavigate();
  const [allUserData, setAllUserData] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) return;
      if (user.role === 'Desenvolvedor') {
        fetchData();
      } else {
        navigate('/home');
      }
    }
  }, [user, authLoading, navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const progressSnapshot = await getDocs(collection(db, 'progress'));
      const progressMap = {};
      progressSnapshot.forEach(doc => { progressMap[doc.id] = doc.data(); });

      const combinedData = usersList.map(u => ({ ...u, progress: progressMap[u.id] || {} }));
      setAllUserData(combinedData);

      const feedbacksSnapshot = await getDocs(collection(db, 'feedbacks'));
      setFeedbacks(feedbacksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const roleCounts = usersList.reduce((acc, u) => ({ ...acc, [u.role]: (acc[u.role] || 0) + 1 }), {});
      setRoleData(Object.keys(roleCounts).map(role => ({ name: role, value: roleCounts[role] })));
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard: ", error);
      alert("Não foi possível carregar os dados do dashboard.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userToDelete) => {
    if (window.confirm(`Tem certeza que deseja deletar o usuário "${userToDelete.name}" e todo o seu progresso?`)) {
      try {
        await deleteDoc(doc(db, 'users', userToDelete.id));
        await deleteDoc(doc(db, 'progress', userToDelete.id));
        alert('Usuário deletado com sucesso!');
        fetchData();
      } catch (error) {
        console.error("Erro ao deletar usuário: ", error);
        alert('Falha ao deletar usuário.');
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (authLoading || !user) {
    return <div className="p-8 text-center">Verificando autenticação...</div>;
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <header className="bg-white p-4 rounded-xl shadow-md mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800">Dashboard do Desenvolvedor</h1>
          <p className="text-gray-500">Visão geral do progresso e feedback dos usuários.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={fetchData} disabled={isLoading} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg disabled:bg-blue-300">
            {isLoading ? 'Atualizando...' : 'Atualizar Dados'}
          </button>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg">
            Logout
          </button>
        </div>
      </header>

      {isLoading ? (
        <div className="text-center p-10">Carregando dados...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-bold text-gray-700 mb-4">Usuários por Perfil</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={roleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                    {roleData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-6 rounded-xl shadow flex flex-col justify-center items-center">
              <h3 className="text-lg font-semibold text-gray-500">Usuários Totais</h3>
              <p className="text-7xl font-bold text-blue-600">{allUserData.length}</p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow mb-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Detalhes por Usuário</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr className="border-b">
                    <th className="p-3 font-semibold">Nome</th>
                    <th className="p-3 font-semibold">Perfil</th>
                    <th className="p-3 font-semibold">Módulos Concluídos</th>
                    <th className="p-3 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {allUserData.map((data, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{data.name}</td>
                      <td className="p-3 text-gray-600">{data.role}</td>
                      <td className="p-3 text-gray-600">{Object.values(data.progress).filter(p => p.completed).length}</td>
                      <td className="p-3">
                        <button onClick={() => handleDeleteUser(data)} className="bg-red-100 text-red-700 hover:bg-red-200 text-xs font-bold py-1 px-3 rounded-full">
                          Deletar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
        </>
      )}
    </div>
  );
}
