import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import { useUser } from '../context/UserContext';
import { useProgress } from '../context/ProgressContext';
import { useNavigate } from 'react-router-dom';
import AnimatedButton from './AnimatedButton';
import AnimatedCard from './AnimatedCard';

const EnhancedQuiz = ({ questions, moduloId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const { user } = useUser();
  const { saveQuizResult } = useProgress();
  const navigate = useNavigate();

  const {
    triggerSuccess,
    triggerError,
    triggerAchievement,
    successSpring,
    errorSpring,
    AnimatedDiv,
    isAnimating
  } = useHapticFeedback();

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleAnswerSelect = (answerIndex) => {
    if (showFeedback || isAnimating) return;

    setSelectedAnswer(answerIndex);
    setShowFeedback(true);

    const isCorrect = answerIndex === currentQuestion.correta;
    const newAnswers = [...answers, { 
      questionIndex: currentIndex, 
      answer: answerIndex, 
      correct: isCorrect 
    }];
    setAnswers(newAnswers);

    if (isCorrect) {
      setScore(score + 1);
      triggerSuccess();
    } else {
      triggerError();
    }

    setTimeout(() => {
      if (isLastQuestion) {
        handleQuizComplete(newAnswers);
      } else {
        nextQuestion();
      }
    }, 2500);
  };

  const nextQuestion = () => {
    setCurrentIndex(currentIndex + 1);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const handleQuizComplete = (finalAnswers) => {
    const finalScore = finalAnswers.filter(a => a.correct).length;
    const percentage = (finalScore / questions.length) * 100;

    if (percentage === 100) {
      triggerAchievement();
    }

    setQuizCompleted(true);

    // Salvar progresso
    if (user?.role !== 'Adm') {
      saveQuizResult(moduloId, finalScore, questions.length);
    }

    // Navegar após um tempo
    setTimeout(() => {
      navigate('/home', { 
        state: { 
          completedModuleId: moduloId, 
          allCorrect: percentage === 100,
          score: finalScore,
          total: questions.length 
        } 
      });
    }, 3000);
  };

  const getOptionStyle = (optionIndex) => {
    if (!showFeedback) {
      return 'border-gray-200 hover:border-blue-300 hover:bg-blue-50';
    }

    if (optionIndex === currentQuestion.correta) {
      return 'border-green-500 bg-green-50 shadow-lg shadow-green-200';
    }

    if (optionIndex === selectedAnswer && optionIndex !== currentQuestion.correta) {
      return 'border-red-500 bg-red-50 shadow-lg shadow-red-200';
    }

    return 'border-gray-200 bg-gray-50';
  };

  if (quizCompleted) {
    const finalPercentage = (score / questions.length) * 100;
    const userName = user?.name ? user.name.split(' ')[0] : 'colega';

    return (
      <div className="max-w-2xl mx-auto p-6">
        <AnimatedCard className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-4">
              {finalPercentage === 100 ? '🏆' : finalPercentage >= 70 ? '🎉' : '💪'}
            </div>
            
            <h2 className="text-2xl font-bold mb-4">
              {finalPercentage === 100 
                ? `Perfeito, ${userName}! 🌟`
                : finalPercentage >= 70 
                  ? `Muito bem, ${userName}! 👏`
                  : `Continue praticando, ${userName}! 📚`
              }
            </h2>

            <div className="text-lg mb-6">
              Você acertou <span className="font-bold text-blue-600">{score}</span> de{' '}
              <span className="font-bold">{questions.length}</span> questões
              <div className="text-2xl font-bold text-green-600 mt-2">
                {finalPercentage.toFixed(0)}%
              </div>
            </div>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, delay: 0.5 }}
              className="w-full bg-gray-200 rounded-full h-3 mb-6"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${finalPercentage}%` }}
                transition={{ duration: 2, delay: 0.5 }}
                className={`h-3 rounded-full ${
                  finalPercentage === 100 ? 'bg-green-500' :
                  finalPercentage >= 70 ? 'bg-blue-500' : 'bg-yellow-500'
                }`}
              />
            </motion.div>

            <p className="text-gray-600 mb-4">
              Redirecionando para a página inicial...
            </p>

            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </motion.div>
        </AnimatedCard>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Pergunta {currentIndex + 1} de {questions.length}
          </span>
          <span className="text-sm font-medium text-blue-600">
            {Math.round(((currentIndex + 1) / questions.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <AnimatedDiv style={{ ...successSpring, ...errorSpring }}>
        <AnimatedCard className="mb-6">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-6 text-gray-800">
              {currentQuestion.pergunta}
            </h3>

            <div className="space-y-3">
              {currentQuestion.opcoes.map((opcao, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showFeedback}
                  whileHover={!showFeedback ? { scale: 1.01, x: 5 } : {}}
                  whileTap={!showFeedback ? { scale: 0.99 } : {}}
                  className={`
                    w-full p-4 text-left rounded-xl border-2 transition-all duration-300
                    ${getOptionStyle(index)}
                    ${showFeedback ? 'cursor-default' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex-1 pr-4">{opcao}</span>
                    
                    <AnimatePresence>
                      {showFeedback && selectedAnswer === index && (
                        <motion.span
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className={`text-xl ${
                            index === currentQuestion.correta 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}
                        >
                          {index === currentQuestion.correta ? '✅' : '❌'}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              ))}
            </div>

            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`mt-6 p-4 rounded-xl border-2 ${
                    selectedAnswer === currentQuestion.correta
                      ? 'bg-green-100 border-green-300'
                      : 'bg-blue-100 border-blue-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl mt-1">
                      {selectedAnswer === currentQuestion.correta ? '🎉' : '💡'}
                    </span>
                    <div>
                      <p className="font-semibold mb-2">
                        {selectedAnswer === currentQuestion.correta 
                          ? 'Perfeito!' 
                          : 'Quase lá!'
                        }
                      </p>
                      <p className="text-sm text-gray-700">
                        {currentQuestion.feedback}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatedCard>
      </AnimatedDiv>

      <motion.div 
        className="text-center text-sm text-gray-600"
        animate={{ 
          scale: showFeedback && selectedAnswer === currentQuestion.correta ? [1, 1.1, 1] : 1 
        }}
      >
        Pontuação: {score}/{currentIndex + (showFeedback ? 1 : 0)}
      </motion.div>
    </div>
  );
};

export default EnhancedQuiz;