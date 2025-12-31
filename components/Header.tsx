

import React, { useState, useEffect } from 'react';

interface HeaderProps {
  isVertical: boolean;
  onToggleOrientation: () => void;
}

const Header: React.FC<HeaderProps> = ({ isVertical, onToggleOrientation }) => {
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
    <header className="h-16 sm:h-20 lg:h-28 bg-white border-b border-slate-100 flex items-center justify-between px-3 sm:px-6 lg:px-12 z-50 shrink-0">
      {/* Lado Esquerdo: Logo e Slogan */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center">
          <div className="h-10 sm:h-12 lg:h-16 flex items-center justify-start overflow-hidden">
            <img
              src={logoUrl}
              alt="StandLocal"
              className="h-full w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const span = document.createElement('span');
                  span.className = 'text-xl sm:text-2xl lg:text-4xl font-black text-slate-800 tracking-tighter';
                  span.innerText = 'STANDLOCAL';
                  parent.appendChild(span);
                }
              }}
            />
          </div>
        </div>
        <p className="text-xs sm:text-sm lg:text-xl font-semibold text-slate-500 tracking-tight mt-0.5 sm:mt-1 hidden sm:block">
          A vitrine ideal para seus negócios locais.
        </p>
      </div>

      {/* Centro: QR Code Integrado (Não obstrui nada) */}
      <div className="hidden md:flex items-center gap-2 lg:gap-4 bg-slate-50 px-3 lg:px-6 py-1.5 lg:py-2 rounded-2xl lg:rounded-3xl border border-slate-100">
        <img
          src={qrCodeUrl}
          alt="QR Code"
          className="w-10 lg:w-16 h-10 lg:h-16 object-contain mix-blend-multiply"
        />
        <div className="flex flex-col">
          <span className="text-[8px] lg:text-[10px] font-black text-red-600 uppercase tracking-widest leading-none">Acesse agora</span>
          <span className="text-xs lg:text-sm font-bold text-slate-700 tracking-tighter">standlocal.com.br</span>
        </div>
      </div>

      {/* Lado Direito: Relógio */}
      <div className="flex flex-col items-end min-w-[120px] sm:min-w-[180px] lg:min-w-[300px]">
        <div className="text-2xl sm:text-4xl lg:text-6xl font-black text-slate-900 tabular-nums leading-none tracking-tighter">
          {formattedTime}
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5 sm:mt-1">
          <div className="text-xs sm:text-base lg:text-xl text-red-600 font-bold uppercase tracking-tight truncate">
            {formattedDate}
          </div>
          <button
            onClick={onToggleOrientation}
            className="w-2 h-2 sm:w-[10px] sm:h-[10px] lg:w-3 lg:h-3 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer flex-shrink-0"
            title={`Alternar para modo ${isVertical ? 'horizontal' : 'vertical'}`}
          >
            <i className={`fas ${isVertical ? 'fa-arrows-alt-h' : 'fa-arrows-alt-v'} text-white text-[4px] sm:text-[5px] lg:text-[6px] flex items-center justify-center`}></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
