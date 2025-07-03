import React from "react";
import { useProgress } from "../Context/ProgressContext";
import { useUser } from "../Context/UserContext";

export default function ProgressBar() {
  const { progress } = useProgress();
  const { user } = useUser();

  // Define total de módulos por tipo de usuário
  const totalModulos = user?.role === "Desenvolvedor" || user?.role === "Especialista"
    ? 5
    : 3;

  // Conta quantos módulos foram concluídos
  const modulosConcluidos = Object.values(progress).filter((mod) => mod.completed).length;
  const percentual = Math.min((modulosConcluidos / totalModulos) * 100, 100);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md w-full max-w-xl mx-auto mt-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Seu Progresso</h2>
      <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
        <div
          className="bg-blue-600 h-full transition-all duration-500"
          style={{ width: `${percentual}%` }}
        />
      </div>
      <p className="text-sm text-gray-600 text-right">
        {modulosConcluidos} de {totalModulos} módulos concluídos
      </p>
    </div>
  );
}
