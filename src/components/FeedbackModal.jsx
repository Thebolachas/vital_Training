import React, { useState } from 'react';
import StarRating from './StarRating';
import { db } from '../firebaseConfig'; // Importar o banco de dados
import { collection, addDoc } from 'firebase/firestore'; // Importar funções do Firestore

export default function FeedbackModal({ isOpen, onClose, user }) {
  const [ratings, setRatings] = useState({});
  const [openFeedback, setOpenFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleRating = (question, rating) => {
    setRatings(prev => ({ ...prev, [question]: rating }));
  };

  const handleSubmit = async () => {
    if (!openFeedback.trim() || Object.keys(ratings).length < 3) {
      alert('Por favor, preencha todos os campos antes de enviar.');
      return;
    }
    setIsSubmitting(true);

    const newFeedback = {
      userName: user.name,
      userRole: user.role,
      date: new Date().toISOString(),
      openText: openFeedback,
      ratings: ratings,
    };

    try {
      // Salva o novo feedback em uma coleção chamada "feedbacks" no Firestore
      await addDoc(collection(db, "feedbacks"), newFeedback);
      alert('Obrigado pelo seu feedback!');
      onClose(); // Fecha o modal
    } catch (error) {
      console.error("Erro ao enviar feedback: ", error);
      alert("Houve um erro ao enviar seu feedback. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sua Opinião é Importante!</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">O que você achou do treinamento no geral?</label>
            <textarea 
              value={openFeedback}
              onChange={(e) => setOpenFeedback(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg h-24"
              placeholder="Sua resposta..."
            />
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2 text-center">O que achou do conteúdo?</label>
            <StarRating onRatingChange={(rating) => handleRating('conteudo', rating)} />
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2 text-center">O que achou das imagens e simulações?</label>
            <StarRating onRatingChange={(rating) => handleRating('imagens', rating)} />
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2 text-center">Seu aprendizado foi satisfatório?</label>
            <StarRating onRatingChange={(rating) => handleRating('aprendizado', rating)} />
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button onClick={onClose} disabled={isSubmitting} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50">Fechar</button>
          <button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50">
            {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
          </button>
        </div>
      </div>
    </div>
  );
}