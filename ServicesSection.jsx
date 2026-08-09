import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { servicesData } from './servicesData';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function Section2About() {
  return (
    <section id="sobre" className="relative z-10 min-h-screen py-32 px-6 overflow-hidden bg-gradient-to-b from-cyber-black via-cyber-dark to-cyber-black shadow-[0_-30px_60px_rgba(0,0,0,0.9)] flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-16">
          <div className="hud-text text-xs text-cyber-emerald mb-2">// 02. HISTÓRIA & ENGENHARIA</div>
          <h2 class="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            SOBRE A <span class="text-gradient-emerald">A3 ESTÉTICA</span>
          </h2>
        </div>

        {/* Grid de 2 Colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Coluna Esquerda: Imagem Lamborghini */}
          <div id="aboutCar3D" className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-cyber-emerald/20 to-cyber-cyan/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="relative glass-panel rounded-2xl p-4 overflow-hidden border border-cyber-emerald/30">
              <img src="portfolio_1.png" alt="Lamborghini SVJ A3 Estética" className="w-full h-80 sm:h-96 object-cover rounded-xl shadow-2xl" />
              
              <div className="absolute bottom-6 left-6 right-6 glass-panel rounded-xl p-4 flex items-center justify-between font-mono text-xs border border-cyber-emerald/40">
                <div>
                  <div className="text-cyber-emerald font-bold">LAMBORGHINI AVENTADOR SVJ</div>
                  <div className="text-gray-400 text-[10px]">CERAMIC COATING 9H PRO</div>
                </div>
                <div className="text-right">
                  <div className="text-cyber-cyan font-bold">100% REFLEXÃO</div>
                  <div className="text-gray-400 text-[10px]">STATUS: PROTEGIDO</div>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Direita: História & Status */}
          <div id="aboutStoryCard" className="glass-panel rounded-2xl p-8 sm:p-10 relative">
            <div className="hud-text text-xs text-cyber-cyan mb-3">[ ESPECIFICAÇÃO DE ELITE ]</div>
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-6 text-white leading-tight">
              PERFEIÇÃO E PAIXÃO POR <span className="text-cyber-emerald">SUPERCARROS</span>
            </h3>
            
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 font-light">
              Há mais de uma década, a <strong className="text-white">A3 Estética</strong> redefiniu o conceito de detalhamento automotivo de luxo no Brasil. Especializados na preparação, proteção de pintura (PPF) e restauração estética de modelos exóticos como Lamborghini, Ferrari, Porsche e McLaren.
            </p>

            <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8 font-light">
              Utilizamos apenas tecnologia de nano-cerâmica de nível aeroespacial, ambiente climatizado com luzes cirúrgicas de análise e equipe altamente certificada internacionalmente.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 font-mono">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-cyber-emerald">10+</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Anos de Mercado</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-cyber-cyan">3.5k+</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Carros Atendidos</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-cyber-emerald">100%</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Satisfação VIP</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Section3ServicesScroll() {
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);
  const leftCardsRef = useRef([]);
  const rightCardsRef = useRef([]);
  const textGroupsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          pin: contentRef.current,
          start: 'top top',
          end: () => `+=${servicesData.length * 100}%`,
          pinSpacing: true,
          scrub: 1,
          invalidateOnRefresh: true
        }
      });

      for (let i = 1; i < servicesData.length; i++) {
        const stepLabel = `step${i}`;
        tl.to({}, { duration: 0.5 });
        tl.addLabel(stepLabel);

        const prevText = textGroupsRef.current[i - 1];
        if (prevText) {
          tl.to(prevText, { y: -50, opacity: 0, duration: 1, ease: 'power2.inOut' }, stepLabel);
        }

        const leftCard = leftCardsRef.current[i];
        const rightCard = rightCardsRef.current[i];

        if (leftCard) {
          tl.fromTo(leftCard, { opacity: 0, scale: 0.9, rotation: -20 }, { opacity: 1, scale: 1, rotation: -12, duration: 1, ease: 'power2.out' }, stepLabel);
        }
        if (rightCard) {
          tl.fromTo(rightCard, { opacity: 0, scale: 0.9, rotation: 20 }, { opacity: 1, scale: 1, rotation: 12, duration: 1, ease: 'power2.out' }, stepLabel);
        }

        const currText = textGroupsRef.current[i];
        if (currText) {
          tl.fromTo(currText, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }, stepLabel);
        }
      }

      tl.to({}, { duration: 1.0 });

      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="sec3-wrapper" ref={wrapperRef} className="relative w-full block bg-[#0a0a0a] z-20">
      <div ref={contentRef} className="relative w-full h-screen overflow-hidden flex items-center justify-center select-none">
        <div className="absolute inset-0 pointer-events-none hidden lg:block overflow-hidden">
          {servicesData.map((item, index) => (
            <React.Fragment key={`cards-${item.id}`}>
              <div
                ref={(el) => (leftCardsRef.current[index] = el)}
                style={{ zIndex: 20 + index }}
                className={`absolute left-[4%] xl:left-[8%] top-1/2 -translate-y-1/2 w-[270px] xl:w-[310px] h-[500px] xl:h-[560px] rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl shadow-black/90 bg-[#121316] ${
                  index === 0 ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img src={item.leftImg} alt={`${item.title} - Preview 1`} className="w-full h-full object-cover" />
              </div>

              <div
                ref={(el) => (rightCardsRef.current[index] = el)}
                style={{ zIndex: 20 + index }}
                className={`absolute right-[4%] xl:right-[8%] top-1/2 -translate-y-1/2 w-[270px] xl:w-[310px] h-[500px] xl:h-[560px] rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl shadow-black/90 bg-[#121316] ${
                  index === 0 ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img src={item.rightImg} alt={`${item.title} - Preview 2`} className="w-full h-full object-cover" />
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="relative z-50 w-full max-w-xl mx-auto px-6 h-full flex items-center justify-center pointer-events-none">
          {servicesData.map((item, index) => (
            <div
              key={`text-${item.id}`}
              ref={(el) => (textGroupsRef.current[index] = el)}
              className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 ${
                index === 0 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
                <span className="w-2 h-2 rounded-full bg-[#FF7A00] animate-pulse" />
                <span className="font-mono text-xs text-white/90 uppercase tracking-widest font-semibold">
                  SERVIÇO // {item.num}
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
                {item.title}
              </h2>

              <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-lg mb-8 font-light">
                {item.desc}
              </p>

              <button className="inline-flex items-center gap-4 px-7 py-3.5 rounded-full font-medium text-sm sm:text-base text-white bg-gradient-to-r from-[#FF7A00] to-[#E54D00] shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 transition-all duration-300 pointer-events-auto cursor-pointer">
                <span>{item.cta}</span>
                <span className="w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white text-xs font-bold">
                  ↗
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ServicesSection() {
  return (
    <>
      <Section2About />
      <Section3ServicesScroll />
    </>
  );
}
