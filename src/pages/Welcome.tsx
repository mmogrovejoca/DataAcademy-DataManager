import { useState } from 'react';
import { motion } from 'motion/react';
import { api } from '../lib/api';
import { Database, ArrowRight, UserCircle, CheckCircle } from 'lucide-react';

export default function Welcome({ onLogin }: { onLogin: (id: string, name: string) => void }) {
  const [name, setName] = useState('');
  const [step, setStep] = useState<'input' | 'confirm' | 'loading'>('input');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (name.trim().length < 3) {
      setError('Por favor ingresa tu nombre completo (mínimo 3 caracteres)');
      return;
    }
    setError('');
    setStep('confirm');
  };

  const handleConfirm = async () => {
    setStep('loading');
    try {
      const id = await api.registerUser(name.trim());
      onLogin(id, name.trim());
    } catch (e) {
      setError('Hubo un error al registrarte. Intenta de nuevo.');
      setStep('confirm');
    }
  };

  return (    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[500px] glass-morphism rounded-[40px] shadow-2xl relative z-10 overflow-hidden"
      >
        <div className="p-8 sm:p-12 text-center">
          <div className="flex justify-center mb-8">
            <motion.div 
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="w-28 h-28 bg-white/[0.03] rounded-[32px] flex items-center justify-center border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden p-4 group hover:border-primary/30 transition-colors"
            >
              <img 
                src="/logo.svg" 
                alt="DataAcademy Logo" 
                className="w-full h-full object-contain filter group-hover:brightness-110 transition-all"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-2 tracking-tighter font-display">
            Data<span className="text-primary font-light">Academy</span>
          </h1>
          <p className="text-primary/80 font-bold mb-6 uppercase tracking-[0.3em] text-[0.65rem] sm:text-[0.7rem]">
            Certificación de Data Manager
          </p>
          <p className="text-white/60 mb-10 text-[0.9rem] sm:text-[1rem] leading-relaxed max-w-sm mx-auto font-light">
            Formación ejecutiva de alto nivel en gobierno de datos, seguridad estratégica y arquitectura moderna.
          </p>

          {step === 'input' && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-left">
                <label className="block text-[0.65rem] mb-2 text-white/40 uppercase tracking-[0.2em] font-bold">
                  Nombre Completo del Estudiante
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary text-white/30">
                    <UserCircle className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                    className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-[1rem] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 placeholder-white/20 transition-all"
                    placeholder="Ej. Miguel Jonathan Mogrovejo"
                  />
                </div>
                {error && <p className="mt-2 text-xs text-accent font-medium">{error}</p>}
              </div>
              
              <button
                onClick={handleNext}
                className="w-full flex items-center justify-center py-4 bg-white text-dark-surface font-bold rounded-2xl hover:bg-primary hover:text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl disabled:opacity-20 disabled:grayscale"
                disabled={name.trim().length < 3}
              >
                Comenzar Trayectoria <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </motion.div>
          )}

          {step === 'confirm' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8 text-left">
                <div className="flex items-start">
                  <div className="bg-primary/20 p-2 rounded-lg mt-1">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-bold text-white mb-1">Confirmación Académica</h3>
                    <p className="text-xs text-white/50 mb-4 font-light leading-relaxed">Verifica el nombre. Este se imprimirá en tu certificación oficial final.</p>
                    <p className="font-display font-bold text-2xl text-white tracking-tight leading-tight">{name}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setStep('input')}
                  className="flex-1 py-4 px-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white hover:bg-white/10 transition-colors"
                >
                  Regresar
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-4 px-4 bg-primary text-dark-surface font-bold rounded-2xl hover:bg-white transition-all transform hover:scale-[1.02] shadow-lg shadow-primary/20"
                >
                  Confirmar e Ingresar
                </button>
              </div>
            </motion.div>
          )}

          {step === 'loading' && (
            <div className="py-12 flex flex-col items-center justify-center">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
              </div>
              <p className="text-white/60 text-sm font-medium tracking-widest uppercase animate-pulse">Sincronizando Entorno Académico</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
