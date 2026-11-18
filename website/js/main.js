/* ==========================================================================
   MAIN INITIALIZER — FOODWAY FAMILY RESTAURANT
   Orchestrates all systems: Three.js, Cart, Reservation, Navigation, Animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Cart System (needs to be early for menu interactions)
  initCartSystem();

  // Initialize Reservation System
  initReservationSystem();

  // Initialize Navbar Scroll Effect
  initNavbarScroll();

  // Initialize Mobile Bottom Bar
  initMobileBottomBar();

  // Initialize Forms (Newsletter, Enquiry)
  if (typeof initNewsletterForm === 'function') initNewsletterForm();
  if (typeof initEnquiryForm === 'function') initEnquiryForm();

  // Initialize Intersection Observer for scroll reveals
  initScrollReveal();

  // Initialize Image Lazy Loading
  initLazyImages();

  // Initialize Scroll Progress Indicator
  initScrollProgress();

  // Three.js and GSAP Animations are auto-initialized in their respective files
  // three-bg.js handles: initThreeBackground() + init3DTiltCards()
  // animations.js handles: initAOS() + initGSAPAnimations()

  // Refresh animations after all systems loaded
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (typeof AOS !== 'undefined') AOS.refresh();
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      if (window.FoodwayAnimations?.refresh) window.FoodwayAnimations.refresh();
    }, 200);
  });

  // Keyboard accessibility: skip to main content
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const main = document.getElementById('main-content') || document.querySelector('main');
      if (main) {
        main.focus();
        main.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});

/* ==========================================================================
   SCROLL REVEAL (Intersection Observer)
   ========================================================================== */

function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    // Immediately show all reveal elements
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate, .img-reveal, .text-reveal, .fade-up').forEach(el => {
      el.classList.add('visible', 'loaded');
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.classList.contains('img-reveal')) {
          entry.target.classList.add('loaded');
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate, .img-reveal, .text-reveal, .fade-up').forEach(el => {
    observer.observe(el);
  });
}

/* ==========================================================================
   LAZY IMAGE LOADING
   ========================================================================== */

function initLazyImages() {
  const images = document.querySelectorAll('img[data-src]');
  if (!images.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        if (img.dataset.srcset) img.srcset = img.dataset.srcset;
        img.removeAttribute('data-src');
        img.removeAttribute('data-srcset');
        img.classList.add('loaded');
        obs.unobserve(img);
      }
    });
  }, { rootMargin: '100px' });

  images.forEach(img => observer.observe(img));
}

/* ==========================================================================
   SCROLL PROGRESS INDICATOR
   ========================================================================== */

function initScrollProgress() {
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
      box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
    `;
    document.body.appendChild(progressBar);
  }

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollTop / docHeight;
    progressBar.style.transform = `scaleX(${progress})`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* ==========================================================================
   CART SYSTEM
   ========================================================================== */

function initCartSystem() {
  const cartBtns = document.querySelectorAll('.add-to-cart-btn');
  const cartToggle = document.querySelector('.cart-toggle');
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const closeBtn = document.getElementById('closeCartBtn');

  cartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openCartDrawer();
    });
  });

  if (cartToggle) {
    cartToggle.addEventListener('click', () => {
      if (drawer) drawer.classList.toggle('active');
      if (overlay) overlay.classList.toggle('active');
      if (drawer?.classList.contains('active')) document.body.style.overflow = 'hidden';
      else document.body.style.overflow = '';
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeCartDrawer);
  }

  if (overlay) {
    overlay.addEventListener('click', closeCartDrawer);
  }

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer?.classList.contains('active')) {
      closeCartDrawer();
    }
  });
}

/* ==========================================================================
   RESERVATION SYSTEM
   ========================================================================== */

function initReservationSystem() {
  const form = document.getElementById('reservationForm');
  if (!form) return;

  // Populate time slots if not already populated
  const timeSelect = form.resTime;
  if (timeSelect && timeSelect.options.length <= 1) {
    const slots = [
      '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
      '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
      '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
      '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM',
      '11:00 PM', '11:30 PM'
    ];
    slots.forEach(slot => {
      const opt = document.createElement('option');
      opt.value = slot;
      opt.textContent = slot;
      timeSelect.appendChild(opt);
    });
  }

  // Populate guest count if not already
  const guestsSelect = form.resGuests;
  if (guestsSelect && guestsSelect.options.length <= 1) {
    for (let i = 1; i <= 20; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = i + (i === 1 ? ' Guest' : ' Guests');
      guestsSelect.appendChild(opt);
    }
  }

  // Set min date to today
  const dateInput = form.resDate;
  if (dateInput && !dateInput.value) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.resName.value.trim();
    const phone = form.resPhone.value.trim();
    const date = form.resDate.value;
    const time = form.resTime.value;
    const guests = form.resGuests.value;
    const requests = form.resRequests.value.trim();

    if (!name || !phone) {
      showToast('Please fill in your name and phone number.', 'error');
      return;
    }

    const phoneRegex = /^[0-9+\-\s]{10,15}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      showToast('Please enter a valid phone number.', 'error');
      return;
    }

    const successMsg = document.getElementById('reservationSuccess');
    if (successMsg) {
      successMsg.style.display = 'block';
      successMsg.innerHTML = `
        <div style="background: rgba(46,125,50,0.15); border: 1px solid #4caf50; border-radius: 8px; padding: 20px; margin-top: 20px; animation: fadeInUp 0.5s ease;">
          <h3 style="color: #4caf50; margin-bottom: 8px;">✓ Reservation Confirmed!</h3>
          <p style="color: var(--text-secondary); margin-bottom: 4px;">Thank you, <strong>${escapeHtml(name)}</strong>.</p>
          <p style="color: var(--text-secondary); margin-bottom: 4px;">Your table for <strong>${guests}</strong> is reserved on <strong>${formatDate(date)}</strong> at <strong>${time}</strong>.</p>
          <p style="color: var(--text-secondary); margin-bottom: 4px;">We'll confirm shortly at +91 74002 21190. For changes, call us anytime.</p>
        </div>
      `;
    }

    form.reset();
    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

/* ==========================================================================
   NAVBAR SCROLL EFFECT
   ========================================================================== */

function initNavbarScroll() {
  const navbar = document.getElementById('navbar') || document.querySelector('.header');
  if (!navbar) return;

  let lastScroll = 0;
  const threshold = 60;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > threshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hide/show on scroll direction
    if (currentScroll > lastScroll && currentScroll > 200) {
      navbar.classList.add('hidden');
    } else {
      navbar.classList.remove('hidden');
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

/* ==========================================================================
   MOBILE BOTTOM BAR
   ========================================================================== */

function initMobileBottomBar() {
  const bottomBar = document.querySelector('.mobile-bottom-bar');
  if (!bottomBar) return;

  const updateVisibility = () => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    bottomBar.style.display = isMobile ? 'flex' : 'none';
    document.body.style.paddingBottom = isMobile ? '70px' : '0';
  };

  updateVisibility();
  window.addEventListener('resize', updateVisibility, { passive: true });
}

/* ==========================================================================
   CART DRAWER HELPERS (used by cart.js)
   ========================================================================== */

function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('drawerOverlay');
  if (drawer && overlay) {
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('drawerOverlay');
  if (drawer && overlay) {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   TOAST NOTIFICATIONS
   ========================================================================== */

function showToast(message, type = 'success') {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.style.cssText = `
      position: fixed;
      bottom: 90px;
      right: 20px;
      padding: 14px 28px;
      border-radius: var(--radius-md);
      font-weight: 600;
      font-size: 0.9rem;
      box-shadow: var(--shadow-lg);
      z-index: 3000;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      transform: translateX(120%);
      opacity: 0;
      display: flex;
      align-items: center;
      gap: 10px;
    `;
    document.body.appendChild(toast);
  }

  const colors = {
    success: 'var(--gold-gradient)',
    error: 'linear-gradient(135deg, #ef5350, #c62828)',
    info: 'linear-gradient(135deg, #29b6f6, #0288d1)',
    warning: 'linear-gradient(135deg, #ffa726, #f57c00)'
  };

  toast.style.background = colors[type] || colors.success;
  toast.style.color = type === 'success' ? '#0d0e11' : '#fff';
  toast.textContent = message;

  // Animate in
  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
    toast.style.opacity = '1';
  });

  // Auto dismiss
  setTimeout(() => {
    toast.style.transform = 'translateX(120%)';
    toast.style.opacity = '0';
  }, 3000);
}

/* ==========================================================================
   UTILITY: DEBOUNCE
   ========================================================================== */

function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/* ==========================================================================
   UTILITY: THROTTLE
   ========================================================================== */

function throttle(fn, limit) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/* ==========================================================================
   NEWSLETTER FORM
   ========================================================================== */

function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.newsletterEmail.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    showToast('Thank you for subscribing! You will receive exclusive offers.', 'success');
    form.reset();
  });
}

/* ==========================================================================
   ENQUIRY FORM
   ========================================================================== */

function initEnquiryForm() {
  const form = document.getElementById('enquiryForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.enqName.value.trim();
    const phone = form.enqPhone.value.trim();
    const event = form.enqEvent.value;

    if (!name || !phone) {
      showToast('Please fill in your name and phone number.', 'error');
      return;
    }
    showToast(`Thank you, ${name}! Our events manager will call you shortly.`, 'success');
    form.reset();
  });
}

/* ==========================================================================
   PUBLIC API
   ========================================================================== */

window.FoodwayMain = {
  openCartDrawer,
  closeCartDrawer,
  showToast,
  formatDate,
  debounce,
  throttle,
  escapeHtml,
};