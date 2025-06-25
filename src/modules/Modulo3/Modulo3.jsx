// src/modules/Modulo3/Modulo3.jsx - Versão refatorada
import React from 'react';
import ModuleContainer from '../../components/ModuleContainer';
import TeoriaModulo3 from '../../components/TeoriaModulo3';
import QuizModulo3 from '../../components/QuizModulo3'; // Use o Quiz genérico aqui depois!

export default function Modulo3() {
  return (
    <ModuleContainer
      teoria={<TeoriaModulo3 />}
      quiz={<QuizModulo3 />}
      // Note que não passamos a prop 'imagens'. O botão não será renderizado!
    />
  );
}