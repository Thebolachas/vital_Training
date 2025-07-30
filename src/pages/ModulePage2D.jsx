import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { modulosData } from '../Data/dadosModulos.jsx';
import { useUser } from '../Context/UserContext';
import { useProgress } from '../Context/ProgressContext';
import EnhancedQuiz from '../components/EnhancedQuiz';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedCard from '../components/AnimatedCard';

const ImagemExplicativa = ({ imagens, onGoToQuiz, moduloId }) => {
  const [imagemAtual, setImagemAtual] = useState(0);

  const proximaImagem = () => {
    setImagemAtual((prev) => (prev + 1) % imagens.length);
  };

  const imagemAnterior = () => {
    setImagemAtual((prev) => (prev - 1 + imagens.length) % imagens.length);
  };

  // Debug para identificar o problema
  console.log('🖼️ DEBUG IMAGENS:', {
    imagens: imagens,
    imagemAtual: imagemAtual,
    totalImagens: imagens?.length,
    imagemObj: imagens?.[imagemAtual]
  });

  if (!imagens || imagens.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-xl shadow-lg">
        <p className="text-gray-500 mb-4">Nenhuma imagem disponível para este módulo.</p>
        <AnimatedButton onClick={onGoToQuiz}>
          Ir para o Quiz
        </AnimatedButton>
      </div>
    );
  }

  const imagemObj = imagens[imagemAtual];
  const imagemSrc = imagemObj?.imagem || imagemObj?.img || imagemObj?.image || imagemObj?.src;
  const imagemTitulo = imagemObj?.titulo || imagemObj?.title || imagemObj?.name || 'Sem título';
  const imagemDescricao = imagemObj?.descricao || imagemObj?.description || imagemObj?.desc || 'Sem descrição';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-xl shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">📸 Galeria de Imagens</h2>
      
      <div className="relative bg-gray-50 rounded-lg p-4 mb-4 min-h-[300px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {imagemSrc ? (
            <motion.img
              key={imagemAtual}
              src={imagemSrc}
              alt={imagemTitulo}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.4 }}
              className="w-full h-auto max-h-96 object-contain mx-auto rounded"
              onError={(e) => {
                console.error('❌ Erro ao carregar imagem:', e.target.src);
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `
                  <div class="text-center text-gray-400">
                    <div class="text-4xl mb-2">❌</div>
                    <p>Erro ao carregar imagem</p>
                    <p class="text-xs">${e.target.src}</p>
                  </div>
                `;
              }}
              onLoad={() => {
                console.log('✅ Imagem carregada:', imagemSrc);
              }}
            />
          ) : (
            <motion.div
              key={imagemAtual}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.4 }}
              className="text-center text-gray-400"
            >
              <div className="text-4xl mb-2">🖼️</div>
              <p>Imagem não encontrada</p>
              <p className="text-xs mt-1">Objeto: {JSON.stringify(imagemObj)}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatedCard>
        <h3 className="text-lg font-semibold mb-2">{imagemTitulo}</h3>
        <p className="text-gray-600 mb-4">{imagemDescricao}</p>
      </AnimatedCard>

      <div className="flex justify-between items-center mt-6">
        <AnimatedButton 
          variant="secondary" 
          onClick={imagemAnterior}
          disabled={imagens.length <= 1}
        >
          ← Anterior
        </AnimatedButton>

        <span className="text-sm text-gray-500">
          {imagemAtual + 1} de {imagens.length}
        </span>

        <AnimatedButton 
          variant="secondary" 
          onClick={proximaImagem}
          disabled={imagens.length <= 1}
        >
          Próxima →
        </AnimatedButton>
      </div>

      <div className="mt-6 text-center">
        <AnimatedButton variant="success" onClick={onGoToQuiz}>
          Fazer Quiz 🎯
        </AnimatedButton>
      </div>
    </motion.div>
  );
};

export default function ModulePage2D() {
  const { id } = useParams();
  const moduloData = modulosData[id];
  const [etapa, setEtapa] = useState("teoria");

  if (!moduloData || !moduloData.teoria2D) {
    return (
      <div className="text-center p-10 bg-gray-100 min-h-screen flex flex-col justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Conteúdo não encontrado</h2>
          <Link to="/home">
            <AnimatedButton variant="primary">
              Voltar para Home
            </AnimatedButton>
          </Link>
        </motion.div>
      </div>
    );
  }

  const moduloParaRenderizar = {
    id: id,
    title: moduloData.title,
    color: moduloData.color,
    teoria: () => moduloData.teoria2D.teoria(),
    imagens: moduloData.teoria2D.imagens,
    quiz: moduloData.teoria2D.quiz
  };

  const activeTabClasses = { 
    blue: 'border-b-4 border-blue-500 text-blue-600', 
    pink: 'border-b-4 border-pink-500 text-pink-600', 
    purple: 'border-b-4 border-purple-500 text-purple-600', 
    teal: 'border-b-4 border-teal-500 text-teal-600',
    orange: 'border-b-4 border-orange-500 text-orange-600',
  };

  const renderEtapa = () => {
    switch (etapa) {
      case "teoria": 
        return (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {moduloParaRenderizar.teoria()}
          </motion.div>
        );
      case "imagens": 
        return (
          <ImagemExplicativa 
            imagens={moduloParaRenderizar.imagens} 
            onGoToQuiz={() => setEtapa('quiz')} 
            moduloId={moduloParaRenderizar.id} 
          />
        );
      case "quiz": 
        return (
          <EnhancedQuiz 
            questions={moduloParaRenderizar.quiz} 
            moduloId={moduloParaRenderizar.id}
          />
        );
      default: 
        return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 p-4 sm:p-8"
    >
      <header className="flex justify-between items-center mb-10 pb-4 border-b-2 border-gray-200">
        <motion.h1 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-3xl font-bold text-gray-800"
        >
          {moduloData.title}
        </motion.h1>
        <Link to="/home">
          <AnimatedButton variant="secondary">
            ← Voltar
          </AnimatedButton>
        </Link>
      </header>

      <main>
        <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
          <div className="mb-6 flex justify-center border-b-2 border-gray-200">
            {["teoria", "imagens", "quiz"].map((aba, index) => {
              if (!moduloParaRenderizar[aba] || 
                  (Array.isArray(moduloParaRenderizar[aba]) && moduloParaRenderizar[aba].length === 0)) {
                return null;
              }
              
              let tabLabel = aba === 'imagens' ? 'Imagens' : 
                           aba === 'teoria' ? 'Teoria' : 'Quiz';
              
              return (
                <motion.button
                  key={aba}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setEtapa(aba)}
                  className={`px-4 py-2 mr-4 font-semibold transition-all duration-200 ${
                    etapa === aba 
                      ? activeTabClasses[moduloParaRenderizar.color] || 'border-b-4 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tabLabel}
                </motion.button>
              );
            })}
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={etapa}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderEtapa()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </motion.div>
  );
}