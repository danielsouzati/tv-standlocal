
import { GoogleGenAI } from "@google/genai";
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

  // Detecção Automática de Orientação
  useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-white cursor-none">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-bold text-slate-400 uppercase tracking-widest text-sm">Sincronizando StandLocal...</p>
      </div>
    );
  }

  const currentClassifiedsSlice = classifieds.slice(classifiedIndex * 3, (classifiedIndex * 3) + 3);
  const currentBanner = banners[bannerIndex] || banners[0];

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden select-none bg-[#f1f5f9] cursor-none">
      <Header />

      <main className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">

        {/* BANNER PRINCIPAL - LAYOUT SPLIT (LADO A LADO) */}
        <section className={`relative rounded-[2.5rem] overflow-hidden border border-slate-200 bg-white shadow-2xl transition-all duration-700 flex ${isVertical ? 'flex-col h-[55%]' : 'flex-row h-[65%]'}`}>

          {currentBanner && (
            <>
              {/* LADO ESQUERDO: A IMAGEM */}
              <div className={`relative flex items-center justify-center bg-slate-50 ${isVertical ? 'w-full h-3/5' : 'w-[60%] h-full'}`}>
                <div
                  className="absolute inset-0 opacity-5 blur-xl bg-center bg-cover"
                  style={{ backgroundImage: `url(${currentBanner.imageUrl})` }}
                />

                <img
                  key={currentBanner.id}
                  src={currentBanner.imageUrl}
                  alt={currentBanner.companyName}
                  className="relative z-10 max-w-full max-h-full object-contain p-8 animate-in fade-in zoom-in duration-700"
                />
              </div>

              {/* LADO DIREITO: INFORMAÇÕES */}
              <div className={`flex flex-col justify-center p-10 bg-white ${isVertical ? 'w-full h-2/5' : 'w-[40%] h-full border-l border-slate-100'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-1.5 w-12 bg-red-600 rounded-full"></div>
                  <span className="text-red-600 font-black uppercase tracking-[0.2em] text-xs">Destaque Empresarial</span>
                </div>

                <h2 className="text-5xl font-black text-slate-900 leading-tight uppercase tracking-tighter mb-4 break-words">
                  {currentBanner.companyName}
                </h2>

                <p className="text-2xl text-slate-500 font-medium leading-relaxed italic border-l-4 border-slate-100 pl-6 line-clamp-3">
                  {currentBanner.description}
                </p>
              </div>
            </>
          )}
        </section>

        {/* GRADE DE CLASSIFICADOS */}
        <section className={`flex-1 grid gap-6 overflow-hidden ${isVertical ? 'grid-cols-1' : 'grid-cols-3'}`}>
          {currentClassifiedsSlice.map((ad, idx) => (
            <div
              key={ad.id + classifiedIndex}
              className="flex bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="w-[40%] relative bg-slate-100">
                <img src={ad.imageUrl} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase">
                  {ad.category}
                </div>
              </div>

              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 line-clamp-2 leading-tight mb-1.5 uppercase tracking-tight">
                    {ad.title}
                  </h3>
                  <div className="flex items-center text-slate-500 text-xs font-bold uppercase">
                    <i className="fas fa-map-marker-alt text-red-600 mr-1"></i>
                    {ad.location}
                  </div>
                </div>

                <div className="mt-2">
                  <div className="text-emerald-600 text-3xl font-black tracking-tighter">
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
