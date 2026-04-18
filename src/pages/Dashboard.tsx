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
                  src="/logo.png" 
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
            src="/logo.png" 
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
              className="relative w-full max-w-3xl bg-white/10 backdrop-blur-[25px] border border-white/20 rounded-[32px] p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <button 
                onClick={() => setShowPreview(false)}
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors z-10"
              >
                <X size={20} />
              </button>
              
              <div className="text-center mb-6 mt-2">
                <h3 className="text-2xl font-bold text-white mb-2">Previsualización de tu Certificación</h3>
                <p className="text-white/60 font-light text-sm italic">Este es el diseño oficial que obtendrás al graduarte de DataAcademy.</p>
              </div>

              {/* Final Certificate Style Mockup */}
              <div className="bg-white rounded-lg p-6 shadow-2xl overflow-hidden aspect-[1/1.4] max-w-[380px] flex flex-col relative text-gray-900 mx-auto transform scale-90 sm:scale-100">
                {/* Border Decorations */}
                <div className="absolute inset-2 border-[6px] border-double border-blue-900 rounded-sm pointer-events-none" />
                <div className="absolute inset-4 border border-blue-200 pointer-events-none" />
                
                <div className="mt-8 text-center flex-1">
                  <h2 className="text-blue-900 font-bold text-lg tracking-[0.2em] mb-1">CERTIFICADO DE EXCELENCIA</h2>
                  <p className="text-[10px] text-gray-500 tracking-widest mb-4">DATAACADEMY GLOBAL EDUCATION</p>
                  
                  <div className="w-16 h-1 bg-blue-900 mx-auto mb-8"></div>
                  
                  <p className="text-[11px] text-gray-600 mb-2 uppercase tracking-wide">La dirección académica otorga el presente a:</p>
                  <h3 className="text-2xl font-serif font-black text-blue-950 mb-6 italic px-4 border-b border-gray-100 pb-2 inline-block min-w-[200px]">
                    {userName.toUpperCase()}
                  </h3>
                  
                  <p className="text-[10px] leading-relaxed text-gray-700 px-8 mb-6 italic">
                    Por haber completado con distinción académica el programa de formación ejecutiva integral de 15 módulos
                  </p>
                  
                  <h4 className="text-sm font-bold text-blue-900 mb-1 uppercase tracking-tighter">Certificación de Data Manager</h4>
                  <p className="text-[10px] font-medium text-gray-500 mb-8 italic">Especialidad en Gobierno de Datos y Seguridad</p>
                  
                  <div className="flex justify-between items-end px-10 mt-10 relative">
                    <div className="text-center w-40 relative">
                      {/* Digital Signature Image Demo */}
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-28 h-28 pointer-events-none opacity-90">
                        <img src="/seal.png" alt="Sello de Excelencia" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                      </div>
                      <div className="border-t border-gray-400 w-full mb-1 mt-4"></div>
                      <p className="text-[8px] font-bold text-gray-800 text-nowrap">Miguel Jonathan Mogrovejo Cardenas</p>
                      <p className="text-[7px] text-gray-500 uppercase leading-tight font-medium">Docente especialista en Gobierno de Datos y Ciberseguridad</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="bg-gray-50 p-1 border border-gray-200">
                        <QRCodeSVG value={validationUrl} size={60} level="H" />
                      </div>
                      <p className="text-[6px] mt-1 text-gray-400 font-mono tracking-tighter">{serialNumber}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-blue-900 text-white p-2 flex justify-between items-center text-[7px] font-mono tracking-widest">
                  <span>VALIDACIÓN QR ACTIVA</span>
                  <span>VERIFIED SINCE {new Date().getFullYear()}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
