// src/components/FeedbackModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import StarRating from './StarRating.jsx'; // Certifique-se que StarRating está importado
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// onFeedbackSubmitted é o callback para a HomePage após o envio bem-sucedido
export default function FeedbackModal({ isOpen, onClose, user, isObligatory, onFeedbackSubmitted }) {
  const [openText, setOpenText] = useState('');
  const [nps, setNps] = useState(null); // Net Promoter Score
  const [csat, setCsat] = useState(null); // Customer Satisfaction
  const [ratings, setRatings] = useState({ conteudo: 0, imagens: 0, aprendizado: 0 });
  const [submissionStatus, setSubmissionStatus] = useState(''); // 'success', 'error', ''
  const [isLoading, setIsLoading] = useState(false);

  const modalRef = useRef(null); // Referência para o modal para foco

  useEffect(() => {
    if (isOpen) {
      // Reseta o formulário toda vez que o modal abre
      setOpenText('');
      setNps(null);
      setCsat(null);
      setRatings({ conteudo: 0, imagens: 0, aprendizado: 0 });
      setSubmissionStatus('');
      setIsLoading(false);

      // Foca no modal ou no primeiro elemento focável para acessibilidade
      if (modalRef.current) {
        modalRef.current.focus();
      }
    }
  }, [isOpen]);

  // Função para fechar com a tecla ESC
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen && !isObligatory) { // Só fecha com ESC se não for obrigatório
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, isObligatory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus('');
    setIsLoading(true);

    // Validação mínima: Pelo menos um campo preenchido para evitar feedback vazio
    if (!openText.trim() && Object.values(ratings).every(r => r === 0) && nps === null && csat === null) {
      setSubmissionStatus('error');
      setIsLoading(false);
      return;
    }

    if (!user || !user.uid) {
      setSubmissionStatus('error'); // Mensagem de erro para usuário não logado
      alert('Você precisa estar logado para enviar feedback.');
      setIsLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, 'feedbacks'), {
        userId: user.uid,
        userName: user.name || user.email, // Usa user.name do contexto
        userEmail: user.email,
        userRole: user.role,
        openText,
        nps: nps !== null ? parseInt(nps) : null, // Garante que é um número ou null
        csat: csat !== null ? parseInt(csat) : null, // Garante que é um número ou null
        ratings,
        timestamp: serverTimestamp(),
      });
      setSubmissionStatus('success');
      
      // Chamar a função passada via prop para notificar o componente pai (HomePage)
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted();
      }
      // Não fecha o modal aqui, a HomePage fará isso via onFeedbackSubmitted
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      setSubmissionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in-up"
      onClick={isObligatory ? null : onClose} // Permite clicar fora para fechar, a menos que seja obrigatório
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
      tabIndex="-1" // Torna o overlay focável
      ref={modalRef} // Atribui a ref ao div do overlay para foco
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg transform scale-100 transition-transform duration-300 animate-pop-in flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()} // Impede cliques dentro do modal de fechá-lo
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 id="feedback-modal-title" className="text-2xl font-bold text-gray-800 text-center flex-grow">
            Sua Opinião é Importante!
          </h2>
          {!isObligatory && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 text-3xl leading-none"
              aria-label="Fechar modal"
            >
              &times;
            </button>
          )}
        </div>
        
        <div className="overflow-y-auto pr-4 flex-grow"> {/* Adicionado overflow-y-auto para scroll */}
          {/* Conteúdo do formulário de feedback */}
          <form onSubmit={handleSubmit} className="space-y-6"> {/* Espaçamento aumentado */}
            {/* Campo de texto livre (Comentários) - CONTEÚDO DO TEXTO ANTIGO */}
            <div>
              <label htmlFor="openText" className="block text-lg font-semibold text-gray-700 mb-2">Comentários (opcional):</label>
              <textarea
                id="openText"
                value={openText}
                onChange={(e) => setOpenText(e.target.value)}
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="Sua opinião é muito valiosa para nós..."
                disabled={isLoading}
              ></textarea>
            </div>

            {/* Avaliações por Estrela - CONTEÚDO DO TEXTO ANTIGO */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">Avalie os aspectos do módulo:</label>
              <div className="space-y-4"> {/* Espaçamento entre avaliações */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Qualidade do Conteúdo:</span>
                  <StarRating onRatingChange={(rating) => setRatings(prev => ({ ...prev, conteudo: rating }))} initialRating={ratings.conteudo} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Qualidade das Imagens e Mídias:</span>
                  <StarRating onRatingChange={(rating) => setRatings(prev => ({ ...prev, imagens: rating }))} initialRating={ratings.imagens} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Experiência de Aprendizado:</span>
                  <StarRating onRatingChange={(rating) => setRatings(prev => ({ ...prev, aprendizado: rating }))} initialRating={ratings.aprendizado} />
                </div>
              </div>
            </div>

            {/* NPS - CONTEÚDO DO TEXTO ANTIGO */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">De 0 a 10, quanto você recomendaria este treinamento?</label>
              <div className="flex flex-wrap gap-2 justify-center">
                {[...Array(11).keys()].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setNps(num)}
                    className={`w-10 h-10 rounded-full font-bold ${nps === num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-500 transition-colors`}
                    disabled={isLoading} // Usar isLoading do componente
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* CSAT - CONTEÚDO DO TEXTO ANTIGO (com emojis) */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">Qual seu nível de satisfação geral?</label>
              <div className="flex justify-center gap-4">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setCsat(level)}
                    className={`text-3xl transition-opacity ${csat === level ? 'opacity-100' : 'opacity-40'}`}
                    disabled={isLoading} // Usar isLoading do componente
                  >
                    {['😡','😕','😐','🙂','😍'][level - 1]}
                  </button>
                ))}
              </div>
            </div>

            {/* Status de envio */}
            {submissionStatus === 'error' && (
              <p className="text-red-500 text-sm text-center">
                Por favor, preencha pelo menos um campo de feedback (comentários, estrelas, NPS ou satisfação).
              </p>
            )}
            {submissionStatus === 'success' && (
              <p className="text-green-500 text-sm text-center">Feedback enviado com sucesso! Obrigado!</p>
            )}

            {/* Botão de Enviar */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Enviar Feedback'
              )}
            </button>
          </form>
        </div>

        {/* Botões de navegação/fechar (se não for obrigatório) */}
        {!isObligatory && (
          <div className="p-4 border-t mt-4 text-right">
            <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}