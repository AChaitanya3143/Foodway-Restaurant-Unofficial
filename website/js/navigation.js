/* ==========================================================================
   NAVIGATION & HEADER BEHAVIOR — ENHANCED
   Sticky header, mobile drawer, active links, search, keyboard navigation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar') || document.querySelector('.header');
  const hamburger = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const body = document.body;

  // Sticky header on scroll (handled by main.js initNavbarScroll)

  // Hamburger toggle with animation
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('active');
      navMenu.classList.toggle('active', isOpen);
      body.classList.toggle('nav-open', isOpen);

      // Update ARIA
      hamburger.setAttribute('aria-expanded', isOpen);
      hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');

      // Trap focus when open
      if (isOpen) {
        trapFocus(navMenu);
      }
    });
  }

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
      hamburger?.classList.remove('active');
      navMenu.classList.remove('active');
      body.classList.remove('nav-open');
      hamburger?.setAttribute('aria-expanded', 'false');
      hamburger?.focus();
    }
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (navMenu?.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !hamburger?.contains(e.target)) {
      hamburger?.classList.remove('active');
      navMenu.classList.remove('active');
      body.classList.remove('nav-open');
      hamburger?.setAttribute('aria-expanded', 'false');
    }
  });

  // Active link highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html') || (currentPath === 'main.html' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = navbar?.offsetHeight || 0;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset - 20;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    });
  });

  // Focus trap for mobile menu
  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function handleTab(e) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });

    // Focus first element
    firstElement?.focus();
  }

  // Search functionality (if search input exists)
  const searchInput = document.getElementById('siteSearch');
  const searchResults = document.getElementById('searchResults');
  if (searchInput && searchResults) {
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length < 2) {
          searchResults.style.display = 'none';
          return;
        }
        // Simple filter - in production, use actual search index
        const items = Array.from(document.querySelectorAll('.dish-card, .menu-item')).filter(el => {
          const text = el.textContent.toLowerCase();
          return text.includes(query);
        });
        if (items.length > 0) {
          searchResults.style.display = 'block';
          // Render results (simplified)
        } else {
          searchResults.style.display = 'none';
        }
      }, 200);
    });

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.style.display = 'none';
      }
    });
  }

  // Announcement bar dismiss (if exists)
  const dismissAnnouncement = document.querySelector('.announcement-dismiss');
  if (dismissAnnouncement) {
    dismissAnnouncement.addEventListener('click', () => {
      const bar = document.querySelector('.announcement-bar');
      if (bar) bar.style.display = 'none';
    });
  }
});

/* ==========================================================================
   MOBILE BOTTOM BAR ACTIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const callBtn = document.getElementById('mobileCallBtn');
  const orderBtn = document.getElementById('mobileOrderBtn');
  const reserveBtn = document.getElementById('mobileReserveBtn');

  if (callBtn) {
    callBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'tel:+917400221190';
    });
  }

  if (orderBtn) {
    orderBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'menu.html';
    });
  }

  if (reserveBtn) {
    reserveBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('reservationForm') || document.querySelector('.reservation-section');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.location.href = 'contact.html#reservation';
      }
    });
  }
});