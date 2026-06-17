/* ============================================
   Shri Sangameshwara Swamy Temple — Main JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  initScrollReveal();
  initHeroParticles();
  initSmoothScroll();
  initCounterAnimation();
  initGalleryFilters();
  initLightbox();
  initFaqAccordion();
  initContactForm();
  initFloatingLeaves();
  initParallaxSections();
  initMapPlaceholder();
  initBackToTop();
  initForestJourney();
});

/* ── Page Loader ── */
function initLoader() {
  const loader = document.querySelector('.loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 800);
  });

  // Fallback: hide loader after 3s max
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 3000);
}

/* ── Navbar ── */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.navbar__toggle');
  const links = document.querySelector('.navbar__links');
  const overlay = document.querySelector('.navbar__overlay');
  const navLinks = document.querySelectorAll('.navbar__link');

  if (!navbar) return;

  // Scroll effect
  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Update active link based on scroll position
    updateActiveLink();
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // Mobile menu toggle
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
      if (overlay) overlay.classList.toggle('visible');
      document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu on overlay click
    if (overlay) {
      overlay.addEventListener('click', () => {
        toggle.classList.remove('open');
        links.classList.remove('open');
        overlay.classList.remove('visible');
        document.body.style.overflow = '';
      });
    }

    // Close menu on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        links.classList.remove('open');
        if (overlay) overlay.classList.remove('visible');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ── Active Nav Link ── */
function updateActiveLink() {
  // Only update active link on pages with hash-based navigation (homepage)
  const navLinks = document.querySelectorAll('.navbar__link[href^="#"]');
  if (!navLinks.length) return; // On subpages, nav links point to other files, not #sections

  const sections = document.querySelectorAll('section[id]');
  let currentSection = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });

  // Only toggle active on hash-based links (homepage)
  document.querySelectorAll('.navbar__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      link.classList.remove('active');
      if (href === `#${currentSection}`) {
        link.classList.add('active');
      }
    }
  });
}

/* ── Scroll Reveal ── */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');

  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ── Hero Particles ── */
function initHeroParticles() {
  const container = document.querySelector('.hero__particles');
  if (!container) return;

  const particleCount = 25;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('hero__particle');

    // Random positioning
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = (6 + Math.random() * 6) + 's';

    // Random size
    const size = 2 + Math.random() * 3;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';

    // Random opacity
    particle.style.opacity = 0.2 + Math.random() * 0.5;

    container.appendChild(particle);
  }
}

/* ── Smooth Scroll ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId.length <= 1) return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = document.querySelector('.navbar')?.offsetHeight || 80;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Hero scroll indicator
  const scrollIndicator = document.querySelector('.hero__scroll');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const intro = document.querySelector('#about');
      if (intro) {
        const navHeight = document.querySelector('.navbar')?.offsetHeight || 80;
        window.scrollTo({
          top: intro.getBoundingClientRect().top + window.scrollY - navHeight,
          behavior: 'smooth'
        });
      }
    });
  }
}

/* ── Number Counter Animation ── */
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const endVal = parseInt(target.getAttribute('data-counter'), 10);
        const duration = 2000;
        const startTime = performance.now();

        const animate = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(eased * endVal);

          target.textContent = current + (target.getAttribute('data-suffix') || '');

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            target.textContent = endVal + (target.getAttribute('data-suffix') || '');
          }
        };

        requestAnimationFrame(animate);
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(el => observer.observe(el));
}

/* ── Parallax Sections ── */
function initParallaxSections() {
  const parallaxBgs = document.querySelectorAll('.parallax-section__bg');
  const heroBg = document.querySelector('.hero__bg img');

  const handleParallax = () => {
    if (window.innerWidth < 768) return; // Disable on small screens for performance

    const scrolled = window.scrollY;

    // Hero Parallax
    if (heroBg) {
      heroBg.style.transform = `translateY(${scrolled * 0.3}px) scale(1.1)`;
    }

    // Section Parallax
    parallaxBgs.forEach(bg => {
      const parent = bg.parentElement;
      const rect = parent.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Check if section is visible in viewport
      if (rect.top < viewportHeight && rect.bottom > 0) {
        // Calculate offset (how far the section is from screen center)
        const parentCenter = rect.top + rect.height / 2;
        const screenCenter = viewportHeight / 2;
        const offset = (parentCenter - screenCenter) * 0.25;

        bg.style.transform = `translateY(${offset}px) scale(1.15)`;
      }
    });
  };

  window.addEventListener('scroll', handleParallax, { passive: true });
  handleParallax(); // Run initial position alignment
}

/* ── Gallery Filtering ── */
function initGalleryFilters() {
  const tabs = document.querySelectorAll('.gallery-tab');
  const items = document.querySelectorAll('.masonry-item');
  if (!tabs.length || !items.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Toggle active classes
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.getAttribute('data-filter');

      items.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

/* ── Lightbox Image Viewer ── */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const items = document.querySelectorAll('.masonry-item');
  if (!lightbox || !items.length) return;

  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCat = document.getElementById('lightbox-cat');
  const lightboxCap = document.getElementById('lightbox-cap');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  let activeIndex = 0;
  let activeItems = []; // Contains only currently visible items based on filters!

  // Update active items list
  const updateActiveItems = () => {
    activeItems = Array.from(items).filter(item => !item.classList.contains('hidden'));
  };

  const showImage = (index) => {
    if (index < 0 || index >= activeItems.length) return;
    activeIndex = index;
    const item = activeItems[index];
    const img = item.querySelector('img');
    const title = item.querySelector('.masonry-item__title')?.textContent || img.alt;
    const cat = item.querySelector('.masonry-item__category')?.textContent || item.getAttribute('data-category');

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCat.textContent = cat;
    lightboxCap.textContent = title;
  };

  // Open Lightbox
  items.forEach(item => {
    item.addEventListener('click', () => {
      updateActiveItems();
      const index = activeItems.indexOf(item);
      if (index !== -1) {
        showImage(index);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock scrolling
      }
    });
  });

  // Close Lightbox
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Unlock scrolling
  };

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Next / Prev Navigation
  const navigateNext = () => {
    if (activeItems.length === 0) return;
    let nextIndex = activeIndex + 1;
    if (nextIndex >= activeItems.length) nextIndex = 0;
    showImage(nextIndex);
  };

  const navigatePrev = () => {
    if (activeItems.length === 0) return;
    let prevIndex = activeIndex - 1;
    if (prevIndex < 0) prevIndex = activeItems.length - 1;
    showImage(prevIndex);
  };

  if (nextBtn) nextBtn.addEventListener('click', navigateNext);
  if (prevBtn) prevBtn.addEventListener('click', navigatePrev);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') navigateNext();
    if (e.key === 'ArrowLeft') navigatePrev();
  });
}

/* ── FAQ Accordion ── */
function initFaqAccordion() {
  const questions = document.querySelectorAll('.faq-question');
  if (!questions.length) return;

  questions.forEach(question => {
    question.addEventListener('click', () => {
      const parent = question.parentElement;
      const answer = question.nextElementSibling;
      const isActive = parent.classList.contains('active');

      // Close all other accordions first for accordion exclusivity
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        const ans = item.querySelector('.faq-answer');
        if (ans) ans.style.maxHeight = '0px';
        const btn = item.querySelector('.faq-question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        parent.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        parent.classList.remove('active');
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0px';
      }
    });
  });
}

/* ── Contact Form Validation ── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const successAlert = document.getElementById('formSuccess');
  const errorAlert = document.getElementById('formError');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simple verification check
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();
    const subject = document.getElementById('form-subject').value;

    if (!name || !email || !message || !subject) {
      if (errorAlert) {
        errorAlert.style.display = 'block';
        successAlert.style.display = 'none';
        setTimeout(() => { errorAlert.style.display = 'none'; }, 4000);
      }
      return;
    }

    // Success response simulation
    if (successAlert) {
      successAlert.style.display = 'block';
      if (errorAlert) errorAlert.style.display = 'none';
      form.reset();
      
      // Floating label reset visual trigger
      document.querySelectorAll('.form-control').forEach(input => {
        input.dispatchEvent(new Event('change'));
      });

      setTimeout(() => { successAlert.style.display = 'none'; }, 6000);
    }
  });

  // Autofill and visual fix for labels
  const inputs = document.querySelectorAll('.form-control');
  inputs.forEach(input => {
    const handleInput = () => {
      if (input.value.trim() !== '') {
        input.setAttribute('value', input.value);
      } else {
        input.removeAttribute('value');
      }
    };
    input.addEventListener('blur', handleInput);
    input.addEventListener('change', handleInput);
  });
}

/* ── Floating Leaves Spawner ── */
function initFloatingLeaves() {
  // Disable on mobile/tablet for performance optimization
  if (window.innerWidth < 768) return;

  const body = document.body;
  const leavesContainer = document.createElement('div');
  leavesContainer.classList.add('leaves-container');
  leavesContainer.setAttribute('aria-hidden', 'true');
  body.appendChild(leavesContainer);

  const leafSVGs = [
    // Leaf Type 1 (standard)
    `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 0C50 0 85 30 85 60C85 85 65 95 50 100C35 95 15 85 15 60C15 30 50 0 50 0Z"/></svg>`,
    // Leaf Type 2 (elongated)
    `<svg viewBox="0 0 120 80" fill="currentColor"><path d="M0 40C0 40 40 10 80 10C100 10 120 25 120 40C120 55 100 70 80 70C40 70 0 40 0 40Z"/></svg>`,
    // Leaf Type 3 (asymmetric)
    `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M10 90C40 90 80 70 90 40C95 20 85 10 70 10C40 10 20 50 10 90Z"/></svg>`
  ];

  const maxLeaves = 15;
  let activeLeavesCount = 0;

  const colors = [
    'rgba(30, 122, 88, 0.25)', // Forest light green
    'rgba(11, 61, 46, 0.2)',   // Forest deep green
    'rgba(212, 175, 55, 0.25)', // Gold primary
    'rgba(232, 200, 74, 0.2)'  // Gold light
  ];

  const spawnLeaf = () => {
    if (activeLeavesCount >= maxLeaves) return;

    const leaf = document.createElement('div');
    leaf.classList.add('leaf-particle');
    
    // Choose random shape and color
    const svg = leafSVGs[Math.floor(Math.random() * leafSVGs.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    leaf.innerHTML = svg;
    leaf.style.color = color;

    // Randomize properties
    const size = 15 + Math.random() * 25; // 15px to 40px
    const startX = Math.random() * 100; // 0% to 100% width
    const duration = 10 + Math.random() * 10; // 10s to 20s
    const delay = Math.random() * 5; // 0s to 5s delay
    const initialRot = Math.random() * 360;
    
    leaf.style.width = size + 'px';
    leaf.style.height = size + 'px';
    leaf.style.left = startX + 'vw';
    leaf.style.transform = `rotate(${initialRot}deg)`;
    
    // Combine animations: falling, swaying, and rotating
    leaf.style.animation = `leafFall ${duration}s linear ${delay}s infinite`;

    leavesContainer.appendChild(leaf);
    activeLeavesCount++;

    // Remove leaf when animation cycle is done
    setTimeout(() => {
      leaf.remove();
      activeLeavesCount--;
    }, (duration + delay) * 1000);
  };

  // Start spawning leaves
  for (let i = 0; i < 6; i++) {
    spawnLeaf();
  }

  setInterval(spawnLeaf, 3000);
}

/* ── Interactive Map Lazy Loader ── */
function initMapPlaceholder() {
  const placeholder = document.getElementById('mapPlaceholder');
  if (!placeholder) return;

  const iframe = placeholder.nextElementSibling;
  const loadBtn = document.getElementById('loadMapBtn');

  const loadMap = () => {
    if (iframe && iframe.getAttribute('data-src')) {
      iframe.src = iframe.getAttribute('data-src');
      placeholder.style.opacity = '0';
      setTimeout(() => {
        placeholder.style.display = 'none';
      }, 500);
    }
  };

  placeholder.addEventListener('click', loadMap);
  if (loadBtn) {
    loadBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Stop parent click event
      loadMap();
    });
  }
}

/* ── Back to Top Button ── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ── Sacred Forest Journey ── */
function initForestJourney() {
  const cards = document.querySelectorAll('.temple-bar-card');
  const markers = document.querySelectorAll('.map-marker');
  const timelineItems = document.querySelectorAll('.mobile-timeline-item');
  const path = document.getElementById('pilgrimage-path');
  const startBtn = document.getElementById('startJourneyBtn');
  const dots = document.querySelectorAll('.slider-dot');
  const slides = document.querySelectorAll('.message-slide');
  const listenBtn = document.getElementById('listenMantraBtn');

  if (!cards.length) return;

  // 1. Hover / click connections
  const activateTemple = (templeId) => {
    // Deactivate all
    cards.forEach(c => c.classList.remove('active'));
    markers.forEach(m => m.classList.remove('active'));
    timelineItems.forEach(t => t.classList.remove('active'));

    // Activate specific temple items
    const activeCard = document.querySelector(`.temple-bar-card[data-temple="${templeId}"]`);
    const activeMarker = document.querySelector(`.map-marker[data-temple="${templeId}"]`);
    const activeTimeline = document.querySelector(`.mobile-timeline-item[data-temple="${templeId}"]`);

    if (activeCard) {
      activeCard.classList.add('active');
      // Scroll card into view inside the scrollable temple-bar
      activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    if (activeMarker) activeMarker.classList.add('active');
    if (activeTimeline) activeTimeline.classList.add('active');
  };

  // Bind bar cards
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const id = card.getAttribute('data-temple');
      activateTemple(id);
    });
  });

  // Bind map markers
  markers.forEach(marker => {
    marker.addEventListener('mouseenter', () => {
      const id = marker.getAttribute('data-temple');
      activateTemple(id);
    });
    marker.addEventListener('click', () => {
      const id = marker.getAttribute('data-temple');
      activateTemple(id);
    });
  });

  // Bind mobile timeline items
  timelineItems.forEach(item => {
    item.addEventListener('click', () => {
      const id = item.getAttribute('data-temple');
      activateTemple(id);
    });
  });

  // 2. SVG Path Drawing / Journey walkthrough animation
  // Set path length initially
  if (path) {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    path.classList.add('traced');
  }

  let journeyInterval = null;
  const startJourneyWalk = () => {
    if (journeyInterval) clearInterval(journeyInterval);
    if (!path) return;

    let currentStep = 1;
    const totalSteps = 6;
    const length = path.getTotalLength();

    // Trigger path drawing animation
    path.style.transition = 'none';
    path.style.strokeDashoffset = length;
    
    // Force reflow
    path.getBoundingClientRect();
    
    path.style.transition = 'stroke-dashoffset 6s linear';
    path.style.strokeDashoffset = '0';

    // Step sequence trigger
    activateTemple(1);
    
    journeyInterval = setInterval(() => {
      currentStep++;
      if (currentStep <= totalSteps) {
        activateTemple(currentStep);
      } else {
        clearInterval(journeyInterval);
        journeyInterval = null;
      }
    }, 1000); // Highlight temple every second
  };

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      startJourneyWalk();
      startBtn.style.transform = 'scale(0.95)';
      setTimeout(() => startBtn.style.transform = '', 150);
    });
  }

  // Trace path on scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && path) {
        path.style.strokeDashoffset = '0';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const section = document.querySelector('.forest-journey');
  if (section) observer.observe(section);

  // 3. Quotes Slider
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetSlideId = dot.getAttribute('data-slide');
      
      // Update dots
      dots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');

      // Update slides
      slides.forEach(slide => {
        slide.classList.remove('active');
        if (slide.getAttribute('data-slide') === targetSlideId) {
          slide.classList.add('active');
        }
      });
    });
  });

  // Auto slide quotes every 8 seconds
  let autoSlideInterval = setInterval(() => {
    const activeDot = document.querySelector('.slider-dot.active');
    if (!activeDot) return;
    
    let nextIndex = Array.from(dots).indexOf(activeDot) + 1;
    if (nextIndex >= dots.length) nextIndex = 0;
    
    dots[nextIndex].click();
  }, 8000);

  // Clear auto-slide on manual dot click
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(autoSlideInterval);
    });
  });

  // 4. Web Audio API Temple Bell & TTS Speech Synthesis for Mantras
  let isSpeaking = false;
  
  const playTempleBell = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(150, ctx.currentTime); // Deep hum fundamental
      
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(300, ctx.currentTime); // Ring overtone
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.05); // Attack
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.0); // Decay
      
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 3.0);
      osc2.stop(ctx.currentTime + 3.0);
    } catch (e) {
      console.warn("Web Audio API blocked or not supported:", e);
    }
  };

  const speakMantra = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      isSpeaking = false;
      listenBtn.innerHTML = `
        Listen
        <svg class="listen-btn__icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        </svg>
      `;
      return;
    }

    playTempleBell();
    
    const activeSlide = document.querySelector('.message-slide.active');
    if (!activeSlide) return;
    
    const sanskritText = activeSlide.querySelector('.message-sanskrit').textContent;
    const translationText = activeSlide.querySelector('.message-quote').textContent;
    
    const utterance = new SpeechSynthesisUtterance(sanskritText);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.7;
    utterance.pitch = 0.95;

    utterance.onstart = () => {
      isSpeaking = true;
      listenBtn.innerHTML = `
        Stop
        <svg class="listen-btn__icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>
      `;
    };

    utterance.onend = () => {
      isSpeaking = false;
      listenBtn.innerHTML = `
        Listen
        <svg class="listen-btn__icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        </svg>
      `;
    };

    utterance.onerror = () => {
      isSpeaking = false;
    };

    window.speechSynthesis.speak(utterance);
    
    setTimeout(() => {
      if (isSpeaking) {
        const translationUtterance = new SpeechSynthesisUtterance(translationText);
        translationUtterance.lang = 'en-US';
        translationUtterance.rate = 0.85;
        translationUtterance.pitch = 1.0;
        translationUtterance.onend = () => {
          isSpeaking = false;
          listenBtn.innerHTML = `
            Listen
            <svg class="listen-btn__icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          `;
        };
        window.speechSynthesis.speak(translationUtterance);
      }
    }, 4500);
  };

  if (listenBtn) {
    listenBtn.addEventListener('click', speakMantra);
  }
}

