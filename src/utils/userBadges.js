// src/utils/userBadges.js
export function getUserBadges(user, progress) {
  const badges = [];

  const completedModules = Object.values(progress || {}).filter(p => p.completed).length;

  // Badge 1: Primeiro Módulo
  if (completedModules >= 1) {
    badges.push({ id: 'start', label: 'Primeiro Módulo', color: 'bg-blue-500' });
  }

  // Badge 2: Base Concluída (4 módulos)
  if (completedModules >= 4) {
    badges.push({ id: 'base', label: 'Base Concluída', color: 'bg-green-500' });
  }

  // Badge 3: Avançado (5 módulos)
  if (completedModules >= 5) {
    badges.push({ id: 'advanced', label: 'Avançado', color: 'bg-purple-600' });
  }

  // Badge 4: Deu Feedback
  if (user?.feedbackPromptDismissed) {
    badges.push({ id: 'feedback', label: 'Deu Feedback', color: 'bg-yellow-500' });
  }

  // Badge 5: Administrador
  if (user?.role === 'Adm') {
    badges.push({ id: 'admin', label: 'Administrador', color: 'bg-red-600' });
  }

  return badges;
}
