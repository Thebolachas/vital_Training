import React, { useState } from "react";
import TeoriaModulo1 from "../../components/TeoriaModulo1";
import QuizModulo1 from "../../components/QuizModulo1";
import ImagemExplicativaModulo1 from "../../components/ImagemExplicativaModulo1";

export default function Modulo1() {
  const [etapa, setEtapa] = useState("teoria");

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <div className="mb-4 flex justify-center space-x-4">
        {["teoria", "imagem", "quiz"].map((step) => (
          <button
            key={step}
            onClick={() => setEtapa(step)}
            className={`py-2 px-4 rounded ${
              etapa === step ? "bg-blue-600 text-white" : "bg-white text-gray-700 border"
            }`}
          >
            {step === "teoria" && "Teoria"}
            {step === "imagem" && "Imagem Explicativa"}
            {step === "quiz" && "Quiz"}
          </button>
        ))}
      </div>
      {etapa === "teoria" && <TeoriaModulo1 />}
      {etapa === "imagem" && <ImagemExplicativaModulo1 />}
      {etapa === "quiz" && <QuizModulo1 />}
    </div>
  );
}
