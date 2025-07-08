// src/utils/userRoles.js

// Enum de papéis para padronizar verificações
export const ROLES = {
  ENFERMAGEM: 'Enfermagem',
  MEDICO: 'Médico(a)',
  ESTUDANTE: 'Estudante',
  RESIDENTE: 'Residente',
  ADM: 'Adm',
  OUTRO: 'Outro',
};

// Funções utilitárias para verificar papéis
export const isPrivileged = (role) => [ROLES.MEDICO, ROLES.RESIDENTE, ROLES.ESTUDANTE].includes(role);
export const isAdmin = (role) => role === ROLES.ADM;
export const isOutro = (role) => role === ROLES.OUTRO;

// Exemplo de uso:
// import { isAdmin } from '../utils/userRoles';
// if (isAdmin(user?.role)) { ... }
