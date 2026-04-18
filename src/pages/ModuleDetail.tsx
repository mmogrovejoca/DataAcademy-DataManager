import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { modules } from '../data/modules';
import { api } from '../lib/api';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, PlayCircle, Book, Activity, FileText } from 'lucide-react';

export default function ModuleDetail({ userId }: { userId: string }) {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'theory' | 'quiz'>('theory');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const moduleObj = modules.find(m => m.id === moduleId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [moduleId]);

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

    try {
      await api.saveProgress(userId, moduleObj.id, finalScore, passed);
    } catch (e) {
      console.error('Error saving progress', e);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-white/10 backdrop-blur-[15px] border border-white/20 rounded-2xl mx-4 sm:mx-6 lg:mx-8 mt-4 sticky top-4 z-20">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center text-white/70 hover:text-white transition-colors">
            <ArrowLeft size={20} className="mr-2" /> Volver al Dashboard
          </Link>
          <div className="font-medium text-sm text-white truncate ml-4">
            {moduleObj.title}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        
        {/* Instructor Banner */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-[20px] shadow-[0_4px_30px_rgba(0,0,0,0.1)] mb-8 flex gap-4 items-start">
          <div className="bg-primary/20 p-2 rounded-full hidden sm:block">
            <PlayCircle className="text-primary" size={24} />
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Instructor Virtual:</h4>
            <p className="text-white/80 font-light text-[0.95rem]">
              Bienvenido al módulo <strong>{moduleObj.title}</strong>. Lee atentamente la teoría y el caso de uso del sector seguros antes de realizar el quiz. Necesitas un 70% para aprobar. ¡Mucho éxito en tu formación como Data Manager!
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 border-b border-white/20 mb-8">
          <button
            onClick={() => setActiveTab('theory')}
            className={`px-4 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'theory' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-white/50 hover:text-white/80'
            }`}
          >
            <Book size={18} /> Teoría y Casos Reales
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'quiz' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-white/50 hover:text-white/80'
            }`}
          >
            <Activity size={18} /> Misión Práctica (Quiz)
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'theory' && (
            <motion.div
              key="theory"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <section className="bg-white/10 backdrop-blur-[15px] p-6 rounded-[20px] shadow-[0_4px_30px_rgba(0,0,0,0.1)] border border-white/20">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
                  <FileText className="text-primary" /> Desarrollo Conceptual
                </h2>
                <p className="text-white/80 font-light leading-relaxed">
                  {moduleObj.content.theory}
                </p>
              </section>

              <div className="grid md:grid-cols-2 gap-8">
                <section className="bg-white/10 backdrop-blur-[15px] p-6 rounded-[20px] shadow-[0_4px_30px_rgba(0,0,0,0.1)] border border-white/20">
                  <h3 className="text-lg font-bold mb-4 text-primary">Ejemplo: Sector Seguros</h3>
                  <p className="text-white/80 text-sm font-light leading-relaxed mb-4">
                    {moduleObj.content.insuranceExample}
                  </p>
                  
                  <h3 className="text-md font-bold mt-6 mb-3 text-purple-300">Tips de Negocio</h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-white/80 font-light">
                    {moduleObj.content.tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </section>

                <section className="bg-white/5 backdrop-blur-[15px] p-6 rounded-[20px] shadow-[0_4px_30px_rgba(0,0,0,0.1)] border border-white/10">
                  <h3 className="text-lg font-bold mb-4 text-white">Glosario Interactivo</h3>
                  <div className="space-y-4">
                    {moduleObj.content.glossary.map((g, i) => (
                      <div key={i}>
                        <dt className="font-bold text-secondary">{g.term}</dt>
                        <dd className="text-sm text-white/70 font-light mt-1">{g.definition}</dd>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <h3 className="text-md font-bold mb-3 text-accent">Errores Comunes a Evitar</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-white/80 font-light">
                      {moduleObj.content.commonErrors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                </section>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="px-6 py-[14px] bg-white text-[#0f2027] font-semibold rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] transition-all"
                >
                  Continuar al Quiz
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              {submitted && (
                <div className={`mb-8 p-6 rounded-[20px] backdrop-blur-[15px] border shadow-[0_4px_30px_rgba(0,0,0,0.1)] ${score >= 70 ? 'bg-[rgba(0,210,255,0.1)] border-primary' : 'bg-red-900/20 border-accent'}`}>
                  <div className="flex items-center gap-4">
                    {score >= 70 ? <CheckCircle size={48} className="text-primary" /> : <XCircle size={48} className="text-accent" />}
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        {score >= 70 ? '¡Módulo Aprobado!' : 'Módulo Reprobado'}
                      </h3>
                      <p className="text-lg mt-1 text-white/80 font-light">
                        Has obtenido un {score}% ({score >= 70 ? 'Superaste el 70% requerido' : 'Por debajo del 70% requerido'})
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex gap-4">
                    {score >= 70 ? (
                      <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-primary hover:bg-primary/90 text-[#0f2027] font-semibold rounded-xl shadow-sm transition-colors">
                        Volver al Dashboard
                      </button>
                    ) : (
                      <button onClick={() => { setSubmitted(false); setAnswers({}); }} className="px-6 py-2 bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl shadow-sm transition-colors">
                        Reintentar Quiz
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {moduleObj.quiz.map((q, idx) => {
                  const isAnswered = typeof answers[q.id] !== 'undefined';
                  const isCorrect = answers[q.id] === q.correctAnswer;
                  
                  return (
                    <div key={q.id} className="bg-white/10 backdrop-blur-[15px] p-6 rounded-[20px] shadow-[0_4px_30px_rgba(0,0,0,0.1)] border border-white/20">
                      <h3 className="text-lg font-bold text-white mb-4">
                        <span className="text-white/40 mr-2">{idx + 1}.</span> 
                        {q.question}
                      </h3>
                      
                      <div className="space-y-3">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = answers[q.id] === optIdx;
                          let btnClass = "w-full text-left p-4 rounded-xl border transition-all duration-200 ";
                          
                          if (submitted) {
                            if (q.correctAnswer === optIdx) {
                              btnClass += "bg-[rgba(0,210,255,0.2)] border-primary text-white font-bold shadow-[0_0_15px_rgba(0,210,255,0.3)] ";
                            } else if (isSelected) {
                              btnClass += "bg-accent/20 border-accent text-white shadow-[0_0_15px_rgba(255,78,80,0.3)] ";
                            } else {
                              btnClass += "bg-white/5 border-glass-border text-white/50 opacity-60 ";
                            }
                          } else {
                            if (isSelected) {
                              btnClass += "bg-primary/20 border-primary text-white ring-2 ring-primary/30";
                            } else {
                              btnClass += "bg-white/5 border-white/10 text-white/80 hover:border-white/30 hover:bg-white/10";
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleOptionSelect(q.id, optIdx)}
                              disabled={submitted}
                              className={btnClass}
                            >
                              <div className="flex items-center">
                                <div className={`w-5 h-5 rounded-full border flex-shrink-0 mr-3 flex items-center justify-center ${
                                  isSelected 
                                    ? 'border-primary bg-primary' 
                                    : 'border-white/30'
                                }`}>
                                  {isSelected && <div className="w-2 h-2 rounded-full bg-[#0f2027]" />}
                                </div>
                                {opt}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {submitted && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className={`mt-4 p-4 rounded-xl text-sm border ${isCorrect ? 'bg-primary/10 border-primary/30 text-white' : 'bg-transparent border-white/20 text-white/80'}`}
                        >
                          <div className="font-bold mb-1 flex items-center gap-2">
                            {isCorrect ? <CheckCircle size={16} className="text-primary"/> : <AlertCircle size={16} className="text-accent"/>} 
                            Retroalimentación:
                          </div>
                          {q.explanation}
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!submitted && (
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(answers).length < moduleObj.quiz.length}
                    className="px-8 py-[14px] bg-white text-[#0f2027] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] flex items-center gap-2 text-lg"
                  >
                    Validar Respuestas <Activity size={20} />
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
