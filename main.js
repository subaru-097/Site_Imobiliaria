/* ==========================================================================
   A3 ESTÉTICA AUTOMOTIVA - MAIN JAVASCRIPT LOGIC
   - Lenis Smooth Scroll Integration with GSAP Ticker
   - Apple-style WebP Canvas Frame Scrubbing (Cover Aspect Ratio)
   - Preload Progress Bar & Loader Feedback
   - Complete 4-Folder Frame Sequence (video_frames1, video_frames2, video_frames3, video_frames4)
   - Extended GSAP ScrollTrigger Pinning for Full Sequence Scrubbing
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Verificação de segurança para certificar que GSAP e ScrollTrigger estão carregados
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.error('GSAP ou ScrollTrigger não foram carregados corretamente.');
    return;
  }

  // Registrar o plugin ScrollTrigger no GSAP
  gsap.registerPlugin(ScrollTrigger);

  // --------------------------------------------------------------------------
  // 1. INICIALIZAÇÃO DO LENIS (SMOOTH SCROLL) E SINCRONIZAÇÃO COM GSAP
  // --------------------------------------------------------------------------
  let lenis = null;

  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5
    });

    // Atualiza os triggers do ScrollTrigger sempre que o Lenis rolar a página
    lenis.on('scroll', ScrollTrigger.update);

    // Conecta o loop de animação do Lenis ao ticker do GSAP para evitar tremedeira (jitter)
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Desativa o lagSmoothing do GSAP para manter sincronia perfeita
    gsap.ticker.lagSmoothing(0);
  }

  /**
   * Helper para carregar uma imagem tentando múltiplos caminhos candidatos (fallback robusto)
   */
  const loadImageWithFallback = (candidateUrls, onSuccess, onError) => {
    let index = 0;
    const tryNext = () => {
      if (index >= candidateUrls.length) {
        if (onError) onError();
        return;
      }
      const img = new Image();
      const url = candidateUrls[index++];
      img.onload = () => onSuccess(img, url);
      img.onerror = () => tryNext();
      img.src = url;
    };
    tryNext();
  };

  /**
   * Função para desenhar uma imagem no Canvas mantendo a proporção 'object-fit: cover'
   */
  function drawCoverImage(ctx, canvas, img) {
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const imgWidth = img.naturalWidth || 1920;
    const imgHeight = img.naturalHeight || 1080;
    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = canvas.width / canvas.height;

    let renderWidth, renderHeight, x, y;

    // Cálculo do aspecto Cover
    if (canvasRatio > imgRatio) {
      renderWidth = canvas.width;
      renderHeight = canvas.width / imgRatio;
      x = 0;
      y = (canvas.height - renderHeight) / 2;
    } else {
      renderWidth = canvas.height * imgRatio;
      renderHeight = canvas.height;
      x = (canvas.width - renderWidth) / 2;
      y = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y, renderWidth, renderHeight);
  }

  // --------------------------------------------------------------------------
  // 2. HERO SECTION: SEQUÊNCIA COMPLETA (video_frames1, video_frames2, video_frames3 & video_frames4)
  // --------------------------------------------------------------------------
  const heroCanvas = document.getElementById('heroCanvas');
  const heroSection = document.getElementById('hero');
  const loader = document.getElementById('canvasLoader');
  const loaderBar = document.getElementById('loaderBar');
  const loaderPercent = document.getElementById('loaderPercent');

  if (heroCanvas && heroSection) {
    const ctx = heroCanvas.getContext('2d');
    const frameCandidatesList = [];

    // 1ª Parte: video_frames1 (91 frames)
    for (let i = 1; i <= 91; i++) {
      const pad = String(i).padStart(4, '0');
      frameCandidatesList.push([
        `video_frames1/frames/frame4_${pad}.webp`,
        `video_frames1/frame4_${pad}.webp`,
        `video_frames1/frames/frame_${pad}.webp`,
        `video_frames1/frames/frame1_${pad}.webp`,
        `frames1/frames/frame_${pad}.webp`,
        `video_frames1/${i}.webp`
      ]);
    }

    // 2ª Parte: video_frames2 (91 frames)
    for (let i = 1; i <= 91; i++) {
      const pad = String(i).padStart(4, '0');
      frameCandidatesList.push([
        `video_frames2/frames/frame4_${pad}.webp`,
        `video_frames2/frame4_${pad}.webp`,
        `video_frames2/frames/frame_${pad}.webp`,
        `video_frames2/frames/frame2_${pad}.webp`,
        `frames2/frames/frame_${pad}.webp`,
        `video_frames2/${i}.webp`
      ]);
    }

    // 3ª Parte: video_frames3 (93 frames)
    for (let i = 1; i <= 93; i++) {
      const pad = String(i).padStart(4, '0');
      frameCandidatesList.push([
        `video_frames3/frames/frame4_${pad}.webp`,
        `video_frames3/frame4_${pad}.webp`,
        `video_frames3/frames/frame3_${pad}.webp`,
        `video_frames3/${i}.webp`
      ]);
    }

    // 4ª Parte: video_frames4 (28 frames - FINAL DA SEQUÊNCIA COMPLETA)
    for (let i = 1; i <= 28; i++) {
      const pad = String(i).padStart(4, '0');
      frameCandidatesList.push([
        `video_frames4/frames/frame4_${pad}.webp`,
        `video_frames4/frame4_${pad}.webp`,
        `video_frames4/frames/frame4_${pad}.webp`,
        `video_frames4/${i}.webp`
      ]);
    }

    const totalFrames = frameCandidatesList.length; // 303 frames totais (91 + 91 + 93 + 28)
    const images = new Array(totalFrames);
    let loadedCount = 0;
    const playhead = { frame: 0 };

    // Redimensiona o canvas para acompanhar a janela mantendo o aspecto 'cover'
    const resizeCanvas = () => {
      heroCanvas.width = window.innerWidth;
      heroCanvas.height = window.innerHeight;
      drawCurrentFrame();
    };

    function drawCurrentFrame() {
      const index = Math.min(totalFrames - 1, Math.max(0, Math.floor(playhead.frame)));
      if (images[index]) {
        drawCoverImage(ctx, heroCanvas, images[index]);
      }
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let isAnimationCreated = false;

    // Inicializa a animação no GSAP com ScrollTrigger & Pinning expandido para os 303 frames
    function initHeroScrollAnimation() {
      if (isAnimationCreated) return;
      isAnimationCreated = true;

      // Animação de ocultar o Loader ao concluir 100%
      if (loader) {
        gsap.to(loader, {
          opacity: 0,
          scale: 0.9,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => {
            loader.style.display = 'none';
          }
        });
      }

      drawCurrentFrame();

      // Timeline GSAP: "Pina" a seção Hero e estende a distância de scroll até o final do video_frames4
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroSection,
          start: "top top",
          end: "+=3400", // Distância estendida para garantir o scrubbing completo de todos os 303 frames
          pin: true,
          scrub: 0.05, // Scrub fluido e responsivo ao movimento da roda do mouse
          anticipatePin: 1,
          onUpdate: () => drawCurrentFrame()
        }
      });

      // 1. Troca progressiva até o último frame da video_frames4
      heroTl.to(playhead, {
        frame: totalFrames - 1,
        snap: "frame",
        ease: "none"
      }, 0);

      // 2. Parallax de Escala e Deslocamento Sutil no Canvas durante o scroll
      heroTl.fromTo(heroCanvas,
        { scale: 1, yPercent: 0 },
        { scale: 1.06, yPercent: -3, ease: "none" },
        0
      );

      ScrollTrigger.refresh();
    }

    // Preload de todas as imagens das 4 pastas com atualização do Loader
    frameCandidatesList.forEach((candidates, index) => {
      loadImageWithFallback(
        candidates,
        (img) => {
          images[index] = img;
          loadedCount++;

          const percent = Math.round((loadedCount / totalFrames) * 100);
          if (loaderBar) loaderBar.style.width = percent + '%';
          if (loaderPercent) loaderPercent.innerText = percent + '%';

          if (index === 0) drawCurrentFrame();
          if (loadedCount >= totalFrames) initHeroScrollAnimation();
        },
        () => {
          loadedCount++;
          const percent = Math.round((loadedCount / totalFrames) * 100);
          if (loaderBar) loaderBar.style.width = percent + '%';
          if (loaderPercent) loaderPercent.innerText = percent + '%';

          if (loadedCount >= totalFrames) initHeroScrollAnimation();
        }
      );
    });
  }

  // --------------------------------------------------------------------------
  // 3. SEÇÃO AGENDAMENTO VIP: REVELAÇÃO SUAVE ESTÁTICA NO SCROLL
  // --------------------------------------------------------------------------
  const vipCard = document.getElementById('vipScrollCard');
  if (vipCard) {
    gsap.from(vipCard, {
      scrollTrigger: {
        trigger: "#animationSection2",
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      y: 40,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out"
    });
  }

  // --------------------------------------------------------------------------
  // 4. REVELAÇÕES GSAP NAS DEMAIS SEÇÕES (Sobre, App, Serviços)
  // --------------------------------------------------------------------------
  const aboutCar = document.getElementById('aboutCar3D');
  const aboutStory = document.getElementById('aboutStoryCard');

  if (aboutCar) {
    gsap.from(aboutCar, {
      scrollTrigger: {
        trigger: "#sobre",
        start: "top 75%",
        toggleActions: "play none none reverse"
      },
      y: 50,
      opacity: 0,
      duration: 1.4,
      ease: "power3.out"
    });
  }

  // Controle de reprodução do vídeo BMW no scroll
  const bmwVideo = document.getElementById('bmwVideoElement');
  if (bmwVideo) {
    const videoObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          bmwVideo.play().catch(err => console.log('Autoplay prevented:', err));
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    videoObserver.observe(bmwVideo);
  }

  if (aboutStory) {
    gsap.from(aboutStory, {
      scrollTrigger: {
        trigger: "#sobre",
        start: "top 70%",
        toggleActions: "play none none reverse"
      },
      y: 40,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out"
    });

    const cardObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    cardObserver.observe(aboutStory);
  }

  // Revelação Seção App
  const appContent = document.getElementById('appTextContent');
  const app3D = document.getElementById('appSpline3D');

  if (appContent) {
    gsap.from(appContent.children, {
      scrollTrigger: {
        trigger: "#appSection",
        start: "top 75%",
        toggleActions: "play none none reverse"
      },
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out"
    });
  }

  if (app3D) {
    gsap.from(app3D, {
      scrollTrigger: {
        trigger: "#appSection",
        start: "top 75%",
        toggleActions: "play none none reverse"
      },
      scale: 0.9,
      opacity: 0,
      duration: 1.2,
      ease: "power2.out"
    });
  }

  // Revelação Seção Serviços
  const minimalServiceCards = document.querySelectorAll('.service-minimal-card');
  if (minimalServiceCards.length > 0) {
    gsap.from(minimalServiceCards, {
      scrollTrigger: {
        trigger: "#servicos",
        start: "top 75%",
        toggleActions: "play none none reverse"
      },
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.12,
      ease: "power3.out"
    });
  }

  // --------------------------------------------------------------------------
  // 5. NAVEGAÇÃO SUAVE PARA LINKS INTERNOS INTEGRADA AO LENIS
  // --------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        if (lenis) {
          lenis.scrollTo(targetEl, { offset: 0, duration: 1.2 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // --------------------------------------------------------------------------
  // 6. INTERATIVIDADE DA SEÇÃO 2: NAVEGAÇÃO DE VÍDEOS (TAKE A CLOSER LOOK)
  // --------------------------------------------------------------------------
  const closerLookSection = document.getElementById('nova-secao');
  
  if (closerLookSection) {
    const videoElement = document.getElementById('closerLookVideo');
    const videoTitleElement = document.getElementById('closerLookVideoTitle');
    const buttons = closerLookSection.querySelectorAll('.closer-look-btn');
    
    // Mapeamento de botões para arquivos MP4 correspondentes
    const videoMapping = {
      'Casas': 'casas.mp4',
      'Casas em condomínios': 'casas-em-condominios.mp4',
      'Apartamentos': 'Apartamentos.mp4',
      'Chácaras': 'chácaras.mp4',
      'Barracões comerciais': 'barracões-comerciais.mp4'
    };

    // Trava de estado e timer para debounce de segurança contra travamentos de memória
    let isSwitching = false;
    let debounceTimer = null;

    const floatingPortfolioBtn = document.getElementById('btnFloatingPortfolio');

    /**
     * Função com gerenciamento estrito de memória para alternar vídeos HTML5
     */
    function changeVideoSource(newSrc, categoryTitle, clickedBtn) {
      if (!videoElement || isSwitching) return;

      // Bloquear cliques múltiplos concorrentes
      isSwitching = true;

      // Ocultar imediatamente o botão flutuante de portfólio ao trocar o vídeo
      if (floatingPortfolioBtn) {
        floatingPortfolioBtn.classList.remove('show-portfolio');
      }

      // 1. Atualizar estados de destaque dos botões pílula (Inverso: Ativo escuro #1C1C1E, Inativo branco #FFFFFF)
      buttons.forEach(btn => {
        btn.classList.remove('active');
        btn.classList.remove('bg-[#1C1C1E]', 'bg-[#1D1D1F]', 'bg-[#232323]', 'text-white', 'shadow-md');
        btn.classList.add('bg-white', 'text-[#1D1D1F]');
      });

      // Aplicar estilos ativos ao botão clicado
      clickedBtn.classList.add('active');
      clickedBtn.classList.remove('bg-white', 'text-[#1D1D1F]');
      clickedBtn.classList.add('bg-[#1C1C1E]', 'text-white', 'shadow-md');

      // Atualizar o título em overlay no container do vídeo
      if (videoTitleElement && categoryTitle) {
        videoTitleElement.textContent = categoryTitle.toUpperCase();
      }

      // 2. Gerenciamento estrito de memória do elemento <video>
      try {
        // Pausar o vídeo atual
        videoElement.pause();
        
        // Remover atributo src e limpar nós <source> filhos para descarregar o stream da RAM
        videoElement.removeAttribute('src');
        while (videoElement.firstChild) {
          videoElement.removeChild(videoElement.firstChild);
        }

        // Forçar load() para efetivar o garbage collection do buffer de vídeo no browser
        videoElement.load();

        // Injetar o novo caminho de vídeo
        videoElement.src = newSrc;
        videoElement.loop = false; // Garantia estrita de que o vídeo NÃO ficará em loop
        videoElement.load();

        // Iniciar reprodução com tratamento de erro da Autoplay Policy do browser
        const playPromise = videoElement.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log('Aviso de reprodução de vídeo:', error);
          });
        }
      } catch (err) {
        console.error('Erro durante a troca de vídeo:', err);
      }

      // 3. Liberação da trava após cooldown de 500ms (Debounce de proteção)
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        isSwitching = false;
      }, 500);
    }

    // --------------------------------------------------------------------------
    // RELEVO DO BOTÃO FLUTUANTE "VER PORTFÓLIO" NOS ÚLTIMOS 2 SEGUNDOS DE VÍDEO
    // --------------------------------------------------------------------------
    if (videoElement && floatingPortfolioBtn) {
      videoElement.addEventListener('timeupdate', () => {
        if (videoElement.duration && (videoElement.duration - videoElement.currentTime <= 2)) {
          floatingPortfolioBtn.classList.add('show-portfolio');
        }
      });
    }

    // --------------------------------------------------------------------------
    // ANIMAÇÃO DE REVELAÇÃO FLUIDA DE TEXTO (GSAP TEXT REVEAL FADE ESTILO SESSÃO 4)
    // --------------------------------------------------------------------------
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.fromTo('.section-title-reveal', 
        { opacity: 0, y: 35 }, 
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.2, 
          ease: 'power3.out', 
          scrollTrigger: {
            trigger: '#nova-secao',
            start: 'top 75%'
          }
        }
      );

      gsap.fromTo('.section-desc-reveal', 
        { opacity: 0, y: 25 }, 
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.0, 
          delay: 0.15,
          ease: 'power3.out', 
          scrollTrigger: {
            trigger: '#nova-secao',
            start: 'top 75%'
          }
        }
      );

      gsap.fromTo('.left-column-kicker-slot', 
        { opacity: 0, y: 20 }, 
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.9, 
          delay: 0.25,
          ease: 'power3.out', 
          scrollTrigger: {
            trigger: '#nova-secao',
            start: 'top 75%'
          }
        }
      );
    }

    // --------------------------------------------------------------------------
    // REPRODUÇÃO INICIAL VIA GSAP SCROLLTRIGGER (EXECUTA APENAS UMA VEZ)
    // --------------------------------------------------------------------------
    if (videoElement && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: closerLookSection,
        start: "top 60%",
        once: true,
        onEnter: () => {
          const playPromise = videoElement.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.log('Autoplay do vídeo inicial bloqueado ou aguardando suporte:', error);
            });
          }
        }
      });
    }

    // Registrar manipuladores de evento em cada botão da lista
    buttons.forEach(button => {
      button.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Extração limpa do texto do botão (removendo números, + e o símbolo ↗)
        const textContent = this.innerText.replace(/\d+/g, '').replace('+', '').replace('↗', '').trim();
        
        // Identificar o caminho do vídeo correspondente
        const videoSrc = this.getAttribute('data-video') || videoMapping[textContent];

        if (videoSrc) {
          changeVideoSource(videoSrc, textContent, this);
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // SEÇÃO 3: LÓGICA DE VÍDEO, INTERSECTION OBSERVER & REPLAY 720°
  // --------------------------------------------------------------------------
  const sec3Container = document.getElementById('aboutCar3D');
  const sec3Video = document.getElementById('section3Video');
  const sec3ReplayBtn = document.getElementById('btnSection3Replay');

  if (sec3Container && sec3Video) {
    // 1. SCROLL AUTO-PLAY VIA INTERSECTION OBSERVER (isIntersecting -> video.play())
    const sec3Observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && sec3Video.src && sec3Video.paused) {
          sec3Video.play().catch(e => console.log('Autoplay Seção 3 aguardando interação ou fonte:', e));
        }
      });
    }, { threshold: 0.4 });

    sec3Observer.observe(sec3Container);

    // 2. LÓGICA DE TEMPO (onTimeUpdate: faltam <= 2s para acabar -> showReplay = true)
    sec3Video.addEventListener('timeupdate', () => {
      if (sec3Video.duration && (sec3Video.duration - sec3Video.currentTime <= 2)) {
        if (sec3ReplayBtn && !sec3ReplayBtn.classList.contains('active-replay')) {
          sec3ReplayBtn.classList.remove('hidden');
          sec3ReplayBtn.classList.add('active-replay');
        }
      }
    });

    // 3. BOTÃO DE RESTART (onClick: currentTime = 0, play(), hide replay)
    if (sec3ReplayBtn) {
      sec3ReplayBtn.addEventListener('click', () => {
        sec3Video.currentTime = 0;
        sec3Video.play();
        sec3ReplayBtn.classList.remove('active-replay');
        sec3ReplayBtn.classList.add('hidden');
      });
    }
  }
});


