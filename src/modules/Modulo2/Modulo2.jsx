// src/modules/Modulo2/Modulo2.jsx
import React, { useState } from "react";
import TeoriaModulo2 from "../../components/TeoriaModulo2";
import QuizModulo2 from "../../components/QuizModulo2";
import ImagemExplicativaModulo2 from "../../components/ImagemExplicativaModulo2";

export default function Modulo2() {
  const [etapa, setEtapa] = useState("teoria");

  const renderEtapa = () => {
    switch (etapa) {
      case "teoria":
        return <TeoriaModulo2 />;
      case "quiz":
        return <QuizModulo2 />;
      case "imagens":
        return <ImagemExplicativaModulo2 />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <div className="mb-4 flex justify-center space-x-4">
        <button
          onClick={() => setEtapa("teoria")}
          className={`py-2 px-4 rounded ${
            etapa === "teoria" ? "bg-blue-600 text-white" : "bg-white text-gray-700 border"
          }`}
        >
          Teoria
        </button>
        <button
          onClick={() => setEtapa("quiz")}
          className={`py-2 px-4 rounded ${
            etapa === "quiz" ? "bg-blue-600 text-white" : "bg-white text-gray-700 border"
          }`}
        >
          Quiz
        </button>
        <button
          onClick={() => setEtapa("imagens")}
          className={`py-2 px-4 rounded ${
            etapa === "imagens" ? "bg-blue-600 text-white" : "bg-white text-gray-700 border"
          }`}
        >
          Imagem Explicativa
        </button>
      </div>
      {renderEtapa()}
    </div>
  );
}
