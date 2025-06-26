import React, { useState, useEffect } from 'react';
import { useUser } from '../Context/UserContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

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
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [allUserData, setAllUserData] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [roleData, setRoleData] = useState([]);

  useEffect(() => {
    const users = [];
    const savedFeedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    setFeedbacks(savedFeedbacks);

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('progress_')) {
        const progressData = JSON.parse(localStorage.getItem(key));
        const keyParts = key.replace('progress_', '').split('_');
        const userRole = keyParts.pop();
        const userName = keyParts.join(' ');
        users.push({ name: userName, role: userRole, progress: progressData });
      }
    }
    setAllUserData(users);

    const roleCounts = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});
    setRoleData(Object.keys(roleCounts).map(role => ({ name: role, value: roleCounts[role] })));
  }, []);

  const handleDeleteUser = (userToDelete) => {
    if (window.confirm(`Tem certeza que deseja deletar os dados de progresso de "${userToDelete.name}"?`)) {
      const userKey = `progress_${userToDelete.name}_${userToDelete.role}`;
      localStorage.removeItem(userKey);
      setAllUserData(prevData => prevData.filter(u => u.name !== userToDelete.name || u.role !== userToDelete.role));
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };
  useEffect(() => { if (!user || user.role !== 'Desenvolvedor') navigate('/home'); }, [user, navigate]);
  if (user?.role !== 'Desenvolvedor') return null;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <header className="bg-white p-4 rounded-xl shadow-md mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-800">Dashboard do Desenvolvedor</h1>
          <p className="text-gray-500">Visão geral do progresso e feedback dos usuários.</p>
        </div>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg">Logout</button>
      </header>
      
      {/* SEÇÃO DE ESTATÍSTICAS RESTAURADA */}
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

      {/* SEÇÃO DE TABELA DE USUÁRIOS RESTAURADA */}
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
                    <button onClick={() => handleDeleteUser(data)} className="bg-red-100 text-red-700 hover:bg-red-200 text-xs font-bold py-1 px-3 rounded-full">Deletar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SEÇÃO DE FEEDBACKS */}
      <div className="mt-8">
        <h2 className="text-3xl font-black text-gray-800 mb-6">Feedbacks e Depoimentos</h2>
        {feedbacks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbacks.map(fb => <TestimonialCard key={fb.id} feedback={fb} />)}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl text-center">
            <p className="text-gray-500">Nenhum feedback recebido ainda.</p>
          </div>
        )}
      </div>
    </div>
  );
}