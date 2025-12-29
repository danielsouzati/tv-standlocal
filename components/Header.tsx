
import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [time, setTime] = useState(new Date());

  const logoUrl = "/standlocal-logo.png";
  const qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://www.standlocal.com.br";

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const formattedDate = time.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  return (
    <header className="h-28 bg-white border-b border-slate-100 flex items-center justify-between px-12 z-50 shrink-0">
      {/* Lado Esquerdo: Logo e Slogan */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center">
          <div className="h-16 flex items-center justify-start overflow-hidden">
            <img
              src={logoUrl}
              alt="StandLocal"
              className="h-full w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const span = document.createElement('span');
                  span.className = 'text-4xl font-black text-slate-800 tracking-tighter';
                  span.innerText = 'STANDLOCAL';
                  parent.appendChild(span);
                }
              }}
            />
          </div>
        </div>
        <p className="text-xl font-semibold text-slate-500 tracking-tight mt-1">
          A vitrine ideal para seus negócios locais.
        </p>
      </div>

      {/* Centro: QR Code Integrado (Não obstrui nada) */}
      <div className="flex items-center gap-4 bg-slate-50 px-6 py-2 rounded-3xl border border-slate-100">
        <img
          src={qrCodeUrl}
          alt="QR Code"
          className="w-16 h-16 object-contain mix-blend-multiply"
        />
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-red-600 uppercase tracking-widest leading-none">Acesse agora</span>
          <span className="text-sm font-bold text-slate-700 tracking-tighter">standlocal.com.br</span>
        </div>
      </div>

      {/* Lado Direito: Relógio */}
      <div className="flex flex-col items-end min-w-[300px]">
        <div className="text-6xl font-black text-slate-900 tabular-nums leading-none tracking-tighter">
          {formattedTime}
        </div>
        <div className="text-xl text-red-600 font-bold uppercase tracking-tight mt-1">
          {formattedDate}
        </div>
      </div>
    </header>
  );
};

export default Header;
