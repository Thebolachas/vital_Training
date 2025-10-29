// src/pages/DashboardPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useUser } from '../Context/UserContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { db } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, doc, query, orderBy, where, Timestamp, limit, updateDoc, serverTimestamp } from 'firebase/firestore'; 
import { saveAs } from 'file-saver';
import { modulosData } from '../Data/dadosModulos.jsx';
import NotificationModal from '../components/NotificationModal.jsx';
import Badge from '../components/Badge.jsx';
import { Bell, Users, TrendingUp, Smile, Download, RefreshCw, LogOut, Home, Trash2, UserPlus } from 'lucide-react'; // Adicionado UserPlus

// Componente para os cards de depoimento
function TestimonialCard({ feedback }) {
    const [expanded, setExpanded] = useState(false);
    const renderStars = (rating) => '★'.repeat(rating || 0) + '☆'.repeat(5 - (rating || 0));
    return (
        <div onClick={() => setExpanded(!expanded)} className="cursor-pointer bg-white p-4 sm:p-6 rounded-xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
            <p className="text-gray-800 italic text-sm sm:text-base">"{feedback.openText}"</p>
            <p className="text-right font-bold mt-3 sm:mt-4 text-blue-700 text-xs sm:text-sm">- {feedback.userName} ({feedback.userRole})</p>
            {expanded && (
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t text-xs sm:text-sm text-gray-600 space-y-1">
                    <p>Conteúdo: <span className="text-yellow-500">{renderStars(feedback.ratings.conteudo)}</span></p>
                    <p>Imagens: <span className="text-yellow-500">{renderStars(feedback.ratings.imagens)}</span></p>
                    <p>Aprendizado: <span className="text-yellow-500">{renderStars(feedback.ratings.aprendizado)}</span></p>
                    <p>NPS: <span className="text-blue-600 font-bold">{feedback.nps ?? '-'}</span></p>
                    <p>CSAT: <span className="text-green-600 text-base sm:text-xl">{['😡','😕','😐','🙂','😍'][feedback.csat - 1] || '-'}</span></p>
                </div>
            )}
        </div>
    );
}

// Lógica de cálculo do certificado
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

// Card de Estatística (KPI)
const StatsCard = ({ title, value, icon, unit }) => (
    <div className="bg-white p-5 rounded-xl shadow-lg flex items-center space-x-4 transition-all hover:shadow-xl hover:scale-105">
      <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900">
          {value}
          {unit && <span className="text-base font-normal text-gray-500 ml-1">{unit}</span>}
        </p>
      </div>
    </div>
);


export default function DashboardPage() {
    const { user, logout, loading: authLoading } = useUser();
    const navigate = useNavigate();
    const [allUserData, setAllUserData] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [roleData, setRoleData] = useState([]);
    const [adminLoginLogs, setAdminLoginLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdatingRole, setIsUpdatingRole] = useState(false); // Loading da promoção

    // --- FILTROS ---
    const [filterRole, setFilterRole] = useState('');
    const [filterName, setFilterName] = useState('');
    const [filterCompletion, setFilterCompletion] = useState(''); 
    // --- FIM FILTROS ---

    const [selectedUsers, setSelectedUsers] = useState([]);

    const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
    const [notificationData, setNotificationData] = useState({ newUsers: [], newFeedbacks: [], recentAdminLogins: [] });
    const [newNotificationsCount, setNewNotificationsCount] = useState(0);

    // Efeito para carregar dados
    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            navigate('/login');
        } else if (user.role !== 'Adm') {
            navigate('/home');
        } else {
            fetchData();
            fetchAdminLogs();
            fetchNotifications(); 
        }
    }, [user, authLoading, navigate]);

    // Função para buscar dados principais
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
        } finally {
            setIsLoading(false);
        }
    };
    
    // Função para buscar logs de admin
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

    // Função para buscar notificações
    const fetchNotifications = async () => {
        const lastViewedTimestamp = user?.lastNotificationsViewed || Timestamp.fromDate(new Date(0));
        const usersQuery = query(collection(db, 'users'), where('createdAt', '>', lastViewedTimestamp), orderBy('createdAt', 'desc'));
        const usersSnapshot = await getDocs(usersQuery);
        const newUsers = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const feedbacksQuery = query(collection(db, 'feedbacks'), where('timestamp', '>', lastViewedTimestamp), orderBy('timestamp', 'desc'));
        const feedbacksSnapshot = await getDocs(feedbacksQuery);
        const newFeedbacks = feedbacksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const adminLogsQuery = query(collection(db, 'admin_logins'), where('timestamp', '>', lastViewedTimestamp), orderBy('timestamp', 'desc'), limit(5));
        const adminLogsSnapshot = await getDocs(adminLogsQuery);
        const recentAdminLogins = adminLogsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotificationData({ newUsers, newFeedbacks, recentAdminLogins });
        setNewNotificationsCount(newUsers.length + newFeedbacks.length + recentAdminLogins.length);
    };

    // Função para marcar notificações como vistas
    const markNotificationsAsViewed = async () => {
        if (user && user.uid) {
            const userDocRef = doc(db, 'users', user.uid);
            try {
                await updateDoc(userDocRef, {
                    lastNotificationsViewed: serverTimestamp(),
                });
                user.lastNotificationsViewed = Timestamp.now(); 
                setNewNotificationsCount(0); 
            } catch (error) {
                console.error("Erro ao marcar notificações como vistas:", error);
            }
        }
    };

    // Função para deletar usuário
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

    // Função para deletar usuários selecionados
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

    // Funções de controle da tabela
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

    // Função de Logout
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    // Função de Exportar CSV
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
    
    // --- NOVA FUNÇÃO ---
    const handlePromoteToAdmin = async (userToPromote) => {
        if (userToPromote.role === 'Adm') {
            alert(`${userToPromote.name} já é um Administrador.`);
            return;
        }
        if (window.confirm(`Tem certeza que deseja promover "${userToPromote.name}" a Administrador?`)) {
            setIsUpdatingRole(true);
            try {
                const userDocRef = doc(db, 'users', userToPromote.id);
                await updateDoc(userDocRef, {
                    role: 'Adm'
                });
                alert('Usuário promovido a Adm com sucesso!');
                // Atualiza a lista localmente para refletir a mudança imediatamente
                setAllUserData(prevData => prevData.map(u => 
                    u.id === userToPromote.id ? { ...u, role: 'Adm' } : u
                ));
            } catch (error) {
                console.error("Erro ao promover usuário: ", error);
                alert('Falha ao promover usuário.');
            } finally {
                setIsUpdatingRole(false);
            }
        }
    };
    // --- FIM NOVA FUNÇÃO ---
    
    // useMemo para filtrar dados
    const filteredUserData = useMemo(() => {
        let filtered = allUserData;

        if (filterRole) {
            filtered = filtered.filter(u => u.role === filterRole);
        }
        if (filterName) {
            filtered = filtered.filter(u => u.name.toLowerCase().includes(filterName.toLowerCase()));
        }
        
        // Lógica do filtro de conclusão
        if (filterCompletion === 'concluido') {
            filtered = filtered.filter(u => u.hasCertificate);
        }
        if (filterCompletion === 'nao_concluido') {
             filtered = filtered.filter(u => !u.hasCertificate);
        }

        return filtered;
    }, [allUserData, filterRole, filterName, filterCompletion]); 

    // useMemo para gráfico de certificado
    const certificateChartData = useMemo(() => {
        const issued = filteredUserData.filter(u => u.hasCertificate).length;
        const notIssued = filteredUserData.length - issued;
        return [
            { name: 'Certificado Emitido', value: issued, color: '#4CAF50' },
            { name: 'Não Emitido', value: notIssued, color: '#F44336' },
        ];
    }, [filteredUserData]);

    // Verificação de loading de autenticação
    if (authLoading || !user) {
        return <div className="p-8 text-center">Verificando autenticação...</div>;
    }

    // Médias de NPS e CSAT
    const npsMedia = feedbacks.length ? (feedbacks.reduce((acc, f) => acc + (f.nps ?? 0), 0) / feedbacks.length).toFixed(1) : '-';
    const csatMedia = feedbacks.length ? (feedbacks.reduce((acc, f) => acc + (f.csat ?? 0), 0) / feedbacks.length).toFixed(1) : '-';
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    // --- RENDERIZAÇÃO ---
    return (
        <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
            <header className="bg-white p-4 sm:p-5 rounded-xl shadow-lg mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                 <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center sm:text-left">Dashboard</h1>
                    <p className="text-sm sm:text-base text-gray-500 text-center sm:text-left">Visão geral do sistema.</p>
                </div>
                <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 sm:gap-3">
                    <button onClick={exportToCSV} className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg text-sm sm:text-base flex items-center gap-2 transition-colors"><Download size={16} /> Exportar CSV</button>
                    <button onClick={fetchData} disabled={isLoading} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg disabled:bg-blue-300 text-sm sm:text-base flex items-center gap-2 transition-colors"><RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} /> {isLoading ? 'Atualizando' : 'Atualizar'}</button>
                    <Link to="/home" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg text-center text-sm sm:text-base flex items-center gap-2 transition-colors"><Home size={16} /> Módulos</Link>
                    <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg text-sm sm:text-base flex items-center gap-2 transition-colors"><LogOut size={16} /> Logout</button>
                    <div className="relative">
                        <button onClick={() => { setIsNotificationModalOpen(true); markNotificationsAsViewed(); }} className="p-3 rounded-full hover:bg-gray-200 transition-colors relative"><Bell size={20} className="text-gray-700" />{newNotificationsCount > 0 && (<span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center -mt-1 -mr-1 border-2 border-white">{newNotificationsCount}</span>)}</button>
                    </div>
                </div>
            </header>

            {isLoading ? (
                <div className="text-center p-10">Carregando dados...</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-2 space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatsCard title="Usuários Totais" value={allUserData.length} icon={<Users size={24} />}/>
                            <StatsCard title="NPS Médio" value={npsMedia} unit="de 10" icon={<TrendingUp size={24} />}/>
                            <StatsCard title="CSAT Médio" value={csatMedia} unit="de 5" icon={<Smile size={24} />}/>
                        </div>

                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Gerenciamento de Usuários</h2>
                            
                            {/* --- Área de Filtros (com 3 colunas) --- */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4 p-4 bg-gray-50 rounded-lg border">
                                <div>
                                    <label htmlFor="filterName" className="block text-sm font-medium text-gray-700 mb-1">Buscar por Nome</label>
                                    <input type="text" id="filterName" value={filterName} onChange={(e) => setFilterName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm sm:text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Digite um nome..."/>
                                </div>
                                <div>
                                    <label htmlFor="filterRole" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Função</label>
                                    <select id="filterRole" value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm sm:text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                        <option value="">Todas as Funções</option>
                                        <option>Enfermagem</option>
                                        <option>Médico(a)</option>
                                        <option>Estudante</option>
                                        <option>Adm</option>
                                        <option>Outro</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="filterCompletion" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Conclusão</label>
                                    <select id="filterCompletion" value={filterCompletion} onChange={(e) => setFilterCompletion(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm sm:text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                        <option value="">Todos os Status</option>
                                        <option value="concluido">Concluídos (com Certif.)</option>
                                        <option value="nao_concluido">Não Concluídos</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="flex justify-end items-center mb-4">
                                <button onClick={handleDeleteSelectedUsers} disabled={selectedUsers.length === 0} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base flex items-center gap-2"> <Trash2 size={16} /> Deletar Selecionados ({selectedUsers.length}) </button>
                            </div>

                            {/* --- TABELA ATUALIZADA --- */}
                            <div className="overflow-x-auto rounded-lg border border-gray-200">
                                <table className="w-full text-left table-auto">
                                    <thead className="bg-gray-100 text-xs sm:text-sm text-gray-600 uppercase">
                                        <tr className="border-b border-gray-200">
                                            <th className="p-3 font-semibold w-10"><input type="checkbox" onChange={handleToggleSelectAll} checked={selectedUsers.length === filteredUserData.length && filteredUserData.length > 0} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/></th>
                                            <th className="p-3 font-semibold">Nome</th>
                                            <th className="p-3 font-semibold">Perfil</th>
                                            <th className="p-3 font-semibold">Módulos Conc.</th>
                                            <th className="p-3 font-semibold">Progresso</th>
                                            <th className="p-3 font-semibold">Certificado</th>
                                            <th className="p-3 font-semibold whitespace-nowrap">Data Cadastro</th>
                                            <th className="p-3 font-semibold">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-xs sm:text-sm divide-y divide-gray-100">
                                        {filteredUserData.length > 0 ? (
                                            filteredUserData.map((data, index) => (
                                                <tr key={data.id} className="hover:bg-gray-50">
                                                    <td className="p-3"><input type="checkbox" checked={selectedUsers.includes(data.id)} onChange={() => handleCheckboxChange(data.id)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/></td>
                                                    <td className="p-3 font-medium text-gray-900 truncate max-w-xs">{data.name}</td>
                                                    <td className="p-3 text-gray-600 truncate max-w-xs">{data.role}</td>
                                                    <td className="p-3 text-gray-600 whitespace-nowrap">{data.completedModules} de {data.totalModules}</td>
                                                    <td className="p-3">
                                                        <div className="w-24 bg-gray-200 rounded-full h-2.5"><div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${data.completionPercentage}%` }}></div></div>
                                                        <span className="text-xs text-gray-500 mt-1 block">{data.completionPercentage.toFixed(0)}%</span>
                                                    </td>
                                                    <td className="p-3">{data.hasCertificate ? <Badge label="Sim" color="bg-green-500" /> : <Badge label="Não" color="bg-gray-400" />}</td>
                                                    <td className="p-3 whitespace-nowrap text-xs text-gray-500">{data.registrationDate ? data.registrationDate.toLocaleDateString() : 'N/A'}</td>
                                                    {/* --- BOTÕES DE AÇÃO ATUALIZADOS --- */}
                                                    <td className="p-3 whitespace-nowrap space-x-2">
                                                        {/* Botão Promover só aparece se o usuário NÃO for Adm */}
                                                        {data.role !== 'Adm' && (
                                                            <button 
                                                                onClick={() => handlePromoteToAdmin(data)} 
                                                                disabled={isUpdatingRole}
                                                                className="bg-green-100 text-green-700 hover:bg-green-200 text-xs font-bold py-1 px-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-wait"
                                                                title="Promover a Administrador"
                                                            >
                                                                <UserPlus size={14} className="inline -mt-0.5"/>
                                                            </button>
                                                        )}
                                                        <button 
                                                            onClick={() => handleDeleteUser(data)} 
                                                            disabled={isUpdatingRole}
                                                            className="bg-red-100 text-red-700 hover:bg-red-200 text-xs font-bold py-1 px-3 rounded-full transition-colors disabled:opacity-50"
                                                            title="Deletar Usuário"
                                                        >
                                                            <Trash2 size={14} className="inline -mt-0.5"/>
                                                        </button>
                                                    </td>
                                                    {/* --- FIM BOTÕES DE AÇÃO --- */}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan="8" className="p-4 text-center text-gray-500">Nenhum usuário encontrado com os filtros aplicados.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Card de Feedbacks (com verificação) */}
                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Feedbacks e Depoimentos</h2>
                            {feedbacks && feedbacks.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    {feedbacks.map(fb => <TestimonialCard key={fb.id} feedback={fb} />)}
                                </div>
                            ) : (
                                <div className="text-center p-6 text-gray-500 text-sm sm:text-base">
                                    Nenhum feedback recebido ainda.
                                </div>
                            )}
                        </div>

                    </div>

                    {/* --- COLUNA LATERAL --- */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Card dos Gráficos (com verificação) */}
                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Usuários por Perfil</h3>
                            <div style={{ width: '100%', height: 250 }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie data={roleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                                            {roleData && roleData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip />
                                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <hr className="my-6" />

                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Status de Certificação</h3>
                             <div style={{ width: '100%', height: 250 }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie data={certificateChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                                            {certificateChartData && certificateChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                        </Pie>
                                        <Tooltip />
                                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Card dos Logs de Admin (COM A VERIFICAÇÃO CORRETA) */}
                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Registros de Login (Admin)</h2>
                            {adminLoginLogs && adminLoginLogs.length > 0 ? (
                                <div className="overflow-y-auto max-h-[400px] rounded-lg border border-gray-200">
                                    <table className="w-full text-left table-auto">
                                        <thead className="bg-gray-100 text-xs sm:text-sm text-gray-600 uppercase sticky top-0">
                                            <tr className="border-b border-gray-200">
                                                <th className="p-3 font-semibold">Nome do Adm</th>
                                                <th className="p-3 font-semibold">Data/Hora</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-xs sm:text-sm">
                                            {adminLoginLogs.map(log => (
                                                <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="p-3 truncate max-w-xs">{log.name}</td>
                                                    <td className="p-3 whitespace-nowrap">{log.timestamp?.toDate().toLocaleString('pt-BR') || 'N/A'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center p-6 text-gray-500 text-sm sm:text-base">Nenhum registro de login de administrador.</div>
                            )}
                        </div>

                    </div>
                
                </div>
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