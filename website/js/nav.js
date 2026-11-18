/* ==========================================================================
   UNIFIED NAVIGATION CONTROLLER — Used on ALL sub-pages
   Handles: Scroll behaviour, hamburger toggle, active link highlighting
   ========================================================================== */

;(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const DOM = {
    body:      document.body,
    navbar:    $('#navbar'),
    navMenu:   $('#navMenu'),
    hamburger: $('#hamburgerBtn'),
  };

  if (!DOM.navbar) return;

  /* ── Scroll-aware navbar ── */
  let lastScrollY = 0;
  let ticking = false;

  function handleNavScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 80) {
      DOM.navbar.classList.add('scrolled');
    } else {
      DOM.navbar.classList.remove('scrolled');
    }

    if (scrollY > 400) {
      if (scrollY > lastScrollY + 5) {
        DOM.navbar.classList.add('hidden');
      } else if (scrollY < lastScrollY - 5) {
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

  /* ── Hamburger toggle ── */
  if (DOM.hamburger && DOM.navMenu) {
    DOM.hamburger.addEventListener('click', () => {
      const isActive = DOM.hamburger.classList.toggle('active');
      DOM.navMenu.classList.toggle('active');

      if (isActive) {
        DOM.body.classList.add('no-scroll');
      } else {
        DOM.body.classList.remove('no-scroll');
      }
    });

    $$('.nav__link', DOM.navMenu).forEach(link => {
      link.addEventListener('click', () => {
        DOM.hamburger.classList.remove('active');
        DOM.navMenu.classList.remove('active');
        DOM.body.classList.remove('no-scroll');
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && DOM.navMenu.classList.contains('active')) {
        DOM.hamburger.classList.remove('active');
        DOM.navMenu.classList.remove('active');
        DOM.body.classList.remove('no-scroll');
      }
    });
  }

  /* ── Active link highlighting ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('nav__link--active');
    }
  });

  /* ── Smooth scroll for anchor links ── */
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;
      const target = $(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = DOM.navbar.offsetHeight + 20;
      const pos = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: pos, behavior: 'smooth' });
    });
  });

  /* ── AOS init (if available) ── */
  window.addEventListener('load', () => {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 80,
      });
    }
  });

})();
