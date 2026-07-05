/* ============================================
   ICG Engineering Solutions - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ── Preloader ──
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.classList.add('hidden');
      setTimeout(() => preloader.remove(), 500);
    });
    // Fallback: hide preloader after 3 seconds regardless
    setTimeout(() => {
      preloader.classList.add('hidden');
      setTimeout(() => preloader.remove(), 500);
    }, 3000);
  }

  // ── Navbar Scroll Effect ──
  const navbar = document.querySelector('.navbar');
  const handleNavbarScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll();

  // ── Mobile Menu Toggle ──
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    // Close on overlay click
    if (mobileMenuOverlay) {
      mobileMenuOverlay.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    }

    // Close on link click
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // ── Scroll Reveal Animations ──
  const animatedElements = document.querySelectorAll(
    '.fade-in-up, .fade-in-left, .fade-in-right, .scale-in'
  );

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add stagger delay based on index within parent
        const parent = entry.target.parentElement;
        if (parent) {
          const siblings = parent.querySelectorAll(
            '.fade-in-up, .fade-in-left, .fade-in-right, .scale-in'
          );
          const index = Array.from(siblings).indexOf(entry.target);
          entry.target.style.transitionDelay = `${index * 0.1}s`;
        }
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => scrollObserver.observe(el));

  // ── Stats Counter Animation ──
  const statNumbers = document.querySelectorAll('.stat-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target')) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000;
        const startTime = performance.now();

        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(target * eased);

          el.textContent = current.toLocaleString() + suffix;

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  // ── Project Filtering ──
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          card.style.display = '';
          card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ── Testimonial Slider ──
  const testimonialSlider = document.querySelector('.testimonial-slider');
  const testimonials = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.testimonial-dots .dot');
  const prevBtn = document.querySelector('.testimonial-arrow.prev');
  const nextBtn = document.querySelector('.testimonial-arrow.next');
  let currentSlide = 0;
  let slideInterval;

  const showSlide = (index) => {
    if (testimonials.length === 0) return;

    currentSlide = ((index % testimonials.length) + testimonials.length) % testimonials.length;

    testimonials.forEach((t, i) => {
      t.classList.remove('active');
      t.style.opacity = '0';
      t.style.transform = 'translateX(50px)';
      t.style.position = 'absolute';
      t.style.pointerEvents = 'none';
    });

    testimonials[currentSlide].classList.add('active');
    testimonials[currentSlide].style.opacity = '1';
    testimonials[currentSlide].style.transform = 'translateX(0)';
    testimonials[currentSlide].style.position = 'relative';
    testimonials[currentSlide].style.pointerEvents = 'auto';

    dots.forEach((d, i) => {
      d.classList.toggle('active', i === currentSlide);
    });
  };

  const nextSlide = () => showSlide(currentSlide + 1);
  const prevSlide = () => showSlide(currentSlide - 1);

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { showSlide(i); resetAutoSlide(); });
  });

  const startAutoSlide = () => {
    slideInterval = setInterval(nextSlide, 5000);
  };

  const resetAutoSlide = () => {
    clearInterval(slideInterval);
    startAutoSlide();
  };

  if (testimonials.length > 0) {
    showSlide(0);
    startAutoSlide();
  }

  // ── FAQ Accordion ──
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all
        faqItems.forEach(i => i.classList.remove('active'));

        // Toggle current
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // ── Contact Form Validation ──
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    const validateField = (field) => {
      const group = field.closest('.form-group');
      if (!group) return true;

      let isValid = true;

      if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
      }

      if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(field.value.trim());
      }

      if (field.type === 'tel' && field.value.trim()) {
        const phoneRegex = /^[\d\s\-\+\(\)]{7,20}$/;
        isValid = phoneRegex.test(field.value.trim());
      }

      group.classList.toggle('error', !isValid);
      group.classList.toggle('success', isValid && field.value.trim());

      return isValid;
    };

    // Real-time validation
    const formFields = contactForm.querySelectorAll('input, textarea, select');
    formFields.forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.closest('.form-group').classList.contains('error')) {
          validateField(field);
        }
      });
    });

    // Form submission
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isFormValid = true;
      formFields.forEach(field => {
        if (!validateField(field)) isFormValid = false;
      });

      if (isFormValid) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        // Simulate submission
        setTimeout(() => {
          submitBtn.textContent = '✓ Message Sent!';
          submitBtn.style.background = '#00A86B';

          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.background = '';
            contactForm.reset();
            formFields.forEach(f => {
              const g = f.closest('.form-group');
              if (g) {
                g.classList.remove('success', 'error');
              }
            });
          }, 3000);
        }, 1500);
      }
    });
  }

  // ── Back to Top Button ──
  const backToTop = document.querySelector('.back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Smooth Scroll for Anchor Links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const top = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── Active Nav Link Highlight ──
  const navLinks = document.querySelectorAll('.nav-links a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── Floating Label Effect ──
  const formGroups = document.querySelectorAll('.form-group');
  formGroups.forEach(group => {
    const input = group.querySelector('input, textarea, select');
    const label = group.querySelector('label');

    if (input && label) {
      const checkValue = () => {
        if (input.value.trim() || document.activeElement === input) {
          group.classList.add('focused');
        } else {
          group.classList.remove('focused');
        }
      };

      input.addEventListener('focus', () => group.classList.add('focused'));
      input.addEventListener('blur', checkValue);
      input.addEventListener('input', checkValue);

      // Check on load
      checkValue();
    }
  });

  // ── Parallax Effect for Hero ──
  const hero = document.querySelector('#hero');
  if (hero) {
    const heroShapes = hero.querySelectorAll('.shape');
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroShapes.forEach((shape, i) => {
        const speed = 0.05 * (i + 1);
        shape.style.transform = `translateY(${scrolled * speed}px)`;
      });
    });
  }

  // ── Typed Text Effect for Hero (optional enhancement) ──
  const heroTitle = document.querySelector('.hero-content h1');
  if (heroTitle) {
    heroTitle.style.opacity = '1';
  }

  // ── Image Lazy Load Fallback ──
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  } else {
    // Fallback with IntersectionObserver
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }
});

/* ── CSS Animation Keyframe Injection ── */
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);
