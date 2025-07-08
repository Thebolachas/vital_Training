// src/pages/DashboardPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useUser } from '../Context/UserContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { db } from '../firebaseConfig';
// Importado 'limit' para a query de admin_logins
import { collection, getDocs, deleteDoc, doc, query, orderBy, where, Timestamp, limit, updateDoc, serverTimestamp } from 'firebase/firestore'; 
import { saveAs } from 'file-saver';
import { modulosData } from '../Data/dadosModulos.jsx';
import NotificationModal from '../components/NotificationModal.jsx';
import { Bell } from 'lucide-react'; // Certifique-se que 'lucide-react' está instalado

function TestimonialCard({ feedback }) {
  const [expanded, setExpanded] = useState(false);
  const renderStars = (rating) => '★'.repeat(rating || 0) + '☆'.repeat(5 - (rating || 0));

  return (
    <div onClick={() => setExpanded(!expanded)} className="cursor-pointer bg-white p-6 rounded-xl shadow-lg transition-all hover:scale-[1.02]">
      <p className="text-gray-800 italic">"{feedback.openText}"</p>
      <p className="text-right font-bold mt-4 text-blue-700">- {feedback.userName} ({feedback.userRole})</p>
      {expanded && (
        <div className="mt-4 pt-4 border-t text-sm text-gray-600 space-y-1">
          <p>Conteúdo: <span className="text-yellow-500">{renderStars(feedback.ratings.conteudo)}</span></p>
          <p>Imagens: <span className="text-yellow-500">{renderStars(feedback.ratings.imagens)}</span></p>
          <p>Aprendizado: <span className="text-yellow-500">{renderStars(feedback.ratings.aprendizado)}</span></p>
          <p>NPS: <span className="text-blue-600 font-bold">{feedback.nps ?? '-'}</span></p>
          <p>CSAT: <span className="text-green-600 text-xl">{['😡','😕','😐','🙂','😍'][feedback.csat - 1] || '-'}</span></p>
        </div>
      )}
    </div>
  );
}

const calculateUserCertificateStatus = (user, userProgress, allModulosData) => {
  if (!user || !userProgress) {
    return false;
  }

  const baseModules = ['1', '2', '3', '4'];
  const advancedModules = ['5'];
  const privilegedRoles = ['Médico(a)', 'Residente', 'Estudante'];
  const isPrivileged = privilegedRoles.includes(user.role);

  let requiredModulesForCertificate = [];

  if (user.role === 'Adm') {
      requiredModulesForCertificate = Object.keys(allModulosData);
  } else if (isPrivileged) {
      requiredModulesForCertificate = [...baseModules, ...advancedModules];
  } else {
      requiredModulesForCertificate = baseModules;
  }

  const modulesWithQuizzesForCertificate = requiredModulesForCertificate.filter(id => allModulosData[id]?.teoria2D || allModulosData[id]?.simulacao3D);
  const completedCount = modulesWithQuizzesForCertificate.filter(id => userProgress[id]?.completed).length;

  return completedCount === modulesWithQuizzesForCertificate.length && modulesWithQuizzesForCertificate.length > 0;
};


export default function DashboardPage() {
  const { user, logout, loading: authLoading } = useUser();
  const navigate = useNavigate();
  const [allUserData, setAllUserData] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [adminLoginLogs, setAdminLoginLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filterRole, setFilterRole] = useState('');
  const [filterName, setFilterName] = useState('');

  const [selectedUsers, setSelectedUsers] = useState([]);

  // Estados para Notificações
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notificationData, setNotificationData] = useState({ newUsers: [], newFeedbacks: [], recentAdminLogins: [] });
  const [newNotificationsCount, setNewNotificationsCount] = useState(0);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'Adm') {
      navigate('/home');
    } else {
      fetchData();
      fetchAdminLogs();
      fetchNotifications(); // Buscar notificações ao carregar
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

      const combinedData = usersList.map(u => {
        const userProgress = progressMap[u.id] || {};
        const baseModules = ['1', '2', '3', '4'];
        const advancedModules = ['5'];
        const privilegedRoles = ['Médico(a)', 'Residente', 'Estudante'];
        const isPrivileged = privilegedRoles.includes(u.role);

        let userRequiredModules = [];
        if (u.role === 'Adm') {
            userRequiredModules = Object.keys(modulosData);
        } else if (isPrivileged) {
            userRequiredModules = [...baseModules, ...advancedModules];
        } else {
            userRequiredModules = baseModules;
        }

        const userModulesWithQuizzes = userRequiredModules.filter(id => modulosData[id]?.teoria2D || modulosData[id]?.simulacao3D);
        const userCompletedCount = userModulesWithQuizzes.filter(id => (userProgress[id] || {})?.completed).length;
        const userTotalModules = userModulesWithQuizzes.length;
        const completionPercentage = userTotalModules > 0 ? (userCompletedCount / userTotalModules) * 100 : 0;
        
        const hasCertificate = calculateUserCertificateStatus(u, userProgress, modulosData);

        return {
          ...u,
          progress: userProgress,
          completedModules: userCompletedCount,
          totalModules: userTotalModules,
          completionPercentage: completionPercentage,
          hasCertificate: hasCertificate,
          registrationDate: u.createdAt ? u.createdAt.toDate() : null
        };
      });
      setAllUserData(combinedData);

      const feedbacksSnapshot = await getDocs(collection(db, 'feedbacks'));
      setFeedbacks(feedbacksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const roleCounts = usersList.reduce((acc, u) => ({ ...acc, [u.role]: (acc[u.role] || 0) + 1 }), {});
      setRoleData(Object.keys(roleCounts).map(role => ({ name: role, value: roleCounts[role] })));
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard: ", error);
      alert("Não foi possível carregar os dados do dashboard. Verifique o console para mais detalhes.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdminLogs = async () => {
    try {
      const q = query(collection(db, 'admin_logins'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const logs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAdminLoginLogs(logs);
    } catch (error) {
      console.error("Erro ao carregar logs de Adm:", error);
    }
  };

  // Função para buscar notificações (novos usuários e feedbacks)
  const fetchNotifications = async () => {
    // Obter o timestamp da última vez que o Adm viu as notificações
    // Se user.lastNotificationsViewed não existir, usar uma data bem antiga (início do UNIX epoch)
    const lastViewedTimestamp = user?.lastNotificationsViewed || Timestamp.fromDate(new Date(0));

    // Novos Usuários (apenas aqueles criados APÓS a última visualização)
    const usersQuery = query(collection(db, 'users'), where('createdAt', '>', lastViewedTimestamp), orderBy('createdAt', 'desc'));
    const usersSnapshot = await getDocs(usersQuery);
    const newUsers = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Novos Feedbacks (apenas aqueles criados APÓS a última visualização)
    const feedbacksQuery = query(collection(db, 'feedbacks'), where('timestamp', '>', lastViewedTimestamp), orderBy('timestamp', 'desc'));
    const feedbacksSnapshot = await getDocs(feedbacksQuery);
    const newFeedbacks = feedbacksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Registros de Login de Adm recentes (apenas aqueles criados APÓS a última visualização)
    const adminLogsQuery = query(collection(db, 'admin_logins'), where('timestamp', '>', lastViewedTimestamp), orderBy('timestamp', 'desc'), limit(5)); // Manter limit opcional
    const adminLogsSnapshot = await getDocs(adminLogsQuery);
    const recentAdminLogins = adminLogsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    setNotificationData({ newUsers, newFeedbacks, recentAdminLogins });
    setNewNotificationsCount(newUsers.length + newFeedbacks.length + recentAdminLogins.length); // Total de novos itens para o badge
  };

  // Função para marcar notificações como vistas
  const markNotificationsAsViewed = async () => {
    if (user && user.uid) {
      const userDocRef = doc(db, 'users', user.uid);
      try {
        await updateDoc(userDocRef, {
          lastNotificationsViewed: serverTimestamp(),
        });
        // Atualiza o estado local do usuário para que o sininho suma imediatamente
        // (O user no contexto é imutável, então criamos um novo objeto para forçar o re-render se necessário)
        user.lastNotificationsViewed = Timestamp.now(); // Isso atualiza a referência dentro do objeto user do contexto
        setNewNotificationsCount(0); // Limpa o contador no UI imediatamente
        // Não é necessário chamar fetchNotifications() imediatamente aqui, pois o modal será fechado e reaberto vazio
        console.log("Notificações marcadas como vistas.");
      } catch (error) {
        console.error("Erro ao marcar notificações como vistas:", error);
      }
    }
  };

  const handleDeleteUser = async (userToDelete) => {
    if (window.confirm(`Tem certeza que deseja deletar o usuário "${userToDelete.name}" e todo o seu progresso?`)) {
      try {
        await deleteDoc(doc(db, 'users', userToDelete.id));
        await deleteDoc(doc(db, 'progress', userToDelete.id));
        alert('Usuário deletado com sucesso!');
        setSelectedUsers(prev => prev.filter(uid => uid !== userToDelete.id));
        fetchData();
        fetchNotifications();
      } catch (error) {
        console.error("Erro ao deletar usuário: ", error);
        alert('Falha ao deletar usuário.');
      }
    }
  };

  const handleDeleteSelectedUsers = async () => {
    if (selectedUsers.length === 0) {
      alert('Selecione pelo menos um usuário para deletar.');
      return;
    }
    if (window.confirm(`Tem certeza que deseja deletar ${selectedUsers.length} usuário(s) selecionado(s) e todo o seu progresso?`)) {
      try {
        await Promise.all(selectedUsers.map(async (userId) => {
          await deleteDoc(doc(db, 'users', userId));
          await deleteDoc(doc(db, 'progress', userId));
        }));
        
        alert('Usuários selecionados deletados com sucesso!');
        setSelectedUsers([]);
        fetchData();
        fetchNotifications();
      } catch (error) {
        console.error("Erro ao deletar usuários selecionados: ", error);
        alert('Falha ao deletar usuários selecionados.');
      }
    }
  };

  const handleToggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(filteredUserData.map(u => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleCheckboxChange = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const exportToCSV = () => {
    const headers = ['Nome', 'Função', 'Módulos Concluídos', '% Acertos', 'NPS', 'CSAT', 'Certificado', 'Data de Cadastro'];
    const data = filteredUserData.map(user => {
      const feedback = feedbacks.find(fb => fb.userName === user.name);
      const completed = Object.values(user.progress || {}).filter(p => p.completed).length;
      const total = Object.values(user.progress || {}).reduce((acc, p) => acc + (p.totalQuestions || 0), 0);
      const correct = Object.values(user.progress || {}).reduce((acc, p) => acc + (p.score || 0), 0);
      const acertos = total > 0 ? `${Math.round((correct / total) * 100)}%` : '-';
      return [
        user.name,
        user.role,
        completed,
        acertos,
        feedback?.nps ?? '-',
        feedback?.csat ?? '-',
        user.hasCertificate ? 'Sim' : 'Não',
        user.registrationDate ? user.registrationDate.toLocaleDateString() : '-'
      ];
    });
    const csv = [headers, ...data].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `relatorio_usuarios_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const filteredUserData = useMemo(() => {
    let filtered = allUserData;

    if (filterRole) {
      filtered = filtered.filter(u => u.role === filterRole);
    }
    if (filterName) {
      filtered = filtered.filter(u => u.name.toLowerCase().includes(filterName.toLowerCase()));
    }
    return filtered;
  }, [allUserData, filterRole, filterName]);

  const certificateChartData = useMemo(() => {
    const issued = filteredUserData.filter(u => u.hasCertificate).length;
    const notIssued = filteredUserData.length - issued;
    return [
      { name: 'Certificado Emitido', value: issued, color: '#4CAF50' },
      { name: 'Não Emitido', value: notIssued, color: '#F44336' },
    ];
  }, [filteredUserData]);

  if (authLoading || !user) {
    return <div className="p-8 text-center">Verificando autenticação...</div>;
  }

  const npsMedia = feedbacks.length ? (feedbacks.reduce((acc, f) => acc + (f.nps ?? 0), 0) / feedbacks.length).toFixed(1) : '-';
  const csatMedia = feedbacks.length ? (feedbacks.reduce((acc, f) => acc + (f.csat ?? 0), 0) / feedbacks.length).toFixed(1) : '-';
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <header className="bg-white p-4 rounded-xl shadow-md mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800">Dashboard do Administrador</h1>
          <p className="text-gray-500">Visão geral do progresso e feedback dos usuários.</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Sininho de Notificações */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotificationModalOpen(true);
                markNotificationsAsViewed(); // Marcar como visto ao abrir o modal
              }}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors relative"
            >
              <Bell size={24} className="text-gray-700" />
              {newNotificationsCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center -mt-1 -mr-1">
                  {newNotificationsCount}
                </span>
              )}
            </button>
          </div>
          <button onClick={exportToCSV} className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg">
            Exportar CSV
          </button>
          <button onClick={fetchData} disabled={isLoading} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg disabled:bg-blue-300">
            {isLoading ? 'Atualizando...' : 'Atualizar Dados'}
          </button>
          <Link to="/home" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg text-center">
            Acessar Módulos (Modo Adm)
          </Link>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg">
            Logout
          </button>
        </div>
      </header>

      {isLoading ? (
        <div className="text-center p-10">Carregando dados...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <h3 className="text-lg font-bold text-gray-700 mb-2">NPS Médio</h3>
              <p className="text-5xl font-black text-blue-600">{npsMedia}</p>
              <p className="text-gray-400">de 0 a 10</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <h3 className="text-lg font-bold text-gray-700 mb-2">CSAT Médio</h3>
              <p className="text-5xl font-black text-green-600">{csatMedia}</p>
              <p className="text-gray-400">escala de 1 a 5</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow text-center flex flex-col justify-center items-center">
              <h3 className="text-lg font-semibold text-gray-500">Usuários Totais</h3>
              <p className="text-7xl font-bold text-blue-600">{allUserData.length}</p>
            </div>
          </div>

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
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-bold text-gray-700 mb-4">Status de Certificação</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={certificateChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                    {certificateChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow mb-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Filtrar Usuários</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="filterRole" className="block text-sm font-medium text-gray-700 mb-1">Função</label>
                <select
                  id="filterRole"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todas</option>
                  <option>Enfermagem</option>
                  <option>Médico(a)</option>
                  <option>Estudante</option>
                  <option>Adm</option>
                  <option>Outro</option>
                </select>
              </div>
              <div>
                <label htmlFor="filterName" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  id="filterName"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Buscar por nome"
                />
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-700">Detalhes por Usuário</h2>
              <button
                onClick={handleDeleteSelectedUsers}
                disabled={selectedUsers.length === 0}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Deletar Selecionados ({selectedUsers.length})
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr className="border-b">
                    <th className="p-3 font-semibold">
                      <input
                        type="checkbox"
                        onChange={handleToggleSelectAll}
                        checked={selectedUsers.length === filteredUserData.length && filteredUserData.length > 0}
                      />
                    </th>
                    <th className="p-3 font-semibold">Nome</th>
                    <th className="p-3 font-semibold">Perfil</th>
                    <th className="p-3 font-semibold">Módulos Concluídos</th>
                    <th className="p-3 font-semibold">Progresso (%)</th>
                    <th className="p-3 font-semibold">Certificado</th>
                    <th className="p-3 font-semibold">Data Cadastro</th>
                    <th className="p-3 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUserData.length > 0 ? (
                    filteredUserData.map((data, index) => (
                      <tr key={data.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(data.id)}
                            onChange={() => handleCheckboxChange(data.id)}
                          />
                        </td>
                        <td className="p-3 font-medium">{data.name}</td>
                        <td className="p-3 text-gray-600">{data.role}</td>
                        <td className="p-3 text-gray-600">{data.completedModules} de {data.totalModules}</td>
                        <td className="p-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${data.completionPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 mt-1 block">{data.completionPercentage.toFixed(0)}%</span>
                        </td>
                        <td className="p-3">{data.hasCertificate ? 'Sim' : 'Não'}</td>
                        <td className="p-3">{data.registrationDate ? data.registrationDate.toLocaleDateString() : 'N/A'}</td>
                        <td className="p-3">
                          <button onClick={() => handleDeleteUser(data)} className="bg-red-100 text-red-700 hover:bg-red-200 text-xs font-bold py-1 px-3 rounded-full">
                            Deletar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="p-3 text-center text-gray-500">Nenhum usuário encontrado com os filtros aplicados.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow mb-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Registros de Login de Administradores</h2>
            {adminLoginLogs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr className="border-b">
                      <th className="p-3 font-semibold">Nome do Adm</th>
                      <th className="p-3 font-semibold">Data/Hora</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminLoginLogs.map(log => (
                      <tr key={log.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{log.name}</td>
                        <td className="p-3">{log.timestamp?.toDate().toLocaleString('pt-BR') || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-6 text-gray-500">Nenhum registro de login de administrador.</div>
            )}
          </div>

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
        </>
      )}

      {/* Modal de Notificações */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        notifications={notificationData}
      />
    </div>
  );
}