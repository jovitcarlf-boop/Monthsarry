/* =============================================
   MONTHSARY GREETING — script.js
   ============================================= */

// ─────────────────────────────────────────────
// 1.  FLOATING PETALS (landing + main)
// ─────────────────────────────────────────────
function createPetals(containerId, count) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const emojis = ['🌸', '🌺', '✨', '💕', '🌷', '❤️', '💗'];

  for (let i = 0; i < count; i++) {
    const petal = document.createElement('div');
    petal.classList.add('petal');
    petal.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.fontSize = (Math.random() * 1 + 0.8) + 'rem';
    petal.style.animationDuration = (Math.random() * 6 + 6) + 's';
    petal.style.animationDelay = (Math.random() * 8) + 's';
    petal.style.opacity = Math.random() * 0.5 + 0.3;
    container.appendChild(petal);
  }
}

createPetals('petals', 18);       // landing screen petals
createPetals('mainPetals', 14);   // main content petals

// ─────────────────────────────────────────────
// 2.  OPEN BUTTON — reveal main content
// ─────────────────────────────────────────────
const openBtn     = document.getElementById('openBtn');
const landing     = document.getElementById('landing');
const mainContent = document.getElementById('mainContent');

openBtn.addEventListener('click', () => {
  landing.classList.add('hide');

  setTimeout(() => {
    landing.style.display = 'none';
    mainContent.classList.remove('hidden');

    // Try to auto-play music (may be blocked by browser, that's OK)
    const music = document.getElementById('bgMusic');
    music.play().catch(() => {
      // Browser blocked autoplay — user can press the play button manually
    });

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 850);
});

// ─────────────────────────────────────────────
// 3.  MUSIC PLAYER
// ─────────────────────────────────────────────
const bgMusic   = document.getElementById('bgMusic');
const musicBtn  = document.getElementById('musicBtn');
const musicIcon = document.getElementById('musicIcon');
let   isPlaying = false;

musicBtn.addEventListener('click', () => {
  if (isPlaying) {
    bgMusic.pause();
    musicIcon.textContent = '▶';
    isPlaying = false;
  } else {
    bgMusic.play().catch(err => {
      console.warn('Music play error:', err);
    });
    musicIcon.textContent = '⏸';
    isPlaying = true;
  }
});

// Keep icon in sync if music stops on its own
bgMusic.addEventListener('pause', () => {
  musicIcon.textContent = '▶';
  isPlaying = false;
});
bgMusic.addEventListener('play', () => {
  musicIcon.textContent = '⏸';
  isPlaying = true;
});

// ─────────────────────────────────────────────
// 4.  CAROUSEL
// ─────────────────────────────────────────────
const slides     = Array.from(document.querySelectorAll('.carousel-slide'));
const dotsWrap   = document.getElementById('carouselDots');
const prevBtn    = document.getElementById('prevBtn');
const nextBtn    = document.getElementById('nextBtn');
let   current    = 0;
let   autoTimer  = null;

// Build dots dynamically based on slide count
slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.classList.add('dot');
  dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goTo(i));
  dotsWrap.appendChild(dot);
});

const dots = Array.from(dotsWrap.querySelectorAll('.dot'));

function goTo(index) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (index + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
  resetAuto();
}

function resetAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(() => goTo(current + 1), 4500);
}

prevBtn.addEventListener('click', () => goTo(current - 1));
nextBtn.addEventListener('click', () => goTo(current + 1));

// Swipe support (touch devices)
let touchStartX = 0;
const carousel = document.getElementById('carousel');

carousel.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });

carousel.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
});

// Start auto-slide
resetAuto();

// ─────────────────────────────────────────────
// 5.  SCROLL FADE-IN (Intersection Observer)
// ─────────────────────────────────────────────
const fadeEls = document.querySelectorAll(
  '.message-section, .gallery-section, .reasons-section, .closing-section, .reason-card'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  observer.observe(el);
});