import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { modules } from '../data/modules';
import { api } from '../lib/api';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, PlayCircle, Book, Activity, FileText } from 'lucide-react';

export default function ModuleDetail({ userId }: { userId: string }) {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'theory' | 'quiz'>(() => {
    const saved = localStorage.getItem(`dm_tab_${moduleId}`);
    return (saved as 'theory' | 'quiz') || 'theory';
  });
  const [answers, setAnswers] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem(`dm_answers_${moduleId}`);
    return saved ? JSON.parse(saved) : {};
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const moduleObj = modules.find(m => m.id === moduleId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [moduleId]);

  // Persist tab and answers
  useEffect(() => {
    localStorage.setItem(`dm_tab_${moduleId}`, activeTab);
  }, [activeTab, moduleId]);

  useEffect(() => {
    if (!submitted) {
      localStorage.setItem(`dm_answers_${moduleId}`, JSON.stringify(answers));
    }
  }, [answers, moduleId, submitted]);

  if (!moduleObj) return <div className="p-8">Módulo no encontrado.</div>;

  const handleOptionSelect = (qId: string, optionIdx: number) => {
    if (submitted) return;
    setAnswers({ ...answers, [qId]: optionIdx });
  };

  const handleQuizSubmit = async () => {
    if (Object.keys(answers).length < moduleObj.quiz.length) {
      alert('Por favor responde todas las preguntas.');
      return;
    }

    let correctCount = 0;
    moduleObj.quiz.forEach(q => {
      if (answers[q.id] === q.correctAnswer) correctCount++;
    });

    const finalScore = Math.round((correctCount / moduleObj.quiz.length) * 100);
    const passed = finalScore >= 70;

    setScore(finalScore);
    setSubmitted(true);
    
    // Clear persistence on successful submission or specific result
    localStorage.removeItem(`dm_answers_${moduleId}`);
    localStorage.removeItem(`dm_tab_${moduleId}`);

    try {
      await api.saveProgress(userId, moduleObj.id, finalScore, passed);
    } catch (e) {
      console.error('Error saving progress', e);
    }
  };

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
      {/* Background Accents */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[5%] right-[10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <header className="glass-morphism rounded-[24px] mx-4 sm:mx-8 lg:mx-auto max-w-4xl mt-6 sticky top-6 z-40 transition-all duration-300">
        <div className="px-6 h-18 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center text-white/40 hover:text-primary transition-colors group">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mr-3 group-hover:bg-primary/20 transition-colors p-1.5">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">Panel</span>
          </Link>
          <div className="flex flex-col items-center max-w-[60%] text-center">
            <span className="text-primary text-[0.6rem] font-black uppercase tracking-[0.2em] leading-tight">Módulo Académico</span>
            <span className="text-white font-bold text-sm tracking-tight truncate w-full">
              {moduleObj.title}
            </span>
          </div>
          <div className="w-8 sm:w-16" /> {/* Spacer */}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-12 relative z-10">
        
        {/* Module Header / Hero */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-16 h-16 bg-primary/10 rounded-[20px] flex items-center justify-center text-primary border border-white/10 shrink-0">
              <PlayCircle size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white mb-4 tracking-tighter font-display leading-none">
                {moduleObj.title}
              </h1>
              <p className="text-white/50 text-[1.1rem] leading-relaxed font-light max-w-2xl italic">
                Bienvenido a esta unidad formativa estratégica de nivel ejecutivo. El éxito de tu certificación depende de tu capacidad para conectar la teoría con la ejecución organizacional.
              </p>
            </div>
          </div>
        </section>

        {/* Global Nav Tabs */}
        <div className="grid grid-cols-2 gap-2 mb-10 p-1.5 glass-morphism rounded-2xl">
          <button
            onClick={() => setActiveTab('theory')}
            className={`py-3.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 ${
              activeTab === 'theory' 
                ? 'bg-white text-dark-surface shadow-xl shadow-white/5' 
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            }`}
          >
            <Book size={18} /> Teoría y Casos
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`py-3.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 ${
              activeTab === 'quiz' 
                ? 'bg-white text-dark-surface shadow-xl shadow-white/5' 
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            }`}
          >
            <Activity size={18} /> Misión Práctica
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'theory' && (
            <motion.div
              key="theory"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <section className="glass-morphism p-8 sm:p-12 rounded-[40px] shadow-2xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-all duration-1000" />
                
                <div className="flex items-center gap-3 mb-8">
                  <span className="w-1.5 h-6 bg-primary rounded-full" />
                  <h2 className="text-2xl font-black text-white tracking-tighter font-display">Desarrollo <span className="text-primary font-light">Conceptual</span></h2>
                </div>
                
                <div className="text-white/60 font-light leading-relaxed prose prose-invert max-w-none text-[1.1rem]">
                  {moduleObj.content.theory}
                </div>
              </section>

              <div className="grid lg:grid-cols-[1.2fr,1fr] gap-8">
                <section className="glass-morphism p-8 rounded-[32px] border-primary/20 bg-primary/[0.02]">
                  <div className="inline-flex items-center px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg mb-6">
                    <span className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-primary">Case Study • Sector Seguros</span>
                  </div>
                  <p className="text-white/80 text-[1rem] leading-relaxed font-light mb-8 italic border-l-2 border-primary/20 pl-6">
                    "{moduleObj.content.insuranceExample}"
                  </p>
                  
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <h3 className="text-sm font-black mb-4 text-primary uppercase tracking-widest">Tips de Aplicación Strategica</h3>
                    <ul className="space-y-4 text-sm text-white/50 font-light">
                      {moduleObj.content.tips.map((tip, i) => (
                        <li key={i} className="flex gap-3">
                          <CheckCircle className="text-primary/40 shrink-0" size={16} />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                <section className="space-y-8">
                  <div className="glass-morphism p-8 rounded-[32px]">
                    <h3 className="text-sm font-black mb-6 text-white uppercase tracking-widest">Glosario Ejecutivo</h3>
                    <div className="space-y-6">
                      {moduleObj.content.glossary.map((g, i) => (
                        <div key={i} className="group">
                          <dt className="font-bold text-primary group-hover:text-white transition-colors tracking-tight text-lg">{g.term}</dt>
                          <dd className="text-sm text-white/40 font-light mt-1.5 leading-relaxed">{g.definition}</dd>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-morphism p-8 rounded-[32px] border-accent/20">
                    <h3 className="text-sm font-black mb-6 text-accent uppercase tracking-widest">Puntos Críticos de Falla</h3>
                    <ul className="space-y-4 text-sm text-white/50 font-light">
                      {moduleObj.content.commonErrors.map((err, i) => (
                        <li key={i} className="flex gap-3">
                          <AlertCircle className="text-accent underline decoration-accent/20 underline-offset-4" size={18} />
                          <span>{err}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              </div>

              <div className="flex justify-center pt-10">
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="px-12 py-5 bg-white text-dark-surface font-black uppercase tracking-widest text-[0.7rem] rounded-2xl hover:bg-primary hover:text-white transition-all transform hover:scale-[1.05] shadow-2xl hover:shadow-primary/30 active:scale-95"
                >
                  Continuar a Validación Académica
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <AnimatePresence>
                {submitted && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`mb-12 p-8 sm:p-12 rounded-[40px] border-2 shadow-2xl relative overflow-hidden ${score >= 70 ? 'bg-primary/10 border-primary/50 text-white' : 'bg-accent/10 border-accent/50 text-white'}`}
                  >
                    <div className="absolute top-0 left-0 w-full h-2 bg-white/10 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        className={`h-full ${score >= 70 ? 'bg-primary' : 'bg-accent'}`}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-10">
                      <div className={`w-24 h-24 rounded-[30px] flex items-center justify-center shrink-0 border-4 ${score >= 70 ? 'bg-primary/20 border-primary/20 text-primary' : 'bg-accent/20 border-accent/20 text-accent'}`}>
                        {score >= 70 ? <CheckCircle size={50} strokeWidth={2.5} /> : <XCircle size={50} strokeWidth={2.5} />}
                      </div>
                      <div className="text-center sm:text-left">
                        <span className={`text-[0.7rem] font-black uppercase tracking-[0.4em] mb-2 block ${score >= 70 ? 'text-primary' : 'text-accent'}`}>
                          Resultado Técnico
                        </span>
                        <h3 className="text-4xl font-black mb-3 tracking-tighter font-display">
                          {score >= 70 ? 'MÓDULO SUPERADO' : 'REQUIERE REFUERZO'}
                        </h3>
                        <p className="text-white/60 text-xl font-light">
                          Has alcanzado una precisión del <span className="text-white font-bold">{score}%</span>.
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-12 flex flex-col sm:flex-row gap-4">
                      {score >= 70 ? (
                        <button 
                          onClick={() => navigate('/dashboard')} 
                          className="flex-1 py-5 bg-white text-dark-surface font-black uppercase tracking-[0.2em] text-[0.8rem] rounded-2xl hover:bg-primary hover:text-white transition-all shadow-2xl shadow-black/20"
                        >
                          Regresar al Panel
                        </button>
                      ) : (
                        <button 
                          onClick={() => { setSubmitted(false); setAnswers({}); }} 
                          className="flex-1 py-5 bg-accent text-white font-black uppercase tracking-[0.2em] text-[0.8rem] rounded-2xl hover:scale-[1.02] transition-all shadow-2xl shadow-accent/20"
                        >
                          Reintentar Evaluación
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-8">
                {moduleObj.quiz.map((q, idx) => {
                  const isAnswered = typeof answers[q.id] !== 'undefined';
                  const isCorrect = answers[q.id] === q.correctAnswer;
                  
                  return (
                    <div key={q.id} className="glass-morphism p-8 sm:p-10 rounded-[40px] shadow-lg border-white/5 overflow-hidden transition-all duration-300">
                      <div className="flex items-start gap-6 mb-10">
                        <span className="text-primary/30 font-display font-black text-4xl shrink-0">{(idx + 1).toString().padStart(2, '0')}</span>
                        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mt-1">
                          {q.question}
                        </h3>
                      </div>
                      
                      <div className="space-y-4">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = answers[q.id] === optIdx;
                          let btnClass = "w-full text-left p-6 rounded-[32px] border-2 transition-all duration-300 relative group overflow-hidden ";
                          
                          if (submitted) {
                            if (q.correctAnswer === optIdx) {
                              btnClass += "bg-primary/20 border-primary/50 text-white font-bold shadow-lg shadow-primary/10 ";
                            } else if (isSelected) {
                              btnClass += "bg-accent/20 border-accent text-white opacity-90 ";
                            } else {
                              btnClass += "bg-white/[0.02] border-white/5 text-white/20 opacity-40 ";
                            }
                          } else {
                            if (isSelected) {
                              btnClass += "bg-primary text-dark-surface border-white/20 shadow-2xl scale-[1.01]";
                            } else {
                              btnClass += "bg-white/[0.03] border-white/5 text-white/60 hover:border-white/20 hover:bg-white/[0.08] hover:text-white";
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleOptionSelect(q.id, optIdx)}
                              disabled={submitted}
                              className={btnClass}
                            >
                              <div className="flex items-center relative z-10">
                                <div className={`w-6 h-6 rounded-xl border-2 flex-shrink-0 mr-5 flex items-center justify-center transition-all ${
                                  isSelected 
                                    ? 'border-dark-surface bg-dark-surface' 
                                    : 'border-white/10 bg-white/5'
                                }`}>
                                  {isSelected && <div className="w-3 h-3 rounded-md bg-primary" />}
                                </div>
                                <span className="text-[1.05rem] font-medium tracking-tight leading-snug">{opt}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <AnimatePresence>
                        {submitted && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className={`mt-10 p-8 rounded-[32px] border-l-[8px] transition-all duration-500 ${isCorrect ? 'bg-primary/5 border-primary/40 text-white/80' : 'bg-white/[0.02] border-white/10 text-white/60'}`}
                          >
                            <div className={`font-black text-[0.7rem] uppercase tracking-widest mb-3 flex items-center gap-2 ${isCorrect ? 'text-primary' : 'text-white/40'}`}>
                              {isCorrect ? <CheckCircle size={16} className="text-primary"/> : <AlertCircle size={16} className="text-white/20"/>} 
                              Feedback Estratégico
                            </div>
                            <div className="text-[1rem] font-light leading-relaxed italic">
                              {q.explanation}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {!submitted && (
                <div className="mt-16 flex justify-center sticky bottom-10 z-30">
                  <button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(answers).length < moduleObj.quiz.length}
                    className="px-16 py-6 bg-white text-dark-surface disabled:opacity-20 disabled:grayscale disabled:scale-100 hover:scale-[1.05] font-black uppercase tracking-[0.3em] rounded-3xl transition-all shadow-[0_30px_60px_rgba(0,0,0,0.6)] flex items-center gap-4 text-sm"
                  >
                    Validar Respuestas Ejecutivas <Activity size={20} />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
