// src/components/FeedbackModal.jsx
import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import StarRating from './StarRating.jsx'; // Certifique-se de que StarRating está importado
import { Link } from 'react-router-dom';

// Adicionado as props isObligatory e onFeedbackSubmitted, e userNameForFeedback
export default function FeedbackModal({ isOpen, onClose, user, isObligatory, onFeedbackSubmitted, userNameForFeedback }) {
  const [openText, setOpenText] = useState(''); // Estado para o campo de texto livre
  const [ratings, setRatings] = useState({ conteudo: 0, imagens: 0, aprendizado: 0 });
  const [nps, setNps] = useState(null);
  const [csat, setCsat] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userFirstName = userNameForFeedback ? userNameForFeedback.split(' ')[0] : 'colega';

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault(); // Garante que o formulário não recarregue a página
    setIsSubmitting(true);

    if (!user || !user.uid) {
      alert('Você precisa estar logado para enviar feedback.');
      setIsSubmitting(false);
      return;
    }

    // Validação mínima: Pelo menos um campo preenchido
    if (!openText.trim() && Object.values(ratings).every(r => r === 0) && nps === null && csat === null) {
      alert('Por favor, preencha pelo menos um campo de feedback (comentários, estrelas, NPS ou satisfação).');
      setIsSubmitting(false);
      return;
    }

    try {
      await addDoc(collection(db, "feedbacks"), {
        userId: user.uid,
        userName: user.name,
        userEmail: user.email || 'N/A',
        userRole: user.role,
        openText, // Inclui o campo de texto livre
        ratings,
        nps: nps !== null ? parseInt(nps) : null,
        csat: csat !== null ? parseInt(csat) : null,
        timestamp: serverTimestamp(),
      });

      alert('Obrigado pelo seu feedback!');
      // Limpa os campos após o envio
      setOpenText('');
      setRatings({ conteudo: 0, imagens: 0, aprendizado: 0 });
      setNps(null);
      setCsat(null);
      
      // Chama o callback de sucesso para a página pai
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted();
      } else {
        onClose(); // Se não for obrigatório, permite fechar normalmente
      }

    } catch (error) {
      console.error("Erro ao enviar feedback: ", error);
      alert('Erro ao enviar feedback. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShareOnLinkedIn = () => {
    const certificateText = encodeURIComponent(`Acabei de concluir o treinamento de Cardiotocografia Móvel no SUS com o TreinaFácil iCTG! 🎓 #Cardiotocografia #Saúde #TreinaFácil #SUS`);
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.origin)}&title=${certificateText}`, '_blank');
  };

  const nextModulePath = '/home'; // Link padrão para o próximo módulo/home

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
         onClick={isObligatory ? null : onClose}>
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh]"
           onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center flex-grow">Sua Opinião é Importante!</h2>
            {!isObligatory && (
                <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">
                &times;
                </button>
            )}
        </div>
        
        <div className="space-y-6">
          {/* Campo de texto livre (Comentários) */}
          <div>
            <label htmlFor="openText" className="block text-lg font-semibold text-gray-700 mb-2">Comentários (opcional):</label>
            <textarea
              id="openText"
              value={openText}
              onChange={(e) => setOpenText(e.target.value)}
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              placeholder="Sua opinião é muito valiosa para nós..."
              disabled={isSubmitting}
            ></textarea>
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">Avalie os aspectos do módulo:</label>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Conteúdo:</span>
                <StarRating onRatingChange={(rating) => setRatings(prev => ({ ...prev, conteudo: rating }))} initialRating={ratings.conteudo} />
                </div>
                <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Imagens e Simulações:</span>
                <StarRating onRatingChange={(rating) => setRatings(prev => ({ ...prev, imagens: rating }))} initialRating={ratings.imagens} />
                </div>
                <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Seu aprendizado:</span>
                <StarRating onRatingChange={(rating) => setRatings(prev => ({ ...prev, aprendizado: rating }))} initialRating={ratings.aprendizado} />
                </div>
            </div>
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">De 0 a 10, quanto você recomendaria este treinamento?</label>
            <div className="flex flex-wrap gap-2 justify-center">
              {[...Array(11).keys()].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setNps(num)}
                  className={`w-10 h-10 rounded-full font-bold ${nps === num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-500 transition-colors`}
                  disabled={isSubmitting}
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
                  type="button"
                  onClick={() => setCsat(level)}
                  className={`text-3xl transition-opacity ${csat === level ? 'opacity-100' : 'opacity-40'}`}
                  disabled={isSubmitting}
                >
                  {['😡','😕','😐','🙂','😍'][level - 1]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
          </button>
          {/* Se não for obrigatório, pode ter um botão de Fechar */}
          {!isObligatory && (
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              Fechar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}