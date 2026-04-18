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
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-[15px] border border-white/20 rounded-2xl mx-4 sm:mx-6 lg:mx-8 mt-4 sticky top-4 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 font-black text-[1.4rem] tracking-tighter">
              <span className="text-white">DATA</span><span className="text-primary tracking-widest font-light ml-1">ACADEMY</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowPreview(true)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-colors text-white text-sm font-medium"
                title="Ver Ejemplo del Certificado"
              >
                <Eye size={16} /> <span className="hidden md:inline">Ver Certificado</span>
              </button>
              <button 
                onClick={() => setShowPreview(true)}
                className="sm:hidden p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-colors text-white"
                title="Ver Ejemplo del Certificado"
              >
                <Award size={18} />
              </button>

              <div className="text-sm font-medium text-white/80 border-l border-white/20 pl-4">
                Hola, <span className="font-bold text-white">{userName}</span>
              </div>
              <button onClick={onLogout} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80" title="Cerrar sesión">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Progress & Instructor Notice */}
        <div className="bg-white/10 backdrop-blur-[15px] border border-white/20 rounded-[20px] p-6 md:p-8 text-white mb-10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] relative overflow-hidden">
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Tu progreso global</h2>
              <p className="text-white/70 mb-6 font-light">
                Completa todos los módulos con al menos 70% de aciertos para obtener tu certificado avalado.
              </p>
              
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-1 bg-white/10 rounded-md h-2 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${overallProgress}%` }}
                    transition={{ duration: 1 }}
                    className="bg-gradient-to-r from-primary to-secondary h-full"
                  />
                </div>
                <span className="font-bold text-lg">{overallProgress}%</span>
              </div>
            </div>
            
            {allPassed ? (
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                    <Award size={24} className="text-[#0f2027]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-white">¡Felicidades!</h3>
                    <p className="text-white/70 text-sm">Has completado tu formación.</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/certificate')}
                  className="w-full py-3 bg-white text-[#0f2027] rounded-xl font-bold shadow-sm hover:bg-gray-100 transition-colors"
                >
                  Obtener Certificado
                </button>
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                <h3 className="font-medium text-primary mb-2 flex items-center gap-2">
                  <BookOpen size={18} /> Instructor Virtual
                </h3>
                <p className="text-white/80 font-light text-sm italic">
                  "El camino del Data Manager requiere paciencia y visión organizativa. Enfócate primero en entender qué aporta valor al negocio."
                </p>
              </div>
            )}
          </div>
          
          {/* Decorative graphic */}
          <div className="absolute -right-10 -bottom-10 opacity-[0.05] pointer-events-none mix-blend-overlay">
            <Database size={250} />
          </div>
        </div>

        {/* Modules Grid */}
        <h3 className="text-2xl font-light mb-6 text-white">Ruta de Módulos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {modules.map((module, index) => {
            const unlocked = isUnlocked(index);
            const status = getModuleStatus(module.id);
            const scoreRecord = progressData.find(p => p.module_id === module.id);
            
            return (
              <div 
                key={module.id} 
                className={`relative flex flex-col pt-5 px-6 pb-6 rounded-[20px] backdrop-blur-[15px] border ${
                  status === 'passed' ? 'border-primary bg-[rgba(0,210,255,0.1)]' :
                  unlocked ? 'border-glass-border bg-glass hover:bg-white/15' : 
                  'border-transparent bg-white/5 opacity-60'
                } transition-all duration-300`}
              >
                <div className="mb-4 flex justify-between items-center">
                  <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-sm ${
                    status === 'passed' ? 'bg-primary text-[#0f2027]' :
                    unlocked ? 'bg-white/20 text-white' :
                    'bg-black/30 text-white/50'
                  }`}>
                    {index + 1}
                  </div>
                  
                  {status === 'passed' && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 text-primary rounded-md text-[10px] font-bold uppercase tracking-wider">
                      <CheckCircle size={12} /> Aprobado ({scoreRecord.score}%)
                    </div>
                  )}
                  {status === 'failed' && (
                    <div className="px-3 py-1 bg-accent/20 border border-accent/30 text-accent rounded-md text-[10px] font-bold uppercase tracking-wider">
                      Reprobado ({scoreRecord.score}%)
                    </div>
                  )}
                  {!unlocked && (
                    <div className="text-white/40">
                      <Lock size={16} />
                    </div>
                  )}
                </div>
                
                <h4 className={`text-[1.1rem] font-medium leading-tight mb-3 ${unlocked ? 'text-white' : 'text-white/60'}`}>
                  {module.title}
                </h4>
                <p className="text-[0.85rem] text-white/70 mb-6 flex-1 line-clamp-2 font-light">
                  {module.description}
                </p>
                
                {unlocked ? (
                  <Link 
                    to={`/module/${module.id}`}
                    className={`w-full py-[12px] rounded-xl text-center text-[0.85rem] font-bold flex items-center justify-center transition-colors ${
                      status === 'passed' ? 'bg-transparent border border-white/20 text-white hover:bg-white/10' :
                      'bg-white text-[#0f2027] hover:bg-gray-100 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]'
                    }`}
                  >
                    {status === 'passed' ? 'Repasar módulo' : 'Comenzar módulo'} <ChevronRight size={16} className="ml-1" />
                  </Link>
                ) : (
                  <button disabled className="w-full py-[12px] rounded-xl bg-black/20 text-white/30 text-[0.85rem] font-semibold cursor-not-allowed">
                    Bloqueado
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </main>

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
