/**
 * Flor de Limpeza — Interações, Animações e Responsividade
 * Implementado com JavaScript Puro e IntersectionObserver
 */

document.addEventListener('DOMContentLoaded', () => {
  // Marca que o JavaScript está ativo para habilitar animações progressivas
  document.documentElement.classList.add('js-ready');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. Animação de Entrada da Hero (Na carga inicial)
     ========================================================================== */
  function initHeroAnimations() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.hero-reveal, .hero-line-inner, .hero-img, .hero-hours').forEach(el => {
        el.classList.add('is-in');
      });
      return;
    }

    // Dispara a sequência da Hero após um micro-tick de renderização inicial
    requestAnimationFrame(() => {
      // Linhas do título
      document.querySelectorAll('.hero-line-inner').forEach(line => {
        line.classList.add('is-in');
      });

      // Elementos gerais da Hero (Kicker, Descrição, Botões, Selo de Confiança)
      document.querySelectorAll('.hero-reveal').forEach(el => {
        el.classList.add('is-in');
      });

      // Imagem da lavadora
      const heroImg = document.querySelector('.hero-img');
      if (heroImg) {
        heroImg.classList.add('is-in');
      }

      // Card de horário flutuante (sobe suavemente logo após a imagem)
      const heroHours = document.querySelector('.hero-hours');
      if (heroHours) {
        heroHours.classList.add('is-in');
      }
    });
  }

  /* ==========================================================================
     2. Animações na Rolagem (IntersectionObserver)
     ========================================================================== */
  function initScrollAnimations() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.scroll-reveal').forEach(el => el.classList.add('is-visible'));
      const timeline = document.getElementById('timelineContainer');
      if (timeline) timeline.classList.add('is-active');
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          
          // Se for a timeline de Como Funciona, ativa também a linha de progresso
          if (entry.target.closest('#timelineContainer')) {
            const timeline = document.getElementById('timelineContainer');
            if (timeline) timeline.classList.add('is-active');
          }

          // Desregistra para que cada revelação ocorra apenas uma única vez
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observa todos os elementos marcados para revelação
    document.querySelectorAll('.scroll-reveal').forEach(el => {
      scrollObserver.observe(el);
    });

    // Observador dedicado para o container da timeline (desenho suave da linha)
    const timelineEl = document.getElementById('timelineContainer');
    if (timelineEl) {
      const timelineObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            timelineEl.classList.add('is-active');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      timelineObserver.observe(timelineEl);
    }
  }

  /* ==========================================================================
     3. Efeito do Cabeçalho na Rolagem
     ========================================================================== */
  function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 20) {
            header.classList.add('is-scrolled');
          } else {
            header.classList.remove('is-scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ==========================================================================
     4. Menu Mobile (Gaveta e Botão Hambúrguer)
     ========================================================================== */
  function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!menuToggle || !mobileMenu) return;
    const menuLabel = menuToggle.querySelector('.menu-label');

    function updateMenuLabel(isOpen) {
      menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
      if (menuLabel) menuLabel.textContent = isOpen ? 'Fechar' : 'Menu';
    }

    function toggleMenu() {
      const isOpen = mobileMenu.classList.toggle('is-open');
      menuToggle.classList.toggle('is-active', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
      updateMenuLabel(isOpen);
    }

    function closeMenu() {
      mobileMenu.classList.remove('is-open');
      menuToggle.classList.remove('is-active');
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      updateMenuLabel(false);
    }

    menuToggle.addEventListener('click', toggleMenu);

    // Fecha ao clicar em qualquer link da gaveta móvel
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Fecha ao teclar Esc
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  // Inicializa todos os módulos
  initHeroAnimations();
  initScrollAnimations();
  initHeaderScroll();
  initMobileMenu();
});
