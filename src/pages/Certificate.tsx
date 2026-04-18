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

      <main className="max-w-7xl mx-auto px-4 mt-12 space-y-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="grid lg:grid-cols-[1fr_400px] gap-8"
        >
          <div className="bg-white/5 backdrop-blur-md rounded-[32px] p-8 border border-white/10 flex flex-col justify-center">
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

          <div className="bg-white/5 rounded-[32px] p-8 border border-white/10 flex flex-col justify-center gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Descargar Documento</h3>
              <p className="text-white/60 text-sm">Formato PDF 1920x1080 de alta resolución con sellos digitales.</p>
            </div>
            <a 
              href={api.getCertificateUrl(userId)}
              download
              className="inline-flex items-center justify-center px-8 py-5 bg-white text-[#0f2027] hover:bg-primary hover:text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl transition-all group"
            >
              <Download className="mr-2 group-hover:animate-bounce" size={18} /> Obtener Certificado PDF
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative max-w-2xl mx-auto w-full"
        >
          {/* Vertical Certificate Preview Card - Portrait A4 Ratio */}
          <div className="bg-white rounded-[15px] shadow-2xl overflow-hidden aspect-[1/1.414] w-full flex flex-col relative text-gray-900 border-[12px] border-[#1e3a8a]/5 select-none transition-transform hover:scale-[1.01]">
            {/* Elegant Background Tint */}
            <div className="absolute bottom-0 left-0 w-full h-[15%] bg-[#f8fafc] -z-0" />
            
            {/* Border Decorations */}
            <div className="absolute inset-4 sm:inset-10 border-[10px] border-double border-blue-900 rounded-sm pointer-events-none" />
            <div className="absolute inset-7 sm:inset-[50px] border border-blue-100 pointer-events-none" />
            
            <div className="mt-8 sm:mt-16 text-center flex-1 z-10 px-6 overflow-hidden flex flex-col items-center">
              {/* Logo on Certificate Mockup */}
              <div className="w-12 sm:w-20 h-12 sm:h-20 mb-3 sm:mb-6">
                <img 
                  src="/logo.svg" 
                  alt="Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <h2 className="text-blue-900 font-bold text-[7px] sm:text-base tracking-[0.4em] mb-3 sm:mb-6 uppercase">DATAACADEMY GLOBAL EDUCATION</h2>
              
              <h1 className="text-lg sm:text-4xl font-serif font-black text-blue-900 leading-tight uppercase">CERTIFICADO DE</h1>
              <h1 className="text-xl sm:text-5xl font-serif font-black text-blue-900 tracking-[0.1em] mb-6 sm:mb-12 uppercase">EXCELENCIA</h1>
              
              <p className="text-[9px] sm:text-base text-gray-500 mb-2 sm:mb-3 font-light tracking-wide italic">Se otorga la presente certificación académica a:</p>
              <h3 className="text-lg sm:text-5xl font-serif font-black text-blue-950 mb-6 sm:mb-12 italic px-8 border-b-2 border-gray-100 pb-1 sm:pb-3 inline-block">
                {userName.toUpperCase()}
              </h3>
              
              <p className="text-[7px] sm:text-sm leading-relaxed text-gray-600 px-10 sm:px-20 mb-4 sm:mb-8 italic max-w-2xl mx-auto">
                Por haber completado con distinción académica superior y rigor técnico el programa de formación ejecutiva integral de 15 módulos especializados en el dominio de:
              </p>
              
              <h4 className="text-sm sm:text-xl font-bold text-blue-900 mb-0.5 uppercase tracking-tight">Certificación de Data Manager</h4>
              <p className="text-[9px] sm:text-base font-bold text-blue-500 mb-8 sm:mb-16">Especialidad Superior en Gobierno de Datos y Ciberseguridad</p>
              
              {/* Footer Section for Vertical Layout */}
              <div className="mt-auto w-full px-6 sm:px-20 pb-8 sm:pb-16 flex flex-col items-center gap-8 sm:gap-14">
                {/* Signature Area */}
                <div className="text-center w-full relative pt-12">
                  <div className="absolute -top-12 sm:-top-24 left-1/2 -translate-x-1/2 w-24 sm:w-48 h-24 sm:h-48 pointer-events-none z-20">
                    <img 
                      src="/seal.png" 
                      alt="Sello Data Governance Expert" 
                      className="w-full h-full object-contain drop-shadow-2xl" 
                      referrerPolicy="no-referrer"
                      onError={(e) => e.currentTarget.style.display = 'none'}
                    />
                  </div>
                  <div className="border-t sm:border-t-2 border-gray-300 w-full mb-2 sm:mb-4"></div>
                  <p className="text-[10px] sm:text-2xl font-black text-blue-950">Miguel Jonathan Mogrovejo Cardenas</p>
                  <p className="text-[6px] sm:text-[10px] text-gray-400 uppercase leading-snug font-bold mt-1 tracking-widest">Docente Especialista en Gobierno de Datos y Seguridad</p>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center">
                  <div className="bg-white p-1 sm:p-2 border border-gray-100 shadow-sm mb-2 rounded-lg sm:rounded-xl">
                    <QRCodeSVG value={validationUrl} size={window.innerWidth < 640 ? 40 : 100} level="H" includeMargin={true} />
                  </div>
                  <p className="text-[6px] sm:text-[10px] text-gray-300 font-mono tracking-widest uppercase">ID: {serialNumber}</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 left-0 w-full flex justify-center text-[6px] sm:text-[10px] text-gray-300 font-mono tracking-[0.3em] uppercase px-4 text-center">
              Verified Academic Credential • Global Validation Active
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-white/40 text-xs flex items-center justify-center gap-2">
              <ShieldCheck size={14} className="text-primary" /> Certificación Académica (Formato Vertical • Alta Resolución)
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
