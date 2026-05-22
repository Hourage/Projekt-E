// ===== STAR FIELD CANVAS =====
(function () {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    generateStars();
  }

  function generateStars() {
    const count = Math.floor((W * H) / 8000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.2,
      a: Math.random(),
      speed: Math.random() * 0.004 + 0.001,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      const alpha = s.a * (0.5 + 0.5 * Math.sin(t * s.speed * 1000 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220,235,255,${alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
})();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ===== FADE-IN CARDS ON SCROLL =====
const fadeTargets = document.querySelectorAll(
  '.arena-card, .event-card, .station-olymp, .teamchall-card, .puzzle-olymp, .podium-card-olymp, .duel-block, .proto-card'
);

const fadeObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '0';
      entry.target.style.transform = 'translateY(18px)';
      setTimeout(() => {
        entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
      }, 50);
      // Mark arena cards as visible for CSS transition
      entry.target.classList.add('visible');
      fadeObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeTargets.forEach(el => {
  el.style.opacity = '0';
  fadeObs.observe(el);
});

// ===== ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) active.style.color = 'var(--gold-bright)';
    }
  });
}, { rootMargin: '-40% 0px -40% 0px' });

sections.forEach(s => navObs.observe(s));

// ===== ESCAPE TIMER COUNTDOWN ANIMATION (on scroll) =====
let timerStarted = false;
const timerEl = document.querySelector('.escape-timer-olymp');
if (timerEl) {
  const timerObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !timerStarted) {
        timerStarted = true;
        let secs = 3600;
        const display = timerEl;
        const spanEl = display.querySelector('span');
        const interval = setInterval(() => {
          secs--;
          if (secs <= 0) { clearInterval(interval); return; }
          const m = Math.floor(secs / 60);
          const s = secs % 60;
          const text = display.childNodes[0];
          if (text) text.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        }, 50);
        setTimeout(() => clearInterval(interval), 5000);
        timerObs.disconnect();
      }
    });
  }, { threshold: 0.5 });
  timerObs.observe(timerEl);
}

// ===== NACHT BLOCK GLOW ON SCROLL =====
const nachtBlock = document.querySelector('.nacht-block');
if (nachtBlock) {
  const nachtObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      nachtBlock.style.boxShadow = e.isIntersecting
        ? '0 0 80px rgba(74,142,203,0.1)'
        : '';
    });
  }, { threshold: 0.2 });
  nachtObs.observe(nachtBlock);
}

// ===== SMOOTH PARALLAX ON HERO EMBLEM =====
const emblem = document.querySelector('.hero-emblem');
if (emblem) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY * 0.15;
    emblem.style.transform = `translateY(${y}px)`;
  }, { passive: true });
}

// ===== LEADERBOARD CHAMPION LABEL PULSE =====
const champion = document.querySelector('.champion-label');
if (champion) {
  setInterval(() => {
    champion.style.boxShadow = '0 0 20px rgba(201,162,39,0.6)';
    setTimeout(() => { champion.style.boxShadow = ''; }, 800);
  }, 3000);
}

// ===== STAGGERED XP ROW ANIMATION =====
const xpRows = document.querySelectorAll('.xp-row');
const xpObs = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    xpRows.forEach((row, i) => {
      row.style.opacity = '0';
      row.style.transform = 'translateX(-10px)';
      setTimeout(() => {
        row.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        row.style.opacity = '1';
        row.style.transform = 'none';
      }, i * 60);
    });
    xpObs.disconnect();
  }
}, { threshold: 0.2 });
const xpTable = document.querySelector('.xp-table-grid');
if (xpTable) {
  xpRows.forEach(r => r.style.opacity = '0');
  xpObs.observe(xpTable);
}
