import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../lib/api';
import { modules } from '../data/modules';
import { Database, LogOut, CheckCircle, Lock, BookOpen, ChevronRight, Award, Eye, X } from 'lucide-react';

export default function Dashboard({ userId, userName, onLogout }: { userId: string, userName: string, onLogout: () => void }) {
  const [progressData, setProgressData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  const serialNumber = "DA-DEMO-2026";
  const validationUrl = `${window.location.origin}/verify/${serialNumber}`;

  useEffect(() => {
    async function fetchProgress() {
      try {
        const user = await api.getUser(userId);
        setProgressData(user.progress || []);
      } catch (e: any) {
        console.error(e);
        if (e.message === 'User not found') {
          onLogout();
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProgress();
  }, [userId]);

  const passedModules = progressData.filter(p => p.passed).map(p => p.module_id);
  const allPassed = modules.every(m => passedModules.includes(m.id));

  // Determine what is unlocked. M1 is always unlocked. Others unlock if previous is passed.
  const isUnlocked = (index: number) => {
    if (index === 0) return true;
    return passedModules.includes(modules[index - 1].id);
  };

  const getModuleStatus = (moduleId: string) => {
    const prog = progressData.find(p => p.module_id === moduleId);
    if (prog?.passed) return 'passed';
    if (prog) return 'failed';
    return 'unattempted';
  };

  const overallProgress = Math.round((passedModules.length / modules.length) * 100);

  if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-slate-900 text-slate-500">Cargando dashboard...</div>;

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="glass-morphism mx-4 sm:mx-8 lg:mx-auto max-w-7xl mt-6 rounded-[24px] sticky top-6 z-40 transition-all duration-300">
        <div className="px-6 sm:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 shrink-0 p-2 overflow-hidden">
                <img 
                  src="/logo.svg" 
                  alt="Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black text-xl tracking-tight leading-none font-display">DATA<span className="text-primary font-light">ACADEMY</span></span>
                <span className="text-[0.6rem] text-primary/60 uppercase tracking-[0.2em] font-bold mt-1 hidden sm:block">Executive Management</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-6">
              <button 
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all text-white/80 text-xs sm:text-sm font-semibold group"
              >
                <Eye size={18} className="group-hover:text-primary transition-colors" /> 
                <span className="hidden sm:inline">Previsualizar Certificado</span>
              </button>

              <div className="h-8 w-[1px] bg-white/10 mx-1 hidden sm:block" />

              <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-white/40 text-[0.65rem] uppercase tracking-widest font-bold">Estudiante</span>
                  <span className="text-white font-bold text-sm tracking-tight">{userName}</span>
                </div>
                <button 
                  onClick={onLogout} 
                  className="w-10 h-10 flex items-center justify-center bg-accent/10 hover:bg-accent/20 text-accent rounded-xl transition-all border border-accent/20 active:scale-95"
                  title="Cerrar sesión"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-12 relative z-10">
        {/* Welcome & Progress Section */}
        <section className="mb-12">
          <div className="glass-morphism rounded-[40px] p-8 sm:p-12 relative overflow-hidden group">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
            
            <div className="relative z-10 grid lg:grid-cols-[1fr,400px] gap-12 items-center">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tighter leading-tight font-display">
                    Panel de Control <br/><span className="text-primary font-light underline decoration-white/10 underline-offset-8">Académico</span>
                  </h2>
                  <p className="text-white/50 mb-8 max-w-xl text-[0.95rem] leading-relaxed font-light">
                    Bienvenido de vuelta, <span className="text-white font-medium">{userName}</span>. Tu trayectoria hacia la certificación de Data Manager está al {overallProgress}%. Mantén la disciplina estratégica en cada módulo.
                  </p>
                </motion.div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-end mb-2 px-1">
                    <span className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-white/40">Progreso de Candidatura</span>
                    <span className="text-2xl font-black text-white font-mono">{overallProgress}%</span>
                  </div>
                  <div className="bg-white/5 rounded-full h-4 p-1 border border-white/10">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${overallProgress}%` }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full shadow-[0_0_15px_rgba(0,210,255,0.4)]"
                    />
                  </div>
                </div>
              </div>
              
              <div className="relative">
                {allPassed ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white text-dark-surface rounded-[32px] p-8 shadow-2xl relative z-10 transform lg:rotate-2 hover:rotate-0 transition-transform duration-500"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-6 shadow-inner">
                        <Award size={32} />
                      </div>
                      <h3 className="text-xl font-black mb-3 font-display">¡GRADUACIÓN DISPONIBLE!</h3>
                      <p className="text-dark-surface/60 text-sm mb-8 font-medium leading-normal">
                        Has superado satisfactoriamente los 15 módulos de nivel ejecutivo.
                      </p>
                      <button
                        onClick={() => navigate('/certificate')}
                        className="w-full py-4 bg-primary text-dark-surface rounded-2xl font-black text-sm tracking-widest hover:bg-dark-surface hover:text-white transition-all transform hover:translate-y-[-2px] active:translate-y-0 shadow-lg"
                      >
                        DESCARGAR CERTIFICACIÓN
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary shrink-0">
                        <BookOpen size={20} />
                      </div>
                      <span className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-primary">Insight Ejecutivo</span>
                    </div>
                    <blockquote className="text-white/80 font-serif italic text-lg leading-relaxed mb-6">
                      "La gobernanza de datos no es un proyecto, es un cambio cultural que habilita la resiliencia en la era digital."
                    </blockquote>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-[2px] bg-primary/40 rounded-full" />
                      <span className="text-[0.7rem] uppercase tracking-widest text-white/40 font-bold">M. Mogrovejo • Senior Advisor</span>
                    </div>
                  </div>
                )}
                {/* Decorative glow */}
                <div className="absolute -inset-4 bg-primary/20 blur-[50px] -z-10 rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
            </div>
          </div>
        </section>

        {/* Modules Grid Header */}
        <div className="flex flex-col sm:flex-row justify-between items-end mb-8 gap-4 px-2">
          <div>
            <span className="text-primary text-[0.7rem] uppercase tracking-[0.3em] font-black block mb-2">Plan de Estudios</span>
            <h3 className="text-3xl font-bold text-white tracking-tight font-display">Módulos de Formación</h3>
          </div>
          <div className="text-white/40 text-xs hidden sm:block font-medium">
            15 Módulos obligatorios para certificación
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {modules.map((module, index) => {
            const unlocked = isUnlocked(index);
            const status = getModuleStatus(module.id);
            const scoreRecord = progressData.find(p => p.module_id === module.id);
            
            return (
              <motion.div 
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`group relative flex flex-col p-8 rounded-[32px] transition-all duration-500 border ${
                  status === 'passed' ? 'bg-primary/5 border-primary/30 shadow-[0_0_40px_rgba(0,210,255,0.05)]' :
                  unlocked ? 'bg-white/5 border-white/10 hover:bg-white/[0.08] hover:border-white/20' : 
                  'bg-white/[0.02] border-white/5 opacity-40 grayscale pointer-events-none'
                }`}
              >
                <div className="mb-8 flex justify-between items-start">
                  <span className={`text-4xl font-black font-display opacity-10 ${status === 'passed' ? 'text-primary' : 'text-white'}`}>
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                  
                  <div className="flex flex-col items-end gap-2">
                    {status === 'passed' && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 border border-primary/30 text-primary rounded-xl text-[0.6rem] font-black uppercase tracking-widest shadow-lg shadow-primary/10">
                        <CheckCircle size={12} strokeWidth={3} /> {scoreRecord.score}%
                      </div>
                    )}
                    {status === 'failed' && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/20 border border-accent/30 text-accent rounded-xl text-[0.6rem] font-black uppercase tracking-widest">
                        Repetir ({scoreRecord.score}%)
                      </div>
                    )}
                    {!unlocked && (
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/30 border border-white/5">
                        <Lock size={18} />
                      </div>
                    )}
                  </div>
                </div>
                
                <h4 className={`text-xl font-bold leading-[1.15] mb-4 tracking-tight font-display transition-colors ${status === 'passed' ? 'text-white' : unlocked ? 'group-hover:text-primary text-white' : 'text-white/60'}`}>
                  {module.title}
                </h4>
                <p className="text-[0.9rem] text-white/50 mb-8 flex-1 leading-relaxed font-light line-clamp-3">
                  {module.description}
                </p>
                
                {unlocked && (
                  <Link 
                    to={`/module/${module.id}`}
                    className={`w-full py-4 rounded-2xl text-[0.7rem] tracking-[0.2em] font-black uppercase flex items-center justify-center transition-all transform active:scale-95 ${
                      status === 'passed' 
                      ? 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10' 
                      : 'bg-white text-dark-surface hover:bg-primary hover:text-white shadow-xl group-hover:shadow-primary/20 group-hover:scale-[1.02]'
                    }`}
                  >
                    {status === 'passed' ? 'Repasar Lección' : 'Iniciar Módulo'} <ChevronRight size={14} className="ml-2" />
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="max-w-7xl mx-auto px-8 py-16 mt-12 border-t border-white/5 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4 grayscale opacity-40 hover:grayscale-0 transition-all">
          <img 
            src="/logo.svg" 
            alt="DataAcademy" 
            className="w-8 h-8 object-contain"
            referrerPolicy="no-referrer"
          />
          <span className="font-display font-black tracking-tighter text-xl uppercase text-white">DataAcademy</span>
        </div>
        <div className="text-white/20 text-[0.7rem] font-medium tracking-widest uppercase">
          © {new Date().getFullYear()} DataAcademy Global • Academia de Formación Ejecutiva
        </div>
      </footer>

      {/* Certificate Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPreview(false)}
              className="absolute inset-0 bg-[#0f2027]/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-white/10 backdrop-blur-[25px] border border-white/20 rounded-[40px] p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <button 
                onClick={() => setShowPreview(false)}
                className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors z-20"
              >
                <X size={20} />
              </button>
              
              <div className="text-center mb-8">
                <span className="text-primary text-[0.65rem] font-black uppercase tracking-[0.3em] block mb-2">Simulación de Grado</span>
                <h3 className="text-2xl font-bold text-white mb-2">Vista Vertical de Certificación</h3>
                <p className="text-white/40 font-light text-sm italic">Este es el formato académico final que recibirás al completar el programa.</p>
              </div>

              {/* Vertical Certificate Style Mockup - Portrait */}
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden aspect-[1/1.414] w-full max-w-[450px] mx-auto flex flex-col relative text-gray-900 border-[10px] border-[#1e3a8a]/5 select-none touch-none">
                {/* Background Details */}
                <div className="absolute bottom-0 left-0 w-full h-[12%] bg-[#f8fafc] -z-0" />
                
                {/* Border Decorations */}
                <div className="absolute inset-3 border-[6px] border-double border-blue-900 rounded-sm pointer-events-none" />
                <div className="absolute inset-5 border border-blue-100 pointer-events-none" />
                
                <div className="mt-6 sm:mt-10 text-center flex-1 z-10 px-6 overflow-hidden flex flex-col items-center">
                  {/* Logo on Certificate Mockup */}
                  <div className="w-8 h-8 sm:w-12 sm:h-12 mb-3">
                    <img 
                      src="/logo.svg" 
                      alt="Logo" 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <h2 className="text-blue-900 font-bold text-[5px] sm:text-[8px] tracking-[0.3em] mb-3 uppercase">DataAcademy Global Education</h2>
                  
                  <h1 className="text-[10px] sm:text-xl font-serif font-black text-blue-900 leading-tight uppercase">Certificado de</h1>
                  <h1 className="text-xs sm:text-2xl font-serif font-black text-blue-900 tracking-[0.1em] mb-4 sm:mb-6 uppercase">Excelencia</h1>
                  
                  <p className="text-[5px] sm:text-[9px] text-gray-500 mb-0.5 font-light italic">Se otorga el presente a:</p>
                  <h3 className="text-xs sm:text-xl font-serif font-black text-blue-950 mb-4 sm:mb-6 italic px-4 border-b border-gray-100 pb-0.5 inline-block">
                    {userName.toUpperCase()}
                  </h3>
                  
                  <p className="text-[4px] sm:text-[8px] leading-relaxed text-gray-600 px-8 mb-3 italic">
                    Por haber completado con distinción académica el programa de formación de 15 módulos en:
                  </p>
                  
                  <h4 className="text-[6px] sm:text-xs font-bold text-blue-900 mb-0.5 uppercase">Certificación de Data Manager</h4>
                  <p className="text-[5px] sm:text-[8px] font-bold text-blue-500 mb-4 sm:mb-8">Especialidad en Gobierno de Datos y Seguridad</p>
                  
                  {/* Footer Section */}
                  <div className="mt-auto w-full px-8 pb-6 flex flex-col items-center gap-4 sm:gap-8">
                    <div className="text-center w-full relative">
                      <div className="absolute -top-8 sm:-top-16 left-1/2 -translate-x-1/2 w-16 sm:w-32 h-16 sm:h-32 pointer-events-none z-20">
                        <img 
                          src="/seal.png" 
                          alt="Sello Data Governance Expert" 
                          className="w-full h-full object-contain drop-shadow-2xl" 
                          referrerPolicy="no-referrer"
                          onError={(e) => e.currentTarget.style.display = 'none'}
                        />
                      </div>
                      <div className="border-t border-gray-300 w-full mb-1"></div>
                      <p className="text-[7px] sm:text-xs font-black text-blue-950">Miguel Jonathan Mogrovejo Cardenas</p>
                      <p className="text-[5px] sm:text-[8px] text-gray-400 uppercase font-bold">Docente Especialista</p>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="bg-white p-1 border border-gray-100 rounded-lg">
                        <QRCodeSVG value={validationUrl} size={window.innerWidth < 640 ? 30 : 50} level="H" />
                      </div>
                      <p className="text-[5px] text-gray-300 font-mono mt-1">{serialNumber}</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-2 left-0 w-full flex justify-center text-[4px] sm:text-[8px] text-gray-300 font-mono tracking-widest uppercase opacity-50">
                  Global Academic Credential Active
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
