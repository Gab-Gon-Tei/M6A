import React, { useState } from 'react';

const FeedbackForm: React.FC = () => {
  const [rating, setRating] = useState<'positive' | 'negative' | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    // In a real production app, this would send data to a backend endpoint
    // for dataset collection and RLHF (Reinforcement Learning from Human Feedback).
    console.log('M6A Feedback Submitted:', { rating, comment, timestamp: new Date().toISOString() });
    
    setSubmitted(true);
    
    // Reset after a few seconds to allow new feedback if needed
    setTimeout(() => {
        setSubmitted(false);
        setRating(null);
        setComment('');
    }, 4000);
  };

  if (submitted) {
    return (
      <div className="mt-8 p-6 bg-gray-900 border border-sport-accent/30 rounded-xl text-center animate-fade-in shadow-[0_0_15px_rgba(0,255,157,0.1)]">
        <div className="inline-block p-2 bg-sport-accent/10 rounded-full mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sport-accent"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <p className="text-white font-bold text-lg">Feedback Recebido!</p>
        <p className="text-gray-400 text-sm mt-1">Sua avaliação ajuda a calibrar a precisão do M6A.</p>
      </div>
    );
  }

  return (
    <div className="mt-12 bg-gray-900/40 border border-gray-800 rounded-xl p-6 max-w-2xl mx-auto backdrop-blur-sm animate-fade-in-up">
      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 text-center">
        O que achou desta análise?
      </h4>
      
      <div className="flex justify-center gap-6 mb-6">
        <button
          onClick={() => setRating('positive')}
          className={`group p-4 rounded-full transition-all duration-300 border ${rating === 'positive' ? 'bg-sport-accent text-sport-black border-sport-accent scale-110 shadow-[0_0_15px_rgba(0,255,157,0.4)]' : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white'}`}
          title="Análise precisa"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>
        </button>
        <button
          onClick={() => setRating('negative')}
          className={`group p-4 rounded-full transition-all duration-300 border ${rating === 'negative' ? 'bg-sport-danger text-white border-sport-danger scale-110 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white'}`}
          title="Dados incorretos ou viés"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"/></svg>
        </button>
      </div>
      
      {rating && (
        <div className="animate-fade-in space-y-3">
          <div className="relative">
            <textarea
                className="w-full bg-black/40 border border-gray-700 rounded-lg p-4 text-sm text-gray-200 focus:border-sport-accent focus:ring-1 focus:ring-sport-accent outline-none resize-none transition-all placeholder-gray-600"
                rows={3}
                placeholder={rating === 'negative' ? "Ajude-nos a melhorar: O que estava errado? (Ex: Jogador trocou de time, lesão não contada...)" : "Algum comentário extra sobre a análise?"}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-lg text-sm transition-colors border border-gray-700 hover:border-gray-500 flex items-center justify-center gap-2"
          >
            <span>Enviar Feedback</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedbackForm;