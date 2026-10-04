/**
 * QSkip Landing Page Scripts
 * Handles navigation toggling, scroll-spy section highlighting,
 * sticky navbar elevation, and Georgian client-side form validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const siteHeader = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const yearSpan = document.getElementById('yearSpan');

  // Contact Form Elements
  const contactForm = document.getElementById('qskipContactForm');
  const submitButton = document.getElementById('submitButton');
  const formFeedback = document.getElementById('formFeedback');

  const userNameInput = document.getElementById('userName');
  const userEmailInput = document.getElementById('userEmail');
  const userMessageInput = document.getElementById('userMessage');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  // 1. Dynamic Year in Footer
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 2. Sticky Header Elevation on Scroll
  const handleHeaderScroll = () => {
    if (window.scrollY > 20) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // 3. Mobile Navigation Toggle
  const toggleMobileNav = () => {
    const isExpanded = navMenu.classList.toggle('open');
    menuToggle.classList.toggle('open', isExpanded);
    menuToggle.setAttribute('aria-expanded', String(isExpanded));
  };

  const closeMobileNav = () => {
    navMenu.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMobileNav);
  }

  // Close mobile nav when clicking outside or clicking any nav link
  document.addEventListener('click', (e) => {
    if (navMenu && menuToggle && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      closeMobileNav();
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });

  // Close mobile menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('open')) {
      closeMobileNav();
      menuToggle.focus();
    }
  });

  // 4. Scroll-Spy / Section Highlighting
  const sections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentSectionId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const targetHref = link.getAttribute('href').replace('#', '');
            if (targetHref === currentSectionId) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // 5. Contact Form Validation in Georgian
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const setFieldError = (inputElement, errorElement, messageText) => {
    inputElement.classList.add('input-error');
    errorElement.textContent = messageText;
  };

  const clearFieldError = (inputElement, errorElement) => {
    inputElement.classList.remove('input-error');
    errorElement.textContent = '';
  };

  // Live validation on input
  userNameInput.addEventListener('input', () => {
    if (userNameInput.value.trim().length >= 2) {
      clearFieldError(userNameInput, nameError);
    }
  });

  userEmailInput.addEventListener('input', () => {
    if (emailRegex.test(userEmailInput.value.trim())) {
      clearFieldError(userEmailInput, emailError);
    }
  });

  userMessageInput.addEventListener('input', () => {
    if (userMessageInput.value.trim().length >= 10) {
      clearFieldError(userMessageInput, messageError);
    }
  });

  const validateQSkipForm = () => {
    let isValid = true;

    // Validate Name
    const nameVal = userNameInput.value.trim();
    if (!nameVal) {
      setFieldError(userNameInput, nameError, 'გთხოვთ მიუთითოთ თქვენი სახელი და გვარი.');
      isValid = false;
    } else if (nameVal.length < 2) {
      setFieldError(userNameInput, nameError, 'სახელი უნდა შედგებოდეს მინიმუმ 2 სიმბოლოსგან.');
      isValid = false;
    } else {
      clearFieldError(userNameInput, nameError);
    }

    // Validate Email
    const emailVal = userEmailInput.value.trim();
    if (!emailVal) {
      setFieldError(userEmailInput, emailError, 'გთხოვთ მიუთითოთ ელ-ფოსტის მისამართი.');
      isValid = false;
    } else if (!emailRegex.test(emailVal)) {
      setFieldError(userEmailInput, emailError, 'გთხოვთ მიუთითოთ სწორი ფორმატის ელ-ფოსტა (მაგ: user@example.com).');
      isValid = false;
    } else {
      clearFieldError(userEmailInput, emailError);
    }

    // Validate Message
    const msgVal = userMessageInput.value.trim();
    if (!msgVal) {
      setFieldError(userMessageInput, messageError, 'გთხოვთ ჩაწეროთ თქვენი შეტყობინება.');
      isValid = false;
    } else if (msgVal.length < 10) {
      setFieldError(userMessageInput, messageError, 'შეტყობინება უნდა შედგებოდეს მინიმუმ 10 სიმბოლოსგან.');
      isValid = false;
    } else {
      clearFieldError(userMessageInput, messageError);
    }

    return isValid;
  };

  // Form Submit Handler
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Reset previous alerts
      formFeedback.hidden = true;
      formFeedback.className = 'form-feedback';
      formFeedback.textContent = '';

      if (!validateQSkipForm()) {
        return;
      }

      // Enter loading state
      const btnText = submitButton.querySelector('.btn-text');
      const btnLoader = submitButton.querySelector('.btn-loader');

      submitButton.disabled = true;
      btnText.textContent = 'იგზავნება...';
      btnLoader.style.display = 'inline-block';

      // Simulate API submission
      setTimeout(() => {
        submitButton.disabled = false;
        btnText.textContent = 'გაგზავნა';
        btnLoader.style.display = 'none';

        // Show Georgian success confirmation
        formFeedback.textContent = 'გმადლობთ! თქვენი შეტყობინება წარმატებით გაიგზავნა. QSkip-ის გუნდი უმოკლეს დროში დაგიკავშირდებათ.';
        formFeedback.classList.add('success');
        formFeedback.hidden = false;

        // Reset form inputs
        contactForm.reset();
      }, 1000);
    });
  }
});
