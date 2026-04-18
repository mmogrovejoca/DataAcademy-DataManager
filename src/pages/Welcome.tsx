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

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-[500px] max-w-[95vw] bg-white/15 backdrop-blur-[40px] border border-white/30 rounded-[32px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        <div className="p-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-primary border border-white/20">
              <Database size={32} />
            </div>
          </div>
          
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            DataAcademy
          </h1>
          <p className="text-primary font-medium mb-6 uppercase tracking-widest text-xs">
            Certificación de Data Manager
          </p>
          <p className="text-white/70 mb-8 text-[0.95rem] leading-relaxed max-w-sm mx-auto">
            Formación ejecutiva de alto nivel en gobierno, arquitectura y gestión de activos de datos.
          </p>

          {step === 'input' && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <label className="block text-left text-[0.8rem] mb-2 text-primary uppercase tracking-widest">
                Ingresa tu nombre completo
              </label>
              <div className="relative mb-8">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserCircle className="h-5 w-5 text-white/50" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                  className="block w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-[1.1rem] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder-white/50"
                  placeholder="Ej. Juan Pérez"
                />
              </div>
              {error && <p className="mb-4 text-sm text-accent">{error}</p>}
              
              <button
                onClick={handleNext}
                className="w-full flex items-center justify-center py-[14px] bg-white text-[#0f2027] font-semibold rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
                disabled={!name.trim()}
              >
                Comenzar <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </motion.div>
          )}

          {step === 'confirm' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 mb-6 text-left">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-white mb-2">Confirmación de Certificado</h3>
                    <div className="text-sm text-white/80">
                      <p>Este nombre aparecerá en tu certificado final. Verifica que esté escrito correctamente:</p>
                      <p className="mt-3 font-bold text-xl text-white">{name}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setStep('input')}
                  className="flex-1 py-[14px] px-4 bg-transparent border border-white/20 rounded-xl text-sm font-semibold text-white hover:bg-white/5 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-[14px] px-4 bg-white text-[#0f2027] font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Confirmar y Entrar
                </button>
              </div>
              {error && <p className="mt-4 text-sm text-center text-accent">{error}</p>}
            </motion.div>
          )}

          {step === 'loading' && (
            <div className="py-8 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p className="text-white/80 text-sm">Preparando tu academia...</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
