/* ==========================================================================
   SMART PARKING / ESTACIONAMENTO PREMIUM - MAIN JAVASCRIPT LOGIC
   - Native Browser Scroll
   - Background Video Initialization
   - Interactive Media & Navigation Handlers
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 0. PRELOADER SPLIT SCREEN - ANIMAÇÃO DE LETRAS SEQUENCIAIS (EDOLUS)
  // --------------------------------------------------------------------------
  const preloader = document.getElementById('preloader');
  const preloaderTop = document.getElementById('preloaderTop');
  const preloaderBottom = document.getElementById('preloaderBottom');
  const preloaderContent = document.getElementById('preloaderContent');
  const preloaderPercent = document.getElementById('preloaderPercent');
  const letters = document.querySelectorAll('.preloader-letter');

  if (preloader && letters.length > 0 && preloaderPercent) {
    // Bloquear a rolagem enquanto o preloader estiver ativo
    document.body.style.overflow = 'hidden';

    let count = 0;
    const duration = 2000; // Duração total da contagem (2s)
    const totalLetters = letters.length; // 6 letras ("E", "D", "O", "L", "U", "S")
    const stepDuration = duration / 100;

    // Revelar a primeira letra ("E") imediatamente no início
    if (letters[0]) {
      letters[0].classList.add('reveal');
    }

    const interval = setInterval(() => {
      count++;
      if (count > 100) count = 100;

      // 1. Atualizar porcentagem numérica
      preloaderPercent.textContent = `${count}%`;

      // 2. Animação Sequencial: cada letra sai de trás da anterior à medida que a % progride
      const letterIndexToReveal = Math.floor((count / 100) * totalLetters);
      for (let i = 0; i < totalLetters; i++) {
        if (i <= letterIndexToReveal && letters[i]) {
          letters[i].classList.add('reveal');
        }
      }

      if (count >= 100) {
        clearInterval(interval);
        
        // Garantir todas as letras reveladas e contador em 100%
        letters.forEach(letter => letter.classList.add('reveal'));
        preloaderPercent.textContent = '100%';

        // 3. Pausa de 600ms exatamente após a última letra chegar na posição e bater 100%
        setTimeout(() => {
          // Fade Out do texto EDOLUS e porcentagem
          if (preloaderContent) {
            preloaderContent.classList.add('preloader-content-hide');
          }

          // 4. Animação de Saída Split Screen (Cortinas) após o fadeout do texto (400ms)
          setTimeout(() => {
            if (preloaderTop) preloaderTop.classList.add('preloader-slide-up');
            if (preloaderBottom) preloaderBottom.classList.add('preloader-slide-down');

            // Liberar a rolagem da página nativa
            document.body.style.overflow = '';

            // Remover o preloader do DOM após a conclusão da animação das cortinas (1800ms / 1.8s)
            setTimeout(() => {
              preloader.style.display = 'none';
              if (preloader.parentNode) {
                preloader.parentNode.removeChild(preloader);
              }
            }, 1800);

          }, 400);

        }, 600);
      }
    }, stepDuration);
  }

  // --------------------------------------------------------------------------
  // 1. VÍDEO DE FUNDO DA SEÇÃO HERO (AUTOPLAY SAFETY)
  // --------------------------------------------------------------------------
  const heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log('Autoplay do vídeo da Hero aguardando interação do usuário:', error);
      });
    }
  }

  // --------------------------------------------------------------------------
  // 2. NAVEGAÇÃO SUAVE NATIVA PARA LINKS INTERNOS (#)
  // --------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --------------------------------------------------------------------------
  // 3. INTERATIVIDADE DA SEÇÃO 2: NAVEGAÇÃO DE VÍDEOS DE CATEGORIAS
  // --------------------------------------------------------------------------
  const closerLookSection = document.getElementById('nova-secao');
  
  if (closerLookSection) {
    const videoElement = document.getElementById('closerLookVideo');
    const videoTitleElement = document.getElementById('closerLookVideoTitle');
    const buttons = closerLookSection.querySelectorAll('.closer-look-btn');
    const floatingPortfolioBtn = document.getElementById('btnFloatingPortfolio');
    
    const videoMapping = {
      'Audi': 'audi.mp4',
      'BMW': 'bmw.mp4',
      'Lamborghini': 'lamborghini.mp4',
      'Mercedes': 'mercedes.mp4',
      'Porsche': 'porshce.mp4'
    };

    let isSwitching = false;
    let debounceTimer = null;

    function changeVideoSource(newSrc, categoryTitle, clickedBtn) {
      if (!videoElement || isSwitching) return;
      isSwitching = true;

      if (floatingPortfolioBtn) {
        floatingPortfolioBtn.classList.remove('show-portfolio');
        const textSpan = floatingPortfolioBtn.querySelector('#btnFloatingPortfolioText');
        if (textSpan) {
          textSpan.textContent = `Ver Estoque ${categoryTitle}`;
        } else {
          floatingPortfolioBtn.innerHTML = `<span id="btnFloatingPortfolioText">Ver Estoque ${categoryTitle}</span> <i class="fa-solid fa-arrow-right text-[10px]"></i>`;
        }
        floatingPortfolioBtn.setAttribute('href', `#portfolio?marca=${encodeURIComponent(categoryTitle)}`);
      }

      buttons.forEach(btn => {
        btn.classList.remove('active');
      });

      clickedBtn.classList.add('active');

      if (videoTitleElement && categoryTitle) {
        videoTitleElement.textContent = categoryTitle.toUpperCase();
      }

      try {
        videoElement.pause();
        videoElement.removeAttribute('src');
        while (videoElement.firstChild) {
          videoElement.removeChild(videoElement.firstChild);
        }
        videoElement.load();

        videoElement.src = newSrc;
        videoElement.loop = false;
        videoElement.load();

        const playPromise = videoElement.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log('Aviso de reprodução de vídeo:', error);
          });
        }
      } catch (err) {
        console.error('Erro durante a troca de vídeo:', err);
      }

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        isSwitching = false;
      }, 500);
    }

    if (videoElement && floatingPortfolioBtn) {
      videoElement.addEventListener('timeupdate', () => {
        if (videoElement.duration && (videoElement.duration - videoElement.currentTime <= 2)) {
          floatingPortfolioBtn.classList.add('show-portfolio');
        }
      });
    }

    // --------------------------------------------------------------------------
    // INTERSECTION OBSERVER: PAUSAR AO SAIR E REINICIAR DO ZERO AO ENTRAR NA TELA
    // --------------------------------------------------------------------------
    if (videoElement) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Scroll In: Redefinir vídeo ativo para o início (0s) e dar play
            if (floatingPortfolioBtn) {
              floatingPortfolioBtn.classList.remove('show-portfolio');
            }
            try {
              videoElement.currentTime = 0;
              const playPromise = videoElement.play();
              if (playPromise !== undefined) {
                playPromise.catch(error => {
                  console.log('Autoplay do vídeo da Seção 2 aguardando interação:', error);
                });
              }
            } catch (err) {
              console.error('Erro ao reiniciar vídeo da Seção 2:', err);
            }
          } else {
            // Scroll Out: Pausar vídeo ativo quando a seção sai do campo de visão
            try {
              videoElement.pause();
            } catch (err) {
              console.error('Erro ao pausar vídeo da Seção 2:', err);
            }
          }
        });
      }, {
        threshold: 0.2 // Executa quando 20% da Seção 2 estiver visível
      });

      observer.observe(closerLookSection);
    }

    buttons.forEach(button => {
      button.addEventListener('click', function (e) {
        e.preventDefault();
        const textContent = this.innerText.replace(/\d+/g, '').replace('+', '').replace('↗', '').trim();
        const videoSrc = this.getAttribute('data-video') || videoMapping[textContent];

        if (videoSrc) {
          changeVideoSource(videoSrc, textContent, this);
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4. SEÇÃO 3: LÓGICA DE REPLAY & INTERSECTION OBSERVER ("prosche-seção3.mp4")
  // --------------------------------------------------------------------------
  const sec3Video = document.getElementById('section3Video');
  const sec3Section = document.getElementById('sobre');
  const sec3ReplayBtn = document.getElementById('btnSec3Replay');

  if (sec3Video) {
    // 1. timeupdate: Exibir o botão de replay faltando exatamente 2 segundos para o vídeo acabar
    sec3Video.addEventListener('timeupdate', () => {
      if (sec3Video.duration && (sec3Video.duration - sec3Video.currentTime <= 2)) {
        if (sec3ReplayBtn && !sec3ReplayBtn.classList.contains('show-replay')) {
          sec3ReplayBtn.classList.add('show-replay');
        }
      }
    });

    // 2. Clique no botão de replay: Esconder botão, resetar tempo para 0 e dar play novamente
    if (sec3ReplayBtn) {
      sec3ReplayBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sec3ReplayBtn.classList.remove('show-replay');
        try {
          sec3Video.currentTime = 0;
          sec3Video.play();
        } catch (err) {
          console.error('Erro ao reiniciar vídeo da Seção 3:', err);
        }
      });
    }
  }

  // 3. IntersectionObserver: Pausar vídeo ao sair da tela e dar play ao retornar à tela
  if (sec3Video && sec3Section) {
    const sec3Observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          try {
            const playPromise = sec3Video.play();
            if (playPromise !== undefined) {
              playPromise.catch(error => {
                console.log('Autoplay do vídeo da Seção 3 aguardando interação:', error);
              });
            }
          } catch (err) {
            console.error('Erro ao reproduzir vídeo da Seção 3:', err);
          }
        } else {
          try {
            sec3Video.pause();
          } catch (err) {
            console.error('Erro ao pausar vídeo da Seção 3:', err);
          }
        }
      });
    }, {
      threshold: 0.15 // Dispara quando 15% da Seção 3 estiver visível na tela
    });

    sec3Observer.observe(sec3Section);
  }

  // --------------------------------------------------------------------------
  // 5. MINI-CARROSSEL DE IMAGENS NOS CARDS DE CARROS & EFEITO BLUR "VER MAIS"
  // --------------------------------------------------------------------------
  document.querySelectorAll('.car-gallery-container').forEach(gallery => {
    const track = gallery.querySelector('.car-slides-track');
    const slides = gallery.querySelectorAll('.car-slide-img');
    const prevBtn = gallery.querySelector('.gallery-nav-btn.prev');
    const nextBtn = gallery.querySelector('.gallery-nav-btn.next');
    const dots = gallery.querySelectorAll('.gallery-dots .dot');
    const verMaisOverlay = gallery.querySelector('.ver-mais-overlay');

    let currentIndex = 0;
    const totalSlides = slides.length;

    function updateGallery() {
      if (currentIndex >= totalSlides) {
        gallery.classList.add('blur-active');
        dots.forEach(d => d.classList.remove('active'));
      } else {
        gallery.classList.remove('blur-active');
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, idx) => {
          if (idx === currentIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentIndex < totalSlides) {
          currentIndex++;
        } else {
          currentIndex = 0;
        }
        updateGallery();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (gallery.classList.contains('blur-active')) {
          currentIndex = totalSlides - 1;
        } else if (currentIndex > 0) {
          currentIndex--;
        } else {
          currentIndex = 0;
        }
        updateGallery();
      });
    }

    if (verMaisOverlay) {
      verMaisOverlay.addEventListener('click', (e) => {
        e.stopPropagation();
        // Ação de simulação de clique para ver mais detalhes
        window.location.hash = 'servicos';
      });
    }

    // Suporte a Touch Swipe em Dispositivos Móveis
    let startX = 0;
    gallery.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    gallery.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;

      if (Math.abs(diffX) > 35) {
        if (diffX > 0) {
          if (currentIndex < totalSlides) currentIndex++;
        } else {
          if (gallery.classList.contains('blur-active')) {
            currentIndex = totalSlides - 1;
          } else if (currentIndex > 0) {
            currentIndex--;
          }
        }
        updateGallery();
      }
    }, { passive: true });

  });

});
