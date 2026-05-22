// ===== NIGHT STARS CANVAS (only for nacht section) =====
(function () {
  const canvas = document.getElementById('night-stars-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let stars = [];
  let W, H;
  let animId;

  function resize() {
    const section = canvas.closest('.nacht-section') || canvas.parentElement;
    W = canvas.width  = section ? section.offsetWidth : window.innerWidth;
    H = canvas.height = section ? section.offsetHeight : window.innerHeight;
    generateStars();
  }

  function generateStars() {
    const count = Math.floor((W * H) / 6000);
    stars = Array.from({ length: count }, () => ({
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 1.4 + 0.3,
      a:     Math.random() * 0.85 + 0.15,
      speed: Math.random() * 0.005 + 0.001,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      const alpha = s.a * (0.45 + 0.55 * Math.sin(t * s.speed * 1000 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(210, 235, 255, ${alpha})`;
      ctx.fill();
    });
    animId = requestAnimationFrame(draw);
  }

  // Only animate when visible
  const nachtSection = document.querySelector('.nacht-section');
  if (nachtSection && 'IntersectionObserver' in window) {
    const visObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          resize();
          animId = requestAnimationFrame(draw);
        } else {
          cancelAnimationFrame(animId);
        }
      });
    }, { threshold: 0.05 });
    visObs.observe(nachtSection);
  } else {
    resize();
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
  }, { passive: true });
})();


// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}


// ===== DAY TABS =====
const dayTabs    = document.querySelectorAll('.day-tab');
const tabContents = document.querySelectorAll('.tab-content');

dayTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    dayTabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    tab.classList.add('active');
    const targetContent = document.getElementById(`tab-${target}`);
    if (targetContent) {
      targetContent.classList.add('active');
      // Trigger fade-in for newly visible cards
      const newCards = targetContent.querySelectorAll('.fade-card:not(.visible)');
      newCards.forEach((card, i) => {
        setTimeout(() => {
          card.classList.add('visible');
        }, i * 80);
      });
    }
  });
});


// ===== INTERSECTION OBSERVER — FADE IN CARDS =====
const fadeTargets = document.querySelectorAll('.fade-card, .fade-card-dark');

if ('IntersectionObserver' in window) {
  const fadeObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Stagger siblings slightly
        const siblings = Array.from(
          (entry.target.parentElement || document).querySelectorAll('.fade-card, .fade-card-dark')
        );
        const i = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Math.min(i * 70, 350));
        fadeObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  fadeTargets.forEach(el => fadeObs.observe(el));
} else {
  // Fallback: show all immediately
  fadeTargets.forEach(el => el.classList.add('visible'));
}


// ===== ACTIVE NAV HIGHLIGHT =====
const sections  = document.querySelectorAll('section[id], header[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

if (navLinks.length && 'IntersectionObserver' in window) {
  const navObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => {
          l.style.color = '';
          l.style.fontWeight = '';
        });
        const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (active) {
          active.style.color = 'var(--gold-dark)';
        }
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

  sections.forEach(s => navObs.observe(s));
}


// ===== PARALLAX ON HERO ELEMENTS =====
const heroSymbol = document.querySelector('.hero-symbol');
const heroLaurel = document.querySelector('.hero-laurel');

if (heroSymbol || heroLaurel) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (heroSymbol) {
          heroSymbol.style.transform = `translateY(${Math.min(y * 0.12, 20)}px)`;
        }
        if (heroLaurel) {
          heroLaurel.style.transform = `translateY(${Math.min(y * 0.06, 10)}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}


// ===== LEADERBOARD PULSE ANIMATION =====
const lbRowGold = document.querySelector('.lb-row-gold');
if (lbRowGold) {
  let pulse = false;
  setInterval(() => {
    pulse = !pulse;
    lbRowGold.style.background = pulse
      ? 'rgba(201,162,39,0.12)'
      : 'rgba(201,162,39,0.06)';
  }, 2500);
}


// ===== NACHT SECTION DRAMATIC REVEAL =====
const nachtTitle = document.querySelector('.nacht-title');
if (nachtTitle && 'IntersectionObserver' in window) {
  const nachtObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        nachtTitle.style.transition = 'text-shadow 1.5s ease';
        nachtTitle.style.textShadow = '0 0 60px rgba(74,142,203,0.35), 0 0 120px rgba(74,142,203,0.15)';
        nachtObs.disconnect();
      }
    });
  }, { threshold: 0.4 });
  nachtObs.observe(nachtTitle);
}


// ===== SYMBOL RING HOVER SPEED-UP =====
const symbolRings = document.querySelectorAll('.symbol-ring');
const heroEl = document.querySelector('.hero');
if (heroEl && symbolRings.length) {
  heroEl.addEventListener('mousemove', (e) => {
    const rect = heroEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    const dist = Math.sqrt(dx * dx + dy * dy);
    symbolRings.forEach((ring, i) => {
      const base = [24, 16, 25][i] || 20;
      const speed = base - dist * 8;
      ring.style.animationDuration = `${Math.max(speed, 8)}s`;
    });
  });
}


// ===== SCROLL TO SECTION SMOOTH (CTA button) =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      const offset = 70;
      const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


// ===== CHAMPION BADGE GLOW PULSE =====
const championBadge = document.querySelector('.podium-champion-badge');
if (championBadge) {
  let glowOn = false;
  setInterval(() => {
    glowOn = !glowOn;
    championBadge.style.boxShadow = glowOn
      ? '0 0 24px rgba(201,162,39,0.65)'
      : '0 4px 16px rgba(201,162,39,0.4)';
  }, 2000);
}
