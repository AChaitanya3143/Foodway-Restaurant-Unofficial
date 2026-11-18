/* ==========================================================================
   GSAP ANIMATIONS & SCROLL REVEALS — FOODWAY FAMILY RESTAURANT
   Advanced scroll-triggered animations, 3D transforms, parallax,
   text reveals, counters, and performance-optimized initialization
   ========================================================================== */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     Reduced-Motion Check & Feature Detection
  ---------------------------------------------------------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;
  const hasGSAP = typeof gsap !== 'undefined';
  const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';
  const hasAOS = typeof AOS !== 'undefined';

  /* ==========================================================================
     HELPER UTILITIES
  ========================================================================== */
  const formatNumber = (num) => num.toLocaleString('en-IN');

  const lerp = (start, end, factor) => start + (end - start) * factor;

  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

  /* ==========================================================================
     REDUCED MOTION HANDLER
  ========================================================================== */
  const handleReducedMotion = () => {
    // Remove preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) preloader.style.display = 'none';

    // Show all animated elements immediately
    document.querySelectorAll('[data-aos], .reveal, .reveal-text, .fade-up, .scale-in, .img-reveal').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.clipPath = 'none';
      el.removeAttribute('data-aos');
      el.removeAttribute('data-aos-delay');
      el.removeAttribute('data-aos-duration');
    });

    // Set counter values
    document.querySelectorAll('.counter').forEach((el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      if (!isNaN(target)) el.textContent = formatNumber(target) + suffix;
    });

    // Load lazy images
    document.querySelectorAll('img[data-src]').forEach((img) => {
      img.src = img.dataset.src;
      if (img.dataset.srcset) img.srcset = img.dataset.srcset;
      img.classList.add('loaded');
      img.style.opacity = '1';
    });

    // Kill all GSAP animations
    if (hasGSAP) {
      gsap.globalTimeline.clear();
      ScrollTrigger.getAll().forEach(st => st.kill());
    }
  };

  /* ==========================================================================
     1. AOS INITIALIZATION (Fallback / Complementary)
  ========================================================================== */
  const initAOS = () => {
    if (!hasAOS || prefersReducedMotion) return;

    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: isMobile ? 50 : 80,
      delay: 0,
      disable: prefersReducedMotion,
      startEvent: 'DOMContentLoaded',
    });

    // Refresh after fonts and images load
    window.addEventListener('load', () => {
      setTimeout(() => AOS.refresh(), 100);
    });
  };

  /* ==========================================================================
     2. GSAP SCROLLTRIGGER — MAIN ANIMATION ENGINE
  ========================================================================== */
  const initGSAPAnimations = () => {
    if (!hasGSAP || !hasScrollTrigger || prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);
    gsap.config({ nullTargetWarn: false, trialWarn: false });

    /* ---- Global defaults ---- */
    gsap.defaults({
      ease: 'power3.out',
      duration: 0.8,
    });

    /* ---- ScrollTrigger defaults ---- */
    ScrollTrigger.defaults({
      toggleActions: 'play none none reverse',
      markers: false,
    });

    /* ----------------------------------------------------------
       HERO SECTION ENTRANCE (Timeline)
    ---------------------------------------------------------- */
    const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTL
      .from('.hero-label', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
      })
      .from('.hero-title', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
      }, '-=0.4')
      .from('.hero-subtitle', {
        y: 30,
        opacity: 0,
        duration: 0.8,
      }, '-=0.6')
      .from('.hero-cta > *', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
      }, '-=0.4')
      .from('.hero-trust > *', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
      }, '-=0.3')
      .from('.hero-scroll-indicator', {
        y: 20,
        opacity: 0,
        duration: 0.6,
      }, '-=0.2');

    /* ---- Hero background parallax ---- */
    const heroBg = document.querySelector('.hero-bg img');
    if (heroBg) {
      gsap.to(heroBg, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }

    /* ---- Hero overlay opacity ---- */
    gsap.to('.overlay-darker', {
      opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    /* ----------------------------------------------------------
       SECTION HEADERS — Staggered Reveal
    ---------------------------------------------------------- */
    gsap.utils.toArray('.section-header').forEach((header) => {
      const children = header.children;
      if (!children.length) return;

      gsap.from(children, {
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
      });
    });

    /* ----------------------------------------------------------
       GRID CARDS — 3D Staggered Entrance
    ---------------------------------------------------------- */
    const cardSelectors = [
      '.dish-card',
      '.highlight-card',
      '.promo-card',
      '.event-card',
      '.testimonial-card',
      '.usp-card',
      '.gallery-item',
      '.stat-item',
      '.footer-col',
      '.location-detail',
      '.about-stats .stat-item',
    ];

    cardSelectors.forEach((selector) => {
      const grids = document.querySelectorAll(`.grid:has(${selector}), .grid-3:has(${selector}), .grid-4:has(${selector}), .dishes-grid:has(${selector}), .testimonials-grid:has(${selector}), .events-grid:has(${selector}), .about-grid:has(${selector}), .location-grid:has(${selector})`);

      // Also handle direct parent grids
      const allContainers = new Set([
        ...document.querySelectorAll('.grid, .grid-3, .grid-4, .dishes-grid, .testimonials-grid, .events-grid, .about-grid, .location-grid, .usp-cards, .highlights-grid')
      ]);

      allContainers.forEach((grid) => {
        const cards = grid.querySelectorAll(selector);
        if (!cards.length) return;

        // Check if already animated
        if (grid.dataset.animated === 'true') return;
        grid.dataset.animated = 'true';

        gsap.from(cards, {
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          y: 60,
          rotationX: 15,
          rotationY: -5,
          opacity: 0,
          duration: 0.7,
          stagger: {
            amount: Math.min(0.8, cards.length * 0.08),
            from: 'start',
            grid: 'auto',
          },
          ease: 'power3.out',
          clearProps: 'transform',
        });
      });
    });

    /* ----------------------------------------------------------
       IMAGE REVEALS — Clip Path Animation
    ---------------------------------------------------------- */
    gsap.utils.toArray('.img-reveal, .about-image-wrapper, .chef-card-img, .location-map, .promo-card, .event-card-image').forEach((el, index) => {
      // Skip if already handled
      if (el.dataset.revealInit) return;
      el.dataset.revealInit = 'true';

      const direction = index % 2 === 0 ? 'left' : 'right';
      const fromClip = direction === 'left' ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)';

      // Wrap image if not already wrapped
      const img = el.tagName === 'IMG' ? el : el.querySelector('img');
      if (!img) return;

      const wrapper = img.parentElement;
      wrapper.style.overflow = 'hidden';
      wrapper.style.position = 'relative';

      gsap.from(img, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        clipPath: fromClip,
        scale: 1.1,
        duration: 1.2,
        ease: 'power4.inOut',
      });

      // Parallax on scroll
      gsap.to(img, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    });

    /* ----------------------------------------------------------
       GOLD LINES / DIVIDERS — Width Animation
    ---------------------------------------------------------- */
    gsap.utils.toArray('.gold-line, .section-label::after, .divider-gold, .trust-divider, .promo-card::after').forEach((line) => {
      gsap.from(line, {
        scrollTrigger: {
          trigger: line,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
        width: 0,
        duration: 1,
        ease: 'power2.out',
      });
    });

    /* ----------------------------------------------------------
       FADE-UP ELEMENTS
    ---------------------------------------------------------- */
    gsap.utils.toArray('.fade-up, .about-text, .about-content > *:not(.about-stats)').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
      });
    });

    /* ----------------------------------------------------------
       SCALE-IN ELEMENTS (Buttons, badges, icons)
    ---------------------------------------------------------- */
    gsap.utils.toArray('.scale-in, .btn, .highlight-icon, .promo-icon, .stat-number, .about-experience-badge').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
      });
    });

    /* ----------------------------------------------------------
       TEXT REVEAL — Word by Word
    ---------------------------------------------------------- */
    const initTextReveal = () => {
      const revealTexts = document.querySelectorAll('.reveal-text, .hero-title, .section-title, .newsletter-title');
      if (!revealTexts.length) return;

      revealTexts.forEach((el) => {
        if (el.dataset.textRevealInit) return;
        el.dataset.textRevealInit = 'true';

        const text = el.textContent.trim();
        if (!text) return;

        // Preserve HTML if present
        const html = el.innerHTML;
        const words = text.split(/(\s+)/).filter(w => w.length > 0);

        el.innerHTML = '';
        el.style.opacity = '1';

        words.forEach((word, i) => {
          const span = document.createElement('span');
          span.className = 'reveal-word';
          span.textContent = word;
          span.style.cssText = `
            display: inline-block;
            opacity: 0;
            transform: translateY(1.2em) rotateX(-15deg);
            transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                        transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            transition-delay: ${i * 0.05}s;
            will-change: opacity, transform;
          `;
          el.appendChild(span);
        });
      });

      // IntersectionObserver to trigger
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const words = entry.target.querySelectorAll('.reveal-word');
            words.forEach((word) => {
              word.style.opacity = '1';
              word.style.transform = 'translateY(0) rotateX(0)';
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

      revealTexts.forEach((el) => observer.observe(el));
    };

    initTextReveal();

    /* ----------------------------------------------------------
       COUNTER ANIMATIONS
    ---------------------------------------------------------- */
    const initCounters = () => {
      const counters = document.querySelectorAll('.counter, .stat-number');
      if (!counters.length) return;

      counters.forEach((counter) => {
        if (counter.dataset.counterInit) return;
        counter.dataset.counterInit = 'true';

        const target = parseInt(counter.getAttribute('data-target') || counter.textContent.replace(/[^\d]/g, ''), 10);
        if (isNaN(target)) return;

        const suffix = counter.getAttribute('data-suffix') || '';
        const prefix = counter.getAttribute('data-prefix') || '';
        const duration = parseInt(counter.getAttribute('data-duration'), 10) || 2000;

        counter.textContent = prefix + '0' + suffix;

        ScrollTrigger.create({
          trigger: counter,
          start: 'top 85%',
          onEnter: () => animateCounter(counter, target, suffix, prefix, duration),
          once: true,
        });
      });
    };

    const animateCounter = (el, target, suffix, prefix, duration) => {
      const frameDuration = 1000 / 60;
      const totalFrames = Math.round(duration / frameDuration);
      let frame = 0;

      const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

      const update = () => {
        frame++;
        const progress = easeOutQuart(clamp(frame / totalFrames, 0, 1));
        const currentValue = Math.round(target * progress);
        el.textContent = prefix + formatNumber(currentValue) + suffix;

        if (frame < totalFrames) {
          requestAnimationFrame(update);
        } else {
          el.textContent = prefix + formatNumber(target) + suffix;
        }
      };

      update();
    };

    initCounters();

    /* ----------------------------------------------------------
       PARALLAX SECTIONS
    ---------------------------------------------------------- */
    const initParallax = () => {
      // Hero parallax (already done above)

      // Section background parallax
      gsap.utils.toArray('.parallax-bg, .section-dishes::before, .section-highlights::before, .newsletter-bg').forEach((bg) => {
        gsap.to(bg, {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: bg.parentElement || bg,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });

      // Floating elements parallax
      gsap.utils.toArray('.floating-element, .hero-visual-card, .about-image-accent').forEach((el, i) => {
        const speed = parseFloat(el.dataset.parallaxSpeed) || (0.1 + (i % 3) * 0.05);
        gsap.to(el, {
          yPercent: 30 * speed,
          xPercent: 10 * speed,
          rotation: 2 * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement || el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });
    };

    initParallax();

    /* ----------------------------------------------------------
       ORDER BANNER ANIMATION
    ---------------------------------------------------------- */
    const orderBanner = document.querySelector('.order-banner');
    if (orderBanner) {
      gsap.from('.order-banner-content', {
        scrollTrigger: {
          trigger: orderBanner,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      gsap.from('.order-banner-buttons .btn-order', {
        scrollTrigger: {
          trigger: orderBanner,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        delay: 0.2,
        ease: 'back.out(1.5)',
      });
    }

    /* ----------------------------------------------------------
       NEWSLETTER SECTION
    ---------------------------------------------------------- */
    const newsletter = document.querySelector('.section-newsletter');
    if (newsletter) {
      gsap.from('.newsletter-icon', {
        scrollTrigger: {
          trigger: newsletter,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        scale: 0,
        rotation: -180,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.7)',
      });

      gsap.from('.newsletter-form', {
        scrollTrigger: {
          trigger: newsletter,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        delay: 0.3,
        ease: 'power3.out',
      });
    }

    /* ----------------------------------------------------------
       FOOTER ANIMATIONS
    ---------------------------------------------------------- */
    const footer = document.querySelector('.footer');
    if (footer) {
      gsap.from('.footer-col', {
        scrollTrigger: {
          trigger: footer,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      });

      gsap.from('.footer-bottom', {
        scrollTrigger: {
          trigger: footer,
          start: 'top 95%',
          toggleActions: 'play none none reverse',
        },
        y: 20,
        opacity: 0,
        duration: 0.5,
        delay: 0.3,
        ease: 'power2.out',
      });
    }

    /* ----------------------------------------------------------
       SCROLL INDICATOR AUTO-HIDE
    ---------------------------------------------------------- */
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
      ScrollTrigger.create({
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        onUpdate: (self) => {
          const opacity = 1 - self.progress * 2;
          scrollIndicator.style.opacity = Math.max(0, opacity);
        },
      });
    }

    /* ----------------------------------------------------------
       REFRESH ON RESIZE / LOAD
    ---------------------------------------------------------- */
    let refreshTimeout;
    const refreshScrollTrigger = () => {
      clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    };

    window.addEventListener('resize', refreshScrollTrigger, { passive: true });
    window.addEventListener('load', refreshScrollTrigger);
  };

  /* ==========================================================================
     3. IMAGE LAZY LOADING WITH FADE-IN
  ========================================================================== */
  const initLazyLoading = () => {
    const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]:not([src])');
    if (!lazyImages.length) return;

    lazyImages.forEach((img) => {
      if (!img.style.opacity) {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.6s ease, filter 0.6s ease';
        img.style.filter = 'blur(10px)';
      }
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;
            const srcset = img.dataset.srcset;

            const loadImage = () => {
              if (src) img.src = src;
              if (srcset) img.srcset = srcset;
            };

            if (img.complete) {
              img.style.opacity = '1';
              img.style.filter = 'none';
              img.classList.add('loaded');
            } else {
              img.addEventListener('load', () => {
                img.style.opacity = '1';
                img.style.filter = 'none';
                img.classList.add('loaded');
              }, { once: true });

              img.addEventListener('error', () => {
                img.style.opacity = '1';
                img.style.filter = 'none';
                img.classList.add('load-error');
              }, { once: true });

              loadImage();
            }

            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '150px 0px',
        threshold: 0.01,
      });

      lazyImages.forEach((img) => observer.observe(img));
    } else {
      // Fallback
      lazyImages.forEach((img) => {
        if (img.dataset.src) img.src = img.dataset.src;
        img.style.opacity = '1';
        img.style.filter = 'none';
      });
    }
  };

  /* ==========================================================================
     4. PRELOADER
  ========================================================================== */
  const initPreloader = () => {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    // Lock scroll while preloader is visible
    document.body.classList.add('no-scroll');

    const hidePreloader = () => {
      preloader.style.transition = 'opacity 0.6s ease, visibility 0.6s ease';
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';

      setTimeout(() => {
        preloader.style.display = 'none';
        document.body.classList.remove('no-scroll');

        if (hasAOS) AOS.refresh();
        if (hasScrollTrigger) ScrollTrigger.refresh();
      }, 600);
    };

    const minDuration = 1200;
    const startTime = Date.now();

    window.addEventListener('load', () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDuration - elapsed);
      setTimeout(hidePreloader, remaining);
    });

    // Force hide after 4 seconds
    setTimeout(() => {
      if (preloader.parentElement) hidePreloader();
    }, 4000);
  };

  /* ==========================================================================
     5. SMOOTH SCROLL FOR ANCHOR LINKS
  ========================================================================== */
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerOffset = document.querySelector('.header')?.offsetHeight || 80;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
          });

          // Update URL without scroll
          history.pushState(null, '', targetId);
        }
      });
    });
  };

  /* ==========================================================================
     6. INTERACTIVE HOVER EFFECTS (Non-GSAP, CSS-based)
  ========================================================================== */
  const initInteractiveEffects = () => {
    // Magnetic buttons
    document.querySelectorAll('.btn-magnetic, .btn-primary, .btn-secondary, .dish-order-btn').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.02)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0) scale(1)';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      });
    });

    // Card shine effect
    document.querySelectorAll('.dish-card, .highlight-card, .promo-card, .event-card, .testimonial-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        card.style.setProperty('--shine-x', `${x}%`);
        card.style.setProperty('--shine-y', `${y}%`);
      });
    });

    // Nav link underline animation
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('mouseenter', () => {
        link.style.setProperty('--underline-width', '100%');
      });
      link.addEventListener('mouseleave', () => {
        if (!link.classList.contains('active')) {
          link.style.setProperty('--underline-width', '0%');
        }
      });
    });
  };

  /* ==========================================================================
     7. SCROLL PROGRESS INDICATOR
  ========================================================================== */
  const initScrollProgress = () => {
    let progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.className = 'scroll-progress';
      progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: var(--gold-gradient);
        z-index: 9999;
        transform-origin: left;
        transform: scaleX(0);
        box-shadow: 0 0 10px var(--gold-primary);
      `;
      document.body.appendChild(progressBar);
    }

    let ticking = false;
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      progressBar.style.transform = `scaleX(${clamp(progress, 0, 1)})`;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });
  };

  /* ==========================================================================
     INITIALIZATION SEQUENCE
  ========================================================================== */
  const init = () => {
    if (prefersReducedMotion) {
      handleReducedMotion();
      initPreloader();
      initLazyLoading();
      initSmoothScroll();
      return;
    }

    // Order matters: preloader first, then animations
    initPreloader();
    initAOS();
    initGSAPAnimations();
    initLazyLoading();
    initSmoothScroll();
    initInteractiveEffects();
    initScrollProgress();

    // Initialize 3D tilt cards from three-bg.js
    if (typeof init3DTiltCards === 'function') {
      init3DTiltCards();
    }
  };

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ==========================================================================
     PUBLIC API
  ========================================================================== */
  window.FoodwayAnimations = {
    init,
    refresh: () => {
      if (hasAOS) AOS.refresh();
      if (hasScrollTrigger) ScrollTrigger.refresh();
    },
    killAll: () => {
      if (hasGSAP) {
        gsap.globalTimeline.clear();
        ScrollTrigger.getAll().forEach(st => st.kill());
      }
    },
    prefersReducedMotion: () => prefersReducedMotion,
  };
})();