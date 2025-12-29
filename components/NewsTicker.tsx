
import React from 'react';

const NewsTicker: React.FC = () => {
  return (
    <div className="h-14 bg-red-700 flex items-center overflow-hidden whitespace-nowrap z-50 border-t-4 border-red-500 shadow-[0_-10px_30px_rgba(0,0,0,0.2)]">
      <div className="bg-white text-red-700 font-black px-10 h-full flex items-center uppercase tracking-tighter italic text-2xl skew-x-[-20deg] -ml-5 z-10">
        <span className="skew-x-[20deg] pl-4">Destaques</span>
      </div>
      <div className="flex animate-marquee-fast h-full items-center">
        {[1, 2].map((i) => (
          <span key={i} className="text-white text-2xl font-black flex items-center uppercase tracking-tight">
            <span className="mx-12 opacity-40 text-4xl">•</span>
            <span>Confira os novos anúncios de imóveis e veículos no StandLocal</span>
            <span className="mx-12 opacity-40 text-4xl">•</span>
            <span>Anuncie sua empresa aqui e alcance toda a cidade</span>
            <span className="mx-12 opacity-40 text-4xl">•</span>
            <span>StandLocal: O maior e melhor portal de classificados da região</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-fast {
          animation: marquee 35s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;
