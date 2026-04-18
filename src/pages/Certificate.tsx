import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Download, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../lib/api';
import { modules } from '../data/modules';

export default function Certificate({ userId, userName }: { userId: string, userName: string }) {
  const [loading, setLoading] = useState(true);
  const [eligible, setEligible] = useState(false);
  const navigate = useNavigate();

  // Generar un número de serie único basado en el ID del usuario
  const serialNumber = `DA-${userId.substring(0, 8).toUpperCase()}-${new Date().getFullYear()}`;
  const validationUrl = `${window.location.origin}/verify/${serialNumber}`;

  useEffect(() => {
    async function checkEligibility() {
      try {
        const user = await api.getUser(userId);
        const passedModules = user.progress?.filter((p: any) => p.passed).map((p: any) => p.module_id) || [];
        const allPassed = modules.every(m => passedModules.includes(m.id));
        setEligible(allPassed);
      } catch (e: any) {
        console.error(e);
        if (e.message === 'User not found') {
          localStorage.removeItem('dm_userId');
          localStorage.removeItem('dm_userName');
          window.location.href = '/';
        }
      } finally {
        setLoading(false);
      }
    }
    checkEligibility();
  }, [userId]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
      <p className="text-white/70 animate-pulse">Verificando elegibilidad académica...</p>
    </div>
  );

  if (!eligible) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-[20px] p-8 md:p-12 rounded-[40px] shadow-2xl max-w-xl w-full text-center border border-white/20">
          <div className="w-20 h-20 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6 border border-accent/30 animate-pulse">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-white">Certificación en Espera</h2>
          <p className="text-white/70 font-light mb-8 text-lg leading-relaxed">
            Para obtener tu <span className="text-primary font-bold">Certificación de Data Manager</span>, es imperativo completar satisfactoriamente el 100% de los módulos con una calificación mínima del 70%.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-left">
              <p className="text-xs text-white/40 uppercase tracking-tighter">Estado Académico</p>
              <p className="text-accent font-bold">Incompleto</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-left">
              <p className="text-xs text-white/40 uppercase tracking-tighter">Acceso</p>
              <p className="text-white font-bold">Restringido</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="w-full py-4 bg-white text-[#0f2027] rounded-xl font-bold hover:bg-white/90 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            Regresar a la Academia
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 bg-[#0f2027]">
      <header className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl mx-4 sm:mx-6 lg:mx-8 mt-4 sticky top-4 z-10 transition-all hover:bg-white/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center text-white/70 hover:text-white transition-colors group">
            <div className="bg-white/10 p-2 rounded-lg mr-3 group-hover:bg-white/20 transition-colors">
              <ArrowLeft size={18} />
            </div>
            <span className="font-medium">Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <div className="font-bold text-white text-sm tracking-widest uppercase">Certified Professional</div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-12 grid lg:grid-cols-[1fr_400px] gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="bg-white/5 backdrop-blur-md rounded-[32px] p-8 border border-white/10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
                <CheckCircle2 className="text-primary" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">¡Felicitaciones, {userName.split(' ')[0]}!</h1>
                <p className="text-white/60">Has alcanzado el estatus de experto certificado.</p>
              </div>
            </div>
            <p className="text-white/80 font-light leading-relaxed mb-8">
              Tu dedicación en los 15 módulos del programa <span className="text-white font-semibold">DataAcademy</span> te acredita como un profesional capaz de liderar iniciativas complejas de Gobierno de Datos y Seguridad Estratégica.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-[#1a2e35] p-5 rounded-2xl border border-white/5">
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">ID de Certificación</p>
                <p className="text-white font-mono text-lg">{serialNumber}</p>
              </div>
              <div className="bg-[#1a2e35] p-5 rounded-2xl border border-white/5">
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Emitido por</p>
                <p className="text-primary font-bold">DataAcademy Global</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-[32px] p-8 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Descargar Documento Oficial</h3>
              <p className="text-white/60 text-sm">Formato PDF de alta resolución con sellos digitales y firma de validez institucional.</p>
            </div>
            <a 
              href={api.getCertificateUrl(userId)}
              download
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#0f2027] hover:bg-primary hover:text-white font-bold rounded-2xl shadow-xl transition-all whitespace-nowrap group"
            >
              <Download className="mr-2 group-hover:animate-bounce" size={22} /> Descargar Certificado
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          {/* Certificate Preview Card */}
          <div className="bg-white rounded-lg p-6 shadow-2xl overflow-hidden aspect-[1/1.4] flex flex-col relative text-gray-900 origin-top">
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
                  {/* Digital Signature Image */}
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

          <div className="mt-4 text-center">
            <p className="text-white/40 text-xs flex items-center justify-center gap-1">
              <Award size={12} /> Previsualización interactiva de la certificación oficial
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
