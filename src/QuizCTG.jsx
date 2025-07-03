import React, { useState, useEffect } from "react";
import { useProgress } from "./Context/ProgressContext";
import { modulosData } from "./Data/dadosModulos.jsx";

export default function QuizCTG({ moduleId, onFinish, userProfile }) {
  const { saveQuizResult, progress } = useProgress();
  const perguntas = modulosData?.[moduleId]?.teoria2D?.quiz || [];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizFailed, setQuizFailed] = useState(false);
  const [showCertificateButton, setShowCertificateButton] = useState(false);

  const totalQuestions = perguntas.length;

  useEffect(() => {
    // placeholder for side-effects or tracking if needed
  }, []);

  const handleAnswer = (index) => {
    const isCorrect = index === perguntas[currentQuestion].correta;
    if (isCorrect) setScore((prev) => prev + 1);
    setSelectedAnswer(index);

    setTimeout(() => {
      setSelectedAnswer(null);
      if (currentQuestion + 1 < totalQuestions) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        const finalScore = score + (isCorrect ? 1 : 0);
        setScore(finalScore);
        setShowResult(true);

        // Salva progresso sempre que terminar o quiz
        saveQuizResult(moduleId, finalScore, totalQuestions);

        // Checa se completou com 100%
        const allCompleted = Object.keys(modulosData)
          .filter(id => modulosData[id].teoria2D?.quiz)
          .every(id => progress[id]?.completed && progress[id]?.score === progress[id]?.totalQuestions);

        if (allCompleted) {
          setShowCertificateButton(true);
        }

        onFinish();

        if (finalScore < totalQuestions) {
          setQuizFailed(true);
        }
      }
    }, 800);
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setQuizFailed(false);
    setShowCertificateButton(false);
  };

  const handlePrintCertificate = () => {
    alert("Gerando certificado!");
  };

  if (quizFailed) {
    return (
      <div className="text-center p-6 space-y-4">
        <h2 className="text-xl font-bold text-red-600">Você errou algumas questões.</h2>
        <button
          onClick={handleRetry}
          className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition"
        >
          Refazer Quiz
        </button>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="text-center p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Quiz Concluído!</h2>
        <p className="text-lg text-gray-600">Você acertou {score} de {totalQuestions} questões.</p>
        {showCertificateButton && (
          <button
            onClick={handlePrintCertificate}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition mt-4"
          >
            Imprimir Certificado
          </button>
        )}
        {!showCertificateButton && score < totalQuestions && (
          <button
            onClick={handleRetry}
            className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition mt-4"
          >
            Refazer Quiz
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {perguntas[currentQuestion].pergunta}
      </h2>
      <div className="space-y-3">
        {perguntas[currentQuestion].opcoes.map((opcao, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            className={`w-full px-4 py-2 rounded-lg border text-left transition
              ${selectedAnswer === index
                ? index === perguntas[currentQuestion].correta
                  ? 'bg-green-100 border-green-600'
                  : 'bg-red-100 border-red-600'
                : 'bg-gray-50 border-gray-300 hover:bg-blue-50'}`}
          >
            {opcao}
          </button>
        ))}
      </div>
    </div>
  );
}
