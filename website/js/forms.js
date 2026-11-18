/* ==========================================================================
   FORM HANDLING — FOODWAY FAMILY RESTAURANT
   Reservation, Enquiry, Newsletter forms with validation, floating labels,
   success modals, and phone formatting
   ========================================================================== */

(function () {
  'use strict';

  /* ── 1. Reservation Form ── */
  const reservationForm = document.getElementById('reservationForm');

  if (reservationForm) {
    // Set min date to today
    const dateInput = reservationForm.querySelector('input[type="date"]');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
      dateInput.value = today;
    }

    // Dynamic time slots based on day
    const dateField = reservationForm.querySelector('#resDate');
    const timeField = reservationForm.querySelector('#resTime');

    if (dateField && timeField) {
      dateField.addEventListener('change', () => {
        updateTimeSlots(dateField.value, timeField);
      });
      // Initialize time slots
      if (dateField.value) {
        updateTimeSlots(dateField.value, timeField);
      }
    }

    // Phone number auto-format
    const phoneInput = reservationForm.querySelector('input[type="tel"]');
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 10) value = value.slice(0, 10);
        if (value.length > 5) {
          e.target.value = value.slice(0, 5) + ' ' + value.slice(5);
        } else {
          e.target.value = value;
        }
      });
    }

    // Form submission
    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validateReservationForm(reservationForm)) return;

      const submitBtn = reservationForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Disable button and show loading
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

      // Simulate API call
      setTimeout(() => {
        showSuccessModal(
          'Reservation Received!',
          'Your table reservation has been received successfully. We will confirm your booking shortly via phone call.',
          'For immediate confirmation, call <a href="tel:+917400221190" style="color: var(--gold-primary);">+91 74002 21190</a>'
        );

        reservationForm.reset();
        clearAllErrors(reservationForm);

        // Reset date
        if (dateInput) {
          const today = new Date().toISOString().split('T')[0];
          dateInput.value = today;
        }

        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 1500);
    });
  }

  /* ── 2. Enquiry / Contact Form ── */
  const enquiryForm = document.getElementById('enquiryForm');

  if (enquiryForm) {
    // Character counter for textarea
    const textarea = enquiryForm.querySelector('textarea');
    if (textarea) {
      const maxChars = 500;
      const counterEl = document.createElement('span');
      counterEl.className = 'char-counter';
      counterEl.textContent = `0 / ${maxChars}`;
      counterEl.style.cssText = 'display:block;text-align:right;font-size:0.75rem;color:var(--text-muted);margin-top:4px;';
      textarea.parentNode.appendChild(counterEl);

      textarea.addEventListener('input', () => {
        const count = textarea.value.length;
        counterEl.textContent = `${count} / ${maxChars}`;
        if (count > maxChars) {
          counterEl.style.color = 'var(--accent-red)';
          textarea.value = textarea.value.slice(0, maxChars);
        } else {
          counterEl.style.color = 'var(--text-muted)';
        }
      });
    }

    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validateEnquiryForm(enquiryForm)) return;

      const submitBtn = enquiryForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      setTimeout(() => {
        showSuccessModal(
          'Message Sent!',
          'Thank you for reaching out. We will get back to you within 24 hours.',
          ''
        );

        enquiryForm.reset();
        clearAllErrors(enquiryForm);

        // Reset character counter
        const counter = enquiryForm.querySelector('.char-counter');
        if (counter) counter.textContent = '0 / 500';

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 1500);
    });
  }

  /* ── 3. Validation Functions ── */

  function validateReservationForm(form) {
    let isValid = true;
    clearAllErrors(form);

    const name = form.querySelector('#resName');
    const phone = form.querySelector('#resPhone');
    const email = form.querySelector('#resEmail');
    const date = form.querySelector('#resDate');
    const time = form.querySelector('#resTime');
    const guests = form.querySelector('#resGuests');

    // Name validation
    if (name && name.value.trim().length < 2) {
      showFieldError(name, 'Please enter your full name');
      isValid = false;
    }

    // Phone validation
    if (phone) {
      const phoneVal = phone.value.replace(/\D/g, '');
      if (phoneVal.length !== 10) {
        showFieldError(phone, 'Please enter a valid 10-digit phone number');
        isValid = false;
      } else if (!/^[6-9]/.test(phoneVal)) {
        showFieldError(phone, 'Phone number must start with 6, 7, 8 or 9');
        isValid = false;
      }
    }

    // Email validation
    if (email && email.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        showFieldError(email, 'Please enter a valid email address');
        isValid = false;
      }
    }

    // Date validation
    if (date) {
      const selectedDate = new Date(date.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (!date.value) {
        showFieldError(date, 'Please select a date');
        isValid = false;
      } else if (selectedDate < today) {
        showFieldError(date, 'Please select today or a future date');
        isValid = false;
      }
    }

    // Time validation
    if (time && !time.value) {
      showFieldError(time, 'Please select a preferred time');
      isValid = false;
    }

    // Guests validation
    if (guests && !guests.value) {
      showFieldError(guests, 'Please select number of guests');
      isValid = false;
    }

    if (!isValid) {
      // Shake the form
      form.classList.add('form-shake');
      setTimeout(() => form.classList.remove('form-shake'), 600);

      // Scroll to first error
      const firstError = form.querySelector('.form-group.has-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    return isValid;
  }

  function validateEnquiryForm(form) {
    let isValid = true;
    clearAllErrors(form);

    const name = form.querySelector('#enqName');
    const email = form.querySelector('#enqEmail');
    const subject = form.querySelector('#enqSubject');
    const message = form.querySelector('#enqMessage');

    if (name && name.value.trim().length < 2) {
      showFieldError(name, 'Please enter your name');
      isValid = false;
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim()) {
        showFieldError(email, 'Please enter your email address');
        isValid = false;
      } else if (!emailRegex.test(email.value.trim())) {
        showFieldError(email, 'Please enter a valid email address');
        isValid = false;
      }
    }

    if (subject && subject.value.trim().length < 3) {
      showFieldError(subject, 'Please enter a subject');
      isValid = false;
    }

    if (message && message.value.trim().length < 10) {
      showFieldError(message, 'Message must be at least 10 characters');
      isValid = false;
    }

    if (!isValid) {
      form.classList.add('form-shake');
      setTimeout(() => form.classList.remove('form-shake'), 600);
    }

    return isValid;
  }

  /* ── 4. Error Display Helpers ── */

  function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;

    formGroup.classList.add('has-error');
    field.classList.add('error');

    // Create or update error message
    let errorEl = formGroup.querySelector('.field-error');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'field-error';
      formGroup.appendChild(errorEl);
    }
    errorEl.textContent = message;

    // Remove error on input change
    const removeError = () => {
      formGroup.classList.remove('has-error');
      field.classList.remove('error');
      if (errorEl) errorEl.remove();
      field.removeEventListener('input', removeError);
      field.removeEventListener('change', removeError);
    };

    field.addEventListener('input', removeError);
    field.addEventListener('change', removeError);
  }

  function clearAllErrors(form) {
    form.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    form.querySelectorAll('.field-error').forEach(el => el.remove());
  }

  /* ── 5. Time Slots Generator ── */

  function updateTimeSlots(dateValue, timeSelect) {
    if (!dateValue || !timeSelect) return;

    const selectedDate = new Date(dateValue);
    const dayOfWeek = selectedDate.getDay(); // 0=Sun, 5=Fri
    const isFriday = dayOfWeek === 5;

    const startHour = 11;
    const endHour = isFriday ? 24 : 23; // Friday: till 12:30 AM
    const endMinute = isFriday ? 30 : 30; // last slot

    // Save current value
    const currentValue = timeSelect.value;

    // Clear options
    timeSelect.innerHTML = '<option value="">Select Time</option>';

    for (let hour = startHour; hour <= (isFriday ? 24 : 23); hour++) {
      for (let min = 0; min < 60; min += 30) {
        if (hour === (isFriday ? 24 : 23) && min > (isFriday ? 0 : 30)) break;
        if (hour === 24 && min > 0) break;

        const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
        const period = hour >= 12 && hour < 24 ? 'PM' : 'AM';
        const displayMin = min.toString().padStart(2, '0');
        const label = `${displayHour}:${displayMin} ${period}`;
        const value = `${hour.toString().padStart(2, '0')}:${displayMin}`;

        const option = document.createElement('option');
        option.value = value;
        option.textContent = label;
        timeSelect.appendChild(option);
      }
    }

    // Restore value if still valid
    if (currentValue) {
      const options = Array.from(timeSelect.options);
      const match = options.find(opt => opt.value === currentValue);
      if (match) timeSelect.value = currentValue;
    }
  }

  /* ── 6. Success Modal ── */

  function showSuccessModal(title, message, subMessage) {
    // Remove existing modal
    const existingModal = document.querySelector('.success-modal-overlay');
    if (existingModal) existingModal.remove();

    const modalHTML = `
      <div class="success-modal-overlay" id="successModal">
        <div class="success-modal">
          <button class="success-modal-close" aria-label="Close">&times;</button>
          <div class="success-checkmark">
            <i class="fas fa-check"></i>
          </div>
          <h3>${title}</h3>
          <p>${message}</p>
          ${subMessage ? `<p class="success-modal-sub">${subMessage}</p>` : ''}
          <button class="btn btn-primary success-modal-btn">Done</button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('successModal');

    // Trigger animation
    requestAnimationFrame(() => {
      modal.classList.add('active');
    });

    // Close handlers
    const closeModal = () => {
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 400);
    };

    modal.querySelector('.success-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.success-modal-btn').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Auto-close after 8 seconds
    setTimeout(closeModal, 8000);
  }

  /* ── 7. Floating Label Enhancement ── */

  function initFloatingLabels() {
    document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(field => {
      // Check initial state
      if (field.value) {
        field.classList.add('has-value');
      }

      field.addEventListener('focus', () => {
        field.parentElement.classList.add('focused');
      });

      field.addEventListener('blur', () => {
        field.parentElement.classList.remove('focused');
        if (field.value) {
          field.classList.add('has-value');
        } else {
          field.classList.remove('has-value');
        }
      });

      field.addEventListener('input', () => {
        if (field.value) {
          field.classList.add('has-value');
        } else {
          field.classList.remove('has-value');
        }
      });
    });
  }

  /* ── 8. Newsletter Form ── */

  function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (!emailInput) return;

      const email = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        emailInput.classList.add('error');
        emailInput.style.borderColor = 'var(--accent-red)';

        setTimeout(() => {
          emailInput.classList.remove('error');
          emailInput.style.borderColor = '';
        }, 2000);
        return;
      }

      const submitBtn = newsletterForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

      setTimeout(() => {
        emailInput.value = '';
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
        submitBtn.style.background = 'var(--accent-green)';
        submitBtn.style.borderColor = 'var(--accent-green)';

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.style.borderColor = '';
        }, 3000);
      }, 1000);
    });
  }

  /* ── 9. Inject Modal CSS ── */

  function injectFormStyles() {
    if (document.getElementById('formDynamicStyles')) return;

    const style = document.createElement('style');
    style.id = 'formDynamicStyles';
    style.textContent = `
      .field-error {
        display: block;
        font-size: 0.75rem;
        color: var(--accent-red);
        margin-top: 4px;
        animation: fadeInUp 0.3s ease;
      }

      .form-group.has-error input,
      .form-group.has-error select,
      .form-group.has-error textarea,
      input.error,
      select.error,
      textarea.error {
        border-color: var(--accent-red) !important;
      }

      .form-shake {
        animation: shake 0.5s ease;
      }

      .success-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
      }

      .success-modal-overlay.active {
        opacity: 1;
        visibility: visible;
      }

      .success-modal {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        padding: 40px;
        max-width: 420px;
        width: 100%;
        text-align: center;
        position: relative;
        transform: scale(0.9) translateY(20px);
        transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }

      .success-modal-overlay.active .success-modal {
        transform: scale(1) translateY(0);
      }

      .success-modal-close {
        position: absolute;
        top: 15px;
        right: 20px;
        background: none;
        border: none;
        color: var(--text-muted);
        font-size: 1.5rem;
        cursor: pointer;
        transition: color 0.2s ease;
        line-height: 1;
      }

      .success-modal-close:hover {
        color: var(--text-primary);
      }

      .success-checkmark {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: rgba(46, 125, 50, 0.1);
        border: 2px solid var(--accent-green);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        animation: bounceIn 0.6s ease;
      }

      .success-checkmark i {
        color: var(--accent-green);
        font-size: 1.5rem;
      }

      .success-modal h3 {
        font-family: var(--font-heading);
        font-size: 1.5rem;
        color: var(--text-primary);
        margin-bottom: 12px;
      }

      .success-modal p {
        font-size: 0.95rem;
        color: var(--text-secondary);
        line-height: 1.7;
        margin-bottom: 8px;
      }

      .success-modal-sub {
        font-size: 0.85rem !important;
        color: var(--text-muted) !important;
        margin-bottom: 20px !important;
      }

      .success-modal-btn {
        margin-top: 10px;
      }

      @keyframes bounceIn {
        0% { opacity: 0; transform: scale(0.3); }
        50% { opacity: 1; transform: scale(1.05); }
        70% { transform: scale(0.95); }
        100% { transform: scale(1); }
      }

      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
        20%, 40%, 60%, 80% { transform: translateX(4px); }
      }

      .form-group.focused label {
        color: var(--gold-primary);
      }

      @media (max-width: 480px) {
        .success-modal {
          padding: 30px 20px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /* ── 10. Initialize ── */

  document.addEventListener('DOMContentLoaded', () => {
    injectFormStyles();
    initFloatingLabels();
    initNewsletterForm();
  });

  // Expose for manual use
  window.FoodwayForms = {
    initNewsletterForm,
    initFloatingLabels,
    showSuccessModal,
    validateReservationForm,
    validateEnquiryForm,
  };
})();