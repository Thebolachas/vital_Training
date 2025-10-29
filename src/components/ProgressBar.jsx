// src/components/ProgressBar.jsx
import React from "react";
import { useProgress } from "../Context/ProgressContext";
import { useUser } from "../Context/UserContext";
import { modulosData } from "../Data/dadosModulos"; // Precisamos dos dados dos módulos

export default function ProgressBar() {
  const { progress } = useProgress();
  const { user } = useUser();

  // --- LÓGICA DE CÁLCULO CORRETA (baseada no Dashboard) ---
  const getRequiredModules = () => {
    if (!user) return { completed: 0, total: 0 };

    const baseModules = ['1', '2', '3', '4'];
    const advancedModules = ['5'];
    const privilegedRoles = ['Médico(a)', 'Residente', 'Estudante', 'Adm']; // Adm é privilegiado
    const isPrivileged = privilegedRoles.includes(user.role);

    let userRequiredModules = [];

    // Adm vê todos os módulos
    if (user.role === 'Adm') {
        userRequiredModules = Object.keys(modulosData);
    } else if (isPrivileged) {
        userRequiredModules = [...baseModules, ...advancedModules]; // 5 módulos
    } else {
        userRequiredModules = baseModules; // 4 módulos
    }

    // Filtra apenas os módulos que têm um quiz (teoria2D ou simulacao3D)
    const modulesWithQuizzes = userRequiredModules.filter(
      id => modulosData[id]?.teoria2D || modulosData[id]?.simulacao3D
    );
    
    const completedCount = modulesWithQuizzes.filter(
      id => progress[id]?.completed
    ).length;
    
    const totalModulesWithQuizzes = modulesWithQuizzes.length;

    // Adms podem ter 0 módulos se não houver quiz em 'privileged' (Módulo 5)
    if (totalModulesWithQuizzes === 0) {
      return { completed: 0, total: 0 };
    }

    return { completed: completedCount, total: totalModulesWithQuizzes };
  };

  const { completed, total } = getRequiredModules();
  
  const percentual = total > 0 ? Math.min((completed / total) * 100, 100) : 0;
  // --- FIM DA LÓGICA CORRETA ---

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg w-full transition-all hover:shadow-xl">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800">Seu Progresso</h2>
        <span className="text-lg font-bold text-blue-600">
          {percentual.toFixed(0)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
        <div
          className="bg-blue-600 h-full rounded-full transition-all duration-500"
          style={{ width: `${percentual}%` }}
        />
      </div>
      <p className="text-sm text-gray-600 text-right">
        {completed} de {total} módulos concluídos
      </p>
    </div>
  );
}