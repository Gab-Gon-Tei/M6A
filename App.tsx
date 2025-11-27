import React, { useState, useCallback } from 'react';
import { SportType, AnalysisMode, AnalyzedEntity, MatchupPrediction, ScoutSuggestion, PlayerComparison } from './types';
import { analyzeEntity, predictMatchup, scoutPlayer, comparePlayers } from './services/geminiService';
import AnalysisCard from './components/AnalysisCard';
import HexChart from './components/HexChart';
import FeedbackForm from './components/FeedbackForm';
import ReactMarkdown from 'react-markdown';

// Icons
const SoccerBallIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/><path d="M12 2v20"/><path d="M4.93 4.93l14.14 14.14"/><path d="M19.07 4.93L4.93 19.07"/></svg>;
const BasketballIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M5.65 17.65a8.2 8.2 0 0 1-1.3-4.65c0-4.5 3.5-8 8-8 1.1 0 2.1.25 3 .7"/><path d="M18.35 6.35c.7.9 1.3 1.9 1.3 3 0 4.5-3.5 8-8 8-1.1 0-2.1-.25-3-.7"/><path d="M12 22a10 10 0 0 0 0-20"/><path d="M2 12h20"/><path d="M12 2v20"/></svg>;
const VolleyballIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M7 2.5a16 16 0 0 1 10 19"/><path d="M17 2.5a16 16 0 0 0-10 19"/><path d="M12 2v20"/></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const LoaderIcon = () => <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;

function App() {
  const [sport, setSport] = useState<SportType>(SportType.FOOTBALL);
  const [mode, setMode] = useState<AnalysisMode>(AnalysisMode.PLAYER);
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [analysisResult, setAnalysisResult] = useState<AnalyzedEntity | null>(null);
  const [matchupResult, setMatchupResult] = useState<MatchupPrediction | null>(null);
  const [scoutResult, setScoutResult] = useState<ScoutSuggestion | null>(null);
  const [comparisonResult, setComparisonResult] = useState<PlayerComparison | null>(null);

  const handleAnalysis = useCallback(async () => {
    if (!input1.trim()) return;
    setLoading(true);
    setError(null);
    setAnalysisResult(null);
    setMatchupResult(null);
    setScoutResult(null);
    setComparisonResult(null);

    try {
      if (mode === AnalysisMode.PLAYER || mode === AnalysisMode.TEAM) {
        const result = await analyzeEntity(input1, sport);
        setAnalysisResult(result);
      } else if (mode === AnalysisMode.MATCHUP) {
        if (!input2.trim()) throw new Error("Por favor, insira o segundo time/jogador");
        const result = await predictMatchup(input1, input2, sport);
        setMatchupResult(result);
      } else if (mode === AnalysisMode.SCOUT) {
         if (!input2.trim()) throw new Error("Por favor, descreva a área problemática (Input 2)");
         const result = await scoutPlayer(input1, input2, sport);
         setScoutResult(result);
      } else if (mode === AnalysisMode.PLAYER_COMPARE) {
        if (!input2.trim()) throw new Error("Por favor, insira o nome do segundo jogador para comparar");
        const result = await comparePlayers(input1, input2, sport);
        setComparisonResult(result);
      }
    } catch (err: any) {
      setError(err.message || "Falha na análise");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [input1, input2, mode, sport]);

  // Determine if we are showing results
  const hasResults = !loading && (analysisResult || matchupResult || scoutResult || comparisonResult);

  return (
    <div className="min-h-screen bg-sport-black text-gray-100 font-sans selection:bg-sport-accent selection:text-sport-black">
      
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-sport-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-sport-accent rounded-br-lg rounded-tl-lg flex items-center justify-center">
                 <span className="font-mono font-bold text-sport-black text-lg">M6</span>
              </div>
              <span className="font-mono font-bold text-xl tracking-tighter">M6A<span className="text-sport-accent">.ANALYTICS</span></span>
            </div>
            
            <div className="hidden md:flex space-x-2 bg-gray-900 p-1 rounded-lg border border-gray-800">
               <button
                  onClick={() => setSport(SportType.FOOTBALL)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-all text-sm font-medium ${sport === SportType.FOOTBALL ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
               >
                 <SoccerBallIcon />
                 <span>Futebol</span>
               </button>
               <button
                  onClick={() => setSport(SportType.BASKETBALL)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-all text-sm font-medium ${sport === SportType.BASKETBALL ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
               >
                 <BasketballIcon />
                 <span>Basquete</span>
               </button>
               <button
                  onClick={() => setSport(SportType.VOLLEYBALL)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-all text-sm font-medium ${sport === SportType.VOLLEYBALL ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
               >
                 <VolleyballIcon />
                 <span>Vôlei</span>
               </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Controls */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
            Desvende o Jogo. <br className="md:hidden"/> <span className="text-sport-accent">Vença a Discussão.</span>
          </h1>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            O framework M6A transforma stats em argumentos irrefutáveis. Pontuações de 0-100 para acabar com o "achismo" na roda de amigos.
          </p>

           {/* Sport Selector Mobile */}
           <div className="flex md:hidden justify-center space-x-2 mb-6">
               <button
                  onClick={() => setSport(SportType.FOOTBALL)}
                  className={`p-2 rounded-md transition-all ${sport === SportType.FOOTBALL ? 'bg-sport-accent text-sport-black' : 'bg-gray-900 text-gray-400'}`}
               >
                 <SoccerBallIcon />
               </button>
               <button
                  onClick={() => setSport(SportType.BASKETBALL)}
                  className={`p-2 rounded-md transition-all ${sport === SportType.BASKETBALL ? 'bg-sport-accent text-sport-black' : 'bg-gray-900 text-gray-400'}`}
               >
                 <BasketballIcon />
               </button>
               <button
                  onClick={() => setSport(SportType.VOLLEYBALL)}
                  className={`p-2 rounded-md transition-all ${sport === SportType.VOLLEYBALL ? 'bg-sport-accent text-sport-black' : 'bg-gray-900 text-gray-400'}`}
               >
                 <VolleyballIcon />
               </button>
           </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
             <div className="flex flex-wrap justify-center gap-1 p-1 bg-gray-900 border border-gray-800 rounded-lg">
                {[AnalysisMode.PLAYER, AnalysisMode.PLAYER_COMPARE, AnalysisMode.MATCHUP, AnalysisMode.TEAM, AnalysisMode.SCOUT].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-4 py-2 rounded-md text-xs md:text-sm font-bold transition-colors uppercase ${mode === m ? 'bg-sport-accent text-sport-black' : 'text-gray-400 hover:text-white'}`}
                  >
                    {m}
                  </button>
                ))}
             </div>
          </div>

          <div className="max-w-2xl mx-auto bg-gray-900/50 p-2 rounded-xl border border-gray-800 flex flex-col md:flex-row gap-2">
            <input
              type="text"
              placeholder={mode === AnalysisMode.SCOUT ? "Time Atual" : "Nome (Entidade A)"}
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 px-4 py-3 outline-none"
              value={input1}
              onChange={(e) => setInput1(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalysis()}
            />
            
            {(mode === AnalysisMode.MATCHUP || mode === AnalysisMode.SCOUT || mode === AnalysisMode.PLAYER_COMPARE) && (
               <input
               type="text"
               placeholder={mode === AnalysisMode.SCOUT ? "Fraqueza (ex: 'Ponteiro sem passe')" : mode === AnalysisMode.PLAYER_COMPARE ? "Nome (Entidade B)" : "Oponente"}
               className="flex-1 bg-transparent border-t md:border-t-0 md:border-l border-gray-800 focus:ring-0 text-white placeholder-gray-500 px-4 py-3 outline-none"
               value={input2}
               onChange={(e) => setInput2(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleAnalysis()}
             />
            )}

            <button
              onClick={handleAnalysis}
              disabled={loading}
              className="bg-sport-accent hover:bg-emerald-400 text-sport-black font-bold px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? <LoaderIcon /> : <SearchIcon />}
              <span>Analisar</span>
            </button>
          </div>
          {error && <p className="text-sport-danger mt-4 font-mono text-sm bg-red-900/20 inline-block px-4 py-1 rounded">{error}</p>}
        </div>

        {/* Results Section */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-gray-800 rounded-full"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-sport-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-400 font-mono mt-6">Consultando Google Search...</p>
          </div>
        )}

        {!loading && analysisResult && (mode === AnalysisMode.PLAYER || mode === AnalysisMode.TEAM) && (
           <div className="animate-fade-in-up">
              <AnalysisCard data={analysisResult} />
           </div>
        )}

        {/* PLAYER COMPARISON MODE */}
        {!loading && comparisonResult && mode === AnalysisMode.PLAYER_COMPARE && (
          <div className="animate-fade-in-up space-y-8">
             
             {/* Header Comparison */}
             <div className="bg-sport-dark border border-gray-800 rounded-xl p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sport-secondary via-sport-accent to-sport-danger"></div>
                <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-2">Veredito M6A</h2>
                <h3 className="text-3xl font-bold text-white mb-6">
                  <span className="text-sport-secondary">{comparisonResult.playerA.entityName}</span>
                  <span className="mx-3 text-gray-600">vs</span>
                  <span className="text-sport-danger">{comparisonResult.playerB.entityName}</span>
                </h3>
                
                <div className="bg-gray-900/80 p-6 rounded-lg max-w-4xl mx-auto backdrop-blur-sm border border-gray-800">
                   <div className="text-left prose prose-invert max-w-none">
                      <ReactMarkdown>{comparisonResult.comparisonAnalysis}</ReactMarkdown>
                   </div>
                </div>
                
                <div className="mt-6 inline-block bg-sport-accent text-sport-black font-bold px-4 py-1 rounded-full text-sm">
                   Vencedor: {comparisonResult.winner}
                </div>
             </div>

             {/* Side by Side Stats */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Player A */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 relative">
                    <div className="absolute top-4 right-4 text-4xl font-mono font-bold text-sport-secondary">{comparisonResult.playerA.overallScore}</div>
                    
                    <div className="flex items-center gap-4 mb-6">
                       {comparisonResult.playerA.imageUrl && (
                         <img src={comparisonResult.playerA.imageUrl} className="w-16 h-16 rounded-full object-cover border-2 border-sport-secondary" alt="" />
                       )}
                       <div>
                          <h3 className="text-xl font-bold text-white">{comparisonResult.playerA.entityName}</h3>
                          <p className="text-sm text-gray-400">{comparisonResult.playerA.team}</p>
                       </div>
                    </div>

                    <div className="h-64 w-full mb-4">
                       <HexChart 
                          attributes={comparisonResult.playerA.attributes} 
                          color="#3b82f6" 
                          compareAttributes={comparisonResult.playerB.attributes}
                          compareColor="#ef4444"
                       />
                    </div>
                    
                    <div className="space-y-2">
                       {comparisonResult.playerA.keyMetrics.map((m, i) => (
                          <div key={i} className="text-xs bg-gray-800 p-2 rounded text-gray-300 border-l-2 border-sport-secondary">{m}</div>
                       ))}
                    </div>
                </div>

                {/* Player B */}
                 <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 relative">
                    <div className="absolute top-4 right-4 text-4xl font-mono font-bold text-sport-danger">{comparisonResult.playerB.overallScore}</div>
                    
                    <div className="flex items-center gap-4 mb-6">
                       {comparisonResult.playerB.imageUrl && (
                         <img src={comparisonResult.playerB.imageUrl} className="w-16 h-16 rounded-full object-cover border-2 border-sport-danger" alt="" />
                       )}
                       <div>
                          <h3 className="text-xl font-bold text-white">{comparisonResult.playerB.entityName}</h3>
                          <p className="text-sm text-gray-400">{comparisonResult.playerB.team}</p>
                       </div>
                    </div>

                    <div className="h-64 w-full mb-4">
                       <HexChart 
                          attributes={comparisonResult.playerB.attributes} 
                          color="#ef4444" 
                          compareAttributes={comparisonResult.playerA.attributes}
                          compareColor="#3b82f6"
                       />
                    </div>

                    <div className="space-y-2">
                       {comparisonResult.playerB.keyMetrics.map((m, i) => (
                          <div key={i} className="text-xs bg-gray-800 p-2 rounded text-gray-300 border-l-2 border-sport-danger">{m}</div>
                       ))}
                    </div>
                </div>
             </div>

             {/* References */}
              {comparisonResult.references && comparisonResult.references.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-800 text-left">
                    <h4 className="text-xs uppercase text-gray-500 font-bold mb-2">Fontes</h4>
                    <ul className="flex flex-wrap gap-3">
                      {comparisonResult.references.map((ref, idx) => (
                        <li key={idx}>
                          <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 hover:underline">
                            {ref.title || "Link"}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
          </div>
        )}


        {/* MATCHUP MODE (TEAM VS TEAM) */}
        {!loading && matchupResult && mode === AnalysisMode.MATCHUP && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up">
             {/* Comparison Card */}
             <div className="col-span-1 md:col-span-2 bg-sport-dark border border-gray-800 p-6 rounded-xl text-center mb-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sport-secondary via-white to-sport-danger"></div>
                <h2 className="text-3xl font-bold mb-2 text-white">PREVISÃO DO JOGO</h2>
                <div className="text-6xl font-mono font-bold text-sport-accent mb-4">{matchupResult.predictedScore}</div>
                <div className="prose prose-invert max-w-none mx-auto text-left bg-gray-900 p-4 rounded-lg">
                   <ReactMarkdown>{matchupResult.analysis}</ReactMarkdown>
                </div>
                 {matchupResult.references && matchupResult.references.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-800 text-left">
                    <h4 className="text-xs uppercase text-gray-500 font-bold mb-2">Fontes</h4>
                    <ul className="flex flex-wrap gap-3">
                      {matchupResult.references.map((ref, idx) => (
                        <li key={idx}>
                          <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 hover:underline">
                            {ref.title || "Link"}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
             </div>

             {/* Team A Stats */}
             <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 relative">
                 {matchupResult.teamA.imageUrl && <img src={matchupResult.teamA.imageUrl} className="w-12 h-12 absolute top-6 right-6 rounded object-contain" alt=""/>}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-sport-secondary">{matchupResult.teamA.entityName}</h3>
                  <span className="text-2xl font-mono font-bold text-white">{matchupResult.teamA.overallScore}</span>
                </div>
                <HexChart attributes={matchupResult.teamA.attributes} color="#3b82f6" compareAttributes={matchupResult.teamB.attributes} compareColor="#ef4444" />
             </div>

             {/* Team B Stats */}
             <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 relative">
                {matchupResult.teamB.imageUrl && <img src={matchupResult.teamB.imageUrl} className="w-12 h-12 absolute top-6 right-6 rounded object-contain" alt=""/>}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-sport-danger">{matchupResult.teamB.entityName}</h3>
                  <span className="text-2xl font-mono font-bold text-white">{matchupResult.teamB.overallScore}</span>
                </div>
                <HexChart attributes={matchupResult.teamB.attributes} color="#ef4444" compareAttributes={matchupResult.teamA.attributes} compareColor="#3b82f6" />
             </div>
          </div>
        )}

        {!loading && scoutResult && mode === AnalysisMode.SCOUT && (
           <div className="max-w-3xl mx-auto bg-sport-dark border border-gray-800 rounded-xl overflow-hidden shadow-2xl animate-fade-in-up">
              <div className="bg-gradient-to-r from-purple-900 to-sport-dark p-6 border-b border-gray-800">
                 <div className="flex gap-4">
                    {scoutResult.imageUrl && (
                      <img src={scoutResult.imageUrl} className="w-20 h-20 rounded-lg object-cover border border-gray-700 bg-gray-900" alt="Player" />
                    )}
                    <div>
                       <h2 className="text-xs font-bold text-purple-300 uppercase tracking-widest mb-1">Recomendação de Scout</h2>
                       <h3 className="text-3xl font-bold text-white">{scoutResult.suggestedPlayer}</h3>
                       <p className="text-gray-400">Foco: <span className="text-white">{scoutResult.targetAttribute}</span></p>
                    </div>
                 </div>
              </div>
              <div className="p-6">
                 <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-900 p-4 rounded border border-gray-800">
                       <span className="block text-xs text-gray-500 uppercase">Time Atual</span>
                       <span className="text-lg font-bold text-white">{scoutResult.currentTeam}</span>
                    </div>
                    <div className="bg-gray-900 p-4 rounded border border-gray-800">
                       <span className="block text-xs text-gray-500 uppercase">Viabilidade</span>
                       <span className={`text-lg font-bold ${scoutResult.viabilityScore > 80 ? 'text-green-400' : 'text-yellow-400'}`}>{scoutResult.viabilityScore}/100</span>
                    </div>
                 </div>
                 <h4 className="font-bold text-gray-300 mb-2">Racional</h4>
                 <div className="prose prose-invert text-gray-400">
                    <ReactMarkdown>{scoutResult.reasoning}</ReactMarkdown>
                 </div>
                 {scoutResult.references && scoutResult.references.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-800">
                      <h4 className="text-xs uppercase text-gray-500 font-bold mb-2">Fontes</h4>
                      <ul className="flex flex-wrap gap-3">
                        {scoutResult.references.map((ref, idx) => (
                          <li key={idx}>
                            <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 hover:underline">
                              {ref.title || "Link"}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
           </div>
        )}

        {/* Feedback Section (Displayed when any result is present) */}
        {hasResults && (
           <FeedbackForm />
        )}

      </main>
    </div>
  );
}

export default App;