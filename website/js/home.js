/* ==========================================================================
   FOODWAY — HOMEPAGE CONTROLLER (home.js)
   Handles: Preloader, Navigation, Scroll behaviour, AOS, GSAP parallax,
            Video fallback, Mobile bar, Hamburger menu
   Dependencies: GSAP + ScrollTrigger, AOS (loaded before this script)
   ========================================================================== */

;(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────────────
     UTILITY — Cache DOM references once
     ────────────────────────────────────────────────────────────── */

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const DOM = {
    body:        document.body,
    preloader:   $('#preloader'),
    navbar:      $('#navbar'),
    navMenu:     $('#navMenu'),
    hamburger:   $('#hamburgerBtn'),
    hero:        $('#hero'),
    heroVideo:   $('.hero__video'),
    reserveBg:   $('.reserve__bg'),
    mobileBar:   $('#mobileBottomBar'),
    scrollHint:  $('.hero__scroll'),
  };


  /* ──────────────────────────────────────────────────────────────
     1. PRELOADER — Lock scroll, then fade out on window load
     ────────────────────────────────────────────────────────────── */

  // Prevent scroll while loading
  DOM.body.classList.add('no-scroll');

  function hidePreloader() {
    if (!DOM.preloader) return;

    DOM.preloader.classList.add('loaded');
    DOM.body.classList.remove('no-scroll');

    // Remove from DOM after transition (0.8s in CSS)
    setTimeout(() => {
      if (DOM.preloader && DOM.preloader.parentNode) {
        DOM.preloader.style.display = 'none';
      }
    }, 900);
  }

  // Hide on load, or after 4s failsafe (in case resources are slow)
  window.addEventListener('load', hidePreloader);
  setTimeout(hidePreloader, 4000);


  /* ──────────────────────────────────────────────────────────────
     2. NAVIGATION — Scroll-aware: background on scroll, 
        hide/show on direction, hamburger toggle
     ────────────────────────────────────────────────────────────── */

  let lastScrollY = 0;
  let ticking = false;
  const SCROLL_THRESHOLD = 80;   // px before nav gets background
  const HIDE_THRESHOLD = 400;    // px before direction-hide kicks in

  function handleNavScroll() {
    const scrollY = window.scrollY;

    // Add/remove solid background
    if (scrollY > SCROLL_THRESHOLD) {
      DOM.navbar.classList.add('scrolled');
    } else {
      DOM.navbar.classList.remove('scrolled');
    }

    // Hide/show on scroll direction (only after hero)
    if (scrollY > HIDE_THRESHOLD) {
      if (scrollY > lastScrollY + 5) {
        // Scrolling down → hide
        DOM.navbar.classList.add('hidden');
      } else if (scrollY < lastScrollY - 5) {
        // Scrolling up → show
        DOM.navbar.classList.remove('hidden');
      }
    } else {
      DOM.navbar.classList.remove('hidden');
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(handleNavScroll);
      ticking = true;
    }
  }, { passive: true });


  /* ──────────────────────────────────────────────────────────────
     3. HAMBURGER MENU — Toggle mobile nav
     ────────────────────────────────────────────────────────────── */

  if (DOM.hamburger && DOM.navMenu) {
    DOM.hamburger.addEventListener('click', () => {
      const isActive = DOM.hamburger.classList.toggle('active');
      DOM.navMenu.classList.toggle('active');

      // Lock body scroll when menu open
      if (isActive) {
        DOM.body.classList.add('no-scroll');
      } else {
        DOM.body.classList.remove('no-scroll');
      }
    });

    // Close menu when a nav link is clicked
    $$('.nav__link', DOM.navMenu).forEach(link => {
      link.addEventListener('click', () => {
        DOM.hamburger.classList.remove('active');
        DOM.navMenu.classList.remove('active');
        DOM.body.classList.remove('no-scroll');
      });
    });
  }


  /* ──────────────────────────────────────────────────────────────
     4. MOBILE BOTTOM BAR — Show after scrolling past hero
     ────────────────────────────────────────────────────────────── */

  function handleMobileBar() {
    if (!DOM.mobileBar || !DOM.hero) return;

    const heroBottom = DOM.hero.offsetTop + DOM.hero.offsetHeight;

    if (window.scrollY > heroBottom * 0.6) {
      DOM.mobileBar.classList.add('visible');
    } else {
      DOM.mobileBar.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleMobileBar, { passive: true });


  /* ──────────────────────────────────────────────────────────────
     5. AOS — Animate On Scroll initialisation
     ────────────────────────────────────────────────────────────── */

  function initAOS() {
    if (typeof AOS === 'undefined') return;

    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
      disable: function () {
        // Disable on very small screens with prefers-reduced-motion
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      }
    });
  }

  // Initialise after a small delay to let preloader run
  window.addEventListener('load', () => {
    setTimeout(initAOS, 300);
  });


  /* ──────────────────────────────────────────────────────────────
     6. GSAP — Register ScrollTrigger + Parallax effects
     ────────────────────────────────────────────────────────────── */

  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // §4 Reserve section — parallax background
    if (DOM.reserveBg) {
      gsap.fromTo(DOM.reserveBg,
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: '.reserve',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          }
        }
      );
    }

    // Hero content — gentle fade out on scroll
    const heroContent = $('.hero__content');
    if (heroContent) {
      gsap.to(heroContent, {
        yPercent: -15,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        }
      });
    }

    // Scroll hint — fade out quickly
    if (DOM.scrollHint) {
      gsap.to(DOM.scrollHint, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: '10% top',
          end: '30% top',
          scrub: true,
        }
      });
    }

    // Signature image — slow zoom on scroll (Ken Burns in scroll)
    const sigImg = $('.signature__image img');
    if (sigImg) {
      gsap.fromTo(sigImg,
        { scale: 1.08 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.signature',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2,
          }
        }
      );
    }

    // Proof section — text reveal with stagger
    const proofElements = $$('.proof__rating, .proof__quote, .proof__cite');
    if (proofElements.length) {
      gsap.from(proofElements, {
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.proof',
          start: 'top 75%',
          once: true,
        }
      });
    }
  }

  window.addEventListener('load', () => {
    setTimeout(initGSAP, 400);
  });


  /* ──────────────────────────────────────────────────────────────
     7. VIDEO — Respect prefers-reduced-motion
     ────────────────────────────────────────────────────────────── */

  function handleVideoMotion() {
    if (!DOM.heroVideo) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    function applyMotionPref(mq) {
      if (mq.matches) {
        DOM.heroVideo.pause();
        DOM.heroVideo.style.display = 'none';
      } else {
        DOM.heroVideo.style.display = '';
        DOM.heroVideo.play().catch(() => {
          // Autoplay blocked — poster will show via CSS
        });
      }
    }

    applyMotionPref(prefersReduced);
    prefersReduced.addEventListener('change', applyMotionPref);
  }

  handleVideoMotion();


  /* ──────────────────────────────────────────────────────────────
     8. SMOOTH SCROLL — For anchor links
     ────────────────────────────────────────────────────────────── */

  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;

      const target = $(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  });


  /* ──────────────────────────────────────────────────────────────
     9. NO-SCROLL UTILITY — CSS class to lock scroll
     ────────────────────────────────────────────────────────────── */

  // This style is normally in CSS, but let's ensure it works
  const noScrollStyle = document.createElement('style');
  noScrollStyle.textContent = `
    body.no-scroll {
      overflow: hidden;
      position: fixed;
      width: 100%;
      top: 0;
      left: 0;
    }
    .mobile-bar.visible {
      display: flex !important;
    }
  `;
  document.head.appendChild(noScrollStyle);


  /* ──────────────────────────────────────────────────────────────
     10. PUBLIC API — Expose for debugging
     ────────────────────────────────────────────────────────────── */

  window.FoodwayHome = {
    version: '2.0.0',
    dom: DOM,
    reinitAOS: initAOS,
    reinitGSAP: initGSAP,
  };

})();
