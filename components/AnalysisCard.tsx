import React from 'react';
import { AnalyzedEntity } from '../types';
import HexChart from './HexChart';
import ReactMarkdown from 'react-markdown';

interface AnalysisCardProps {
  data: AnalyzedEntity;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ data }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-sport-accent'; // Green
    if (score >= 75) return 'text-sport-secondary'; // Blue
    if (score >= 60) return 'text-yellow-400';
    return 'text-sport-danger'; // Red
  };

  return (
    <div className="bg-sport-dark border border-gray-800 rounded-xl overflow-hidden shadow-2xl relative">
      {/* Header Badge */}
      <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm p-2 rounded-lg border border-gray-700">
         <div className="flex flex-col items-end">
            <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">NOTA M6A</span>
            <span className={`text-4xl font-mono font-bold ${getScoreColor(data.overallScore)}`}>
              {data.overallScore}
            </span>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left: Visuals */}
        <div className="p-6 flex flex-col items-center justify-start bg-gradient-to-br from-gray-900 to-sport-dark border-r border-gray-800">
          <div className="w-full text-left mb-6 relative">
             <div className="flex gap-4 items-start">
               {data.imageUrl && (
                 <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-700 bg-gray-800 shrink-0">
                   <img src={data.imageUrl} alt={data.entityName} className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                 </div>
               )}
               <div>
                  <h2 className="text-2xl font-bold text-white">{data.entityName}</h2>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400 mt-1">
                      <span className="bg-gray-800 px-2 py-0.5 rounded text-white border border-gray-700">{data.role}</span>
                      <span>•</span>
                      <span>{data.team}</span>
                      {data.age && (
                          <>
                          <span>•</span>
                          <span>{data.age} anos</span>
                          </>
                      )}
                  </div>
               </div>
             </div>
          </div>
          
          <div className="w-full aspect-square max-h-80">
            <HexChart attributes={data.attributes} />
          </div>
          
          <div className="w-full mt-6">
            <h4 className="text-xs uppercase text-gray-500 font-bold mb-2">Métricas Chave</h4>
            <div className="flex flex-wrap gap-2">
              {data.keyMetrics.map((metric, idx) => (
                <span key={idx} className="text-xs font-mono bg-gray-800/50 border border-gray-700 text-sport-accent px-2 py-1 rounded">
                  {metric}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Data & Analysis */}
        <div className="p-6 overflow-y-auto max-h-[700px]">
          <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-800 pb-2">Relatório de Análise</h3>
          
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{data.justification}</ReactMarkdown>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
             <div className="bg-gray-900/50 p-3 rounded border border-gray-800 flex justify-between items-center">
                <span className="text-xs uppercase text-gray-400 font-bold">DEFESA</span>
                <span className={`font-mono font-bold ${getScoreColor(data.attributes.defense)}`}>{data.attributes.defense}</span>
             </div>
             <div className="bg-gray-900/50 p-3 rounded border border-gray-800 flex justify-between items-center">
                <span className="text-xs uppercase text-gray-400 font-bold">ATAQUE</span>
                <span className={`font-mono font-bold ${getScoreColor(data.attributes.attack)}`}>{data.attributes.attack}</span>
             </div>
             <div className="bg-gray-900/50 p-3 rounded border border-gray-800 flex justify-between items-center">
                <span className="text-xs uppercase text-gray-400 font-bold">FÍSICO</span>
                <span className={`font-mono font-bold ${getScoreColor(data.attributes.physical)}`}>{data.attributes.physical}</span>
             </div>
             <div className="bg-gray-900/50 p-3 rounded border border-gray-800 flex justify-between items-center">
                <span className="text-xs uppercase text-gray-400 font-bold">MENTALIDADE</span>
                <span className={`font-mono font-bold ${getScoreColor(data.attributes.mentality)}`}>{data.attributes.mentality}</span>
             </div>
             <div className="bg-gray-900/50 p-3 rounded border border-gray-800 flex justify-between items-center">
                <span className="text-xs uppercase text-gray-400 font-bold">TÉCNICA</span>
                <span className={`font-mono font-bold ${getScoreColor(data.attributes.technique)}`}>{data.attributes.technique}</span>
             </div>
             <div className="bg-gray-900/50 p-3 rounded border border-gray-800 flex justify-between items-center">
                <span className="text-xs uppercase text-gray-400 font-bold">TALENTO</span>
                <span className={`font-mono font-bold ${getScoreColor(data.attributes.talent)}`}>{data.attributes.talent}</span>
             </div>
          </div>

          {/* References */}
          {data.references && data.references.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-800">
              <h4 className="text-xs uppercase text-gray-500 font-bold mb-2">Fontes (Google Search)</h4>
              <ul className="space-y-1">
                {data.references.map((ref, idx) => (
                  <li key={idx}>
                    <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 hover:underline truncate block">
                      {ref.title || ref.url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisCard;