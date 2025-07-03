import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function FeedbackModal({ isOpen, onClose, user }) {
  const [ratings, setRatings] = useState({});
  const [openFeedback, setOpenFeedback] = useState('');
  const [nps, setNps] = useState(null);
  const [csat, setCsat] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleRating = (question, rating) => {
    setRatings(prev => ({ ...prev, [question]: rating }));
  };

  const handleSubmit = async () => {
    if (!openFeedback.trim() || Object.keys(ratings).length < 3 || nps === null || csat === null) {
      alert('Por favor, preencha todos os campos antes de enviar.');
      return;
    }
    setIsSubmitting(true);

    const newFeedback = {
      userName: user.name,
      userRole: user.role,
      date: new Date().toISOString(),
      openText: openFeedback,
      ratings,
      nps,
      csat,
    };

    try {
      await addDoc(collection(db, "feedbacks"), newFeedback);
      alert('Obrigado pelo seu feedback!');
      onClose();
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
            <label className="block text-lg font-semibold text-gray-700 mb-2">Deixe seu comentário:</label>
            <textarea
              value={openFeedback}
              onChange={(e) => setOpenFeedback(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg h-24"
              placeholder="Escreva aqui..."
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">Conteúdo</label>
            <StarRating onRatingChange={(rating) => handleRating('conteudo', rating)} />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">Imagens e Simulações</label>
            <StarRating onRatingChange={(rating) => handleRating('imagens', rating)} />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">Seu aprendizado</label>
            <StarRating onRatingChange={(rating) => handleRating('aprendizado', rating)} />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">De 0 a 10, quanto você recomendaria este treinamento?</label>
            <div className="flex flex-wrap gap-2 justify-center">
              {[...Array(11).keys()].map((num) => (
                <button
                  key={num}
                  onClick={() => setNps(num)}
                  className={`w-10 h-10 rounded-full font-bold ${nps === num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-500`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">Qual seu nível de satisfação geral?</label>
            <div className="flex justify-center gap-4">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setCsat(level)}
                  className={`text-3xl ${csat === level ? 'opacity-100' : 'opacity-40'}`}
                >
                  {['😡','😕','😐','🙂','😍'][level - 1]}
                </button>
              ))}
            </div>
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

function StarRating({ onRatingChange }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleClick = (value) => {
    setRating(value);
    onRatingChange(value);
  };

  return (
    <div className="flex justify-center items-center">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          className={`text-4xl transition-colors ${value <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'}`}
          onClick={() => handleClick(value)}
          onMouseEnter={() => setHover(value)}
          onMouseLeave={() => setHover(0)}
        >
          ★
        </button>
      ))}
    </div>
  );
}
