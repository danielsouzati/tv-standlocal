
import React, { useState, useEffect, useCallback } from 'react';
import { BannerAd, ClassifiedAd } from './types';
import { fetchPortalData } from './services/dataFetcher';
import { optimizeClassifiedsForTV } from './services/geminiService';
import Header from './components/Header';
import NewsTicker from './components/NewsTicker';

const App: React.FC = () => {
  const [banners, setBanners] = useState<BannerAd[]>([]);
  const [classifieds, setClassifieds] = useState<ClassifiedAd[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [classifiedIndex, setClassifiedIndex] = useState(0);
  const [isVertical, setIsVertical] = useState(false);
  const [manualOrientation, setManualOrientation] = useState<boolean | null>(null);

  // Detecção Automática de Orientação (pode ser sobrescrita manualmente)
  useEffect(() => {
    const handleResize = () => {
      if (manualOrientation === null) {
        setIsVertical(window.innerHeight > window.innerWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [manualOrientation]);

  // Função para alternar orientação manualmente
  const toggleOrientation = () => {
    const newOrientation = manualOrientation === null ? !isVertical : !manualOrientation;
    setManualOrientation(newOrientation);
    setIsVertical(newOrientation);
  };

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchPortalData();
      const optimized = await optimizeClassifiedsForTV(data.classifieds);
      setBanners(data.banners);
      setClassifieds(optimized);
    } catch (err) {
      console.error("Erro ao carregar dados", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const refreshInterval = setInterval(loadData, 15 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, [loadData]);

  // Rotação independente dos BANNERS (10 segundos)
  useEffect(() => {
    if (isLoading || banners.length === 0) return;
    const bannerInterval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % banners.length);
    }, 10000);
    return () => clearInterval(bannerInterval);
  }, [isLoading, banners.length]);

  // Rotação independente dos CLASSIFICADOS (10 segundos)
  useEffect(() => {
    if (isLoading || classifieds.length === 0) return;
    const classifiedInterval = setInterval(() => {
      setClassifiedIndex((prev) => {
        const itemsPerPage = 3;
        const totalPages = Math.ceil(classifieds.length / itemsPerPage);
        return (prev + 1) % totalPages;
      });
    }, 10000);
    return () => clearInterval(classifiedInterval);
  }, [isLoading, classifieds.length]);

  if (isLoading && banners.length === 0) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-bold text-slate-400 uppercase tracking-widest text-sm">Sincronizando StandLocal...</p>
      </div>
    );
  }

  const currentClassifiedsSlice = classifieds.slice(classifiedIndex * 3, (classifiedIndex * 3) + 3);
  const currentBanner = banners[bannerIndex] || banners[0];

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden select-none bg-[#f1f5f9] relative">
      <Header isVertical={isVertical} onToggleOrientation={toggleOrientation} />

      <main className={`flex-1 flex flex-col overflow-hidden ${isVertical ? 'p-3 gap-3' : 'p-4 sm:p-6 gap-4 sm:gap-6'}`}>

        {/* BANNER PRINCIPAL - LAYOUT SPLIT (LADO A LADO) */}
        <section className={`relative overflow-hidden border border-slate-200 bg-white shadow-2xl transition-all duration-700 flex ${isVertical
          ? 'flex-col h-[55%] rounded-2xl sm:rounded-[2.5rem]'
          : 'flex-row h-[60%] sm:h-[65%] rounded-2xl sm:rounded-[2.5rem]'
          }`}>

          {currentBanner && (
            <>
              {/* LADO ESQUERDO: A IMAGEM */}
              <div className={`relative flex items-center justify-center bg-slate-50 ${isVertical ? 'w-full h-3/5' : 'w-[60%] h-full'
                }`}>
                <div
                  className="absolute inset-0 opacity-5 blur-xl bg-center bg-cover"
                  style={{ backgroundImage: `url(${currentBanner.imageUrl})` }}
                />

                <img
                  key={currentBanner.id}
                  src={currentBanner.imageUrl}
                  alt={currentBanner.companyName}
                  className={`relative z-10 max-w-full max-h-full object-contain animate-in fade-in zoom-in duration-700 ${isVertical ? 'p-4 sm:p-6' : 'p-6 sm:p-8'
                    }`}
                />
              </div>

              {/* LADO DIREITO: INFORMAÇÕES */}
              <div className={`flex flex-col justify-center bg-white ${isVertical
                ? 'w-full h-2/5 p-4 sm:p-6'
                : 'w-[40%] h-full border-l border-slate-100 p-6 sm:p-10'
                }`}>
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                  <div className="h-1 sm:h-1.5 w-8 sm:w-12 bg-red-600 rounded-full"></div>
                  <span className="text-red-600 font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[10px] sm:text-xs">
                    Destaque Empresarial
                  </span>
                </div>

                <h2 className={`font-black text-slate-900 leading-tight uppercase tracking-tighter mb-2 sm:mb-4 break-words ${isVertical ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl lg:text-5xl'
                  }`}>
                  {currentBanner.companyName}
                </h2>

                <p className={`text-slate-500 font-medium leading-relaxed italic border-l-4 border-slate-100 pl-3 sm:pl-6 line-clamp-2 sm:line-clamp-3 ${isVertical ? 'text-sm sm:text-base' : 'text-lg sm:text-xl lg:text-2xl'
                  }`}>
                  {currentBanner.description}
                </p>
              </div>
            </>
          )}
        </section>

        {/* GRADE DE CLASSIFICADOS */}
        <section className={`flex-1 grid overflow-hidden ${isVertical
          ? 'grid-cols-1 gap-3 sm:gap-4'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6'
          }`}>
          {currentClassifiedsSlice.map((ad, idx) => (
            <div
              key={ad.id + classifiedIndex}
              className={`flex bg-white overflow-hidden border border-slate-200 shadow-lg animate-in fade-in slide-in-from-bottom-4 ${isVertical ? 'rounded-2xl sm:rounded-3xl' : 'rounded-2xl sm:rounded-3xl'
                }`}
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="w-[40%] relative bg-slate-100">
                <img src={ad.imageUrl} className="w-full h-full object-cover" alt={ad.title} />
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-red-600 text-white text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md uppercase">
                  {ad.category}
                </div>
              </div>

              <div className={`flex-1 flex flex-col justify-between ${isVertical ? 'p-3 sm:p-4' : 'p-3 sm:p-4'
                }`}>
                <div>
                  <h3 className={`font-bold text-slate-900 line-clamp-2 leading-tight mb-1 sm:mb-1.5 uppercase tracking-tight ${isVertical ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
                    }`}>
                    {ad.title}
                  </h3>
                  <div className="flex items-center text-slate-500 text-[10px] sm:text-xs font-bold uppercase">
                    <i className="fas fa-map-marker-alt text-red-600 mr-1"></i>
                    {ad.location}
                  </div>
                </div>

                <div className="mt-1 sm:mt-2">
                  <div className={`text-emerald-600 font-black tracking-tighter ${isVertical ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'
                    }`}>
                    {ad.price}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      <NewsTicker />
    </div>
  );
};

export default App;
