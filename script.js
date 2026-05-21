// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ===== LEADERBOARD BAR ANIMATION =====
const lbObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.lb-bar').forEach(bar => {
        const target = bar.style.width;
        bar.style.width = '0%';
        requestAnimationFrame(() => {
          bar.style.transition = 'width 1.4s cubic-bezier(0.4,0,0.2,1)';
          bar.style.width = target;
        });
      });
      lbObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

const lb = document.querySelector('.leaderboard-mockup');
if (lb) lbObserver.observe(lb);

// ===== GLITCH TITLE MANUAL TRIGGER =====
const title = document.getElementById('glitch-title');
if (title) {
  setInterval(() => {
    title.classList.add('glitching');
    setTimeout(() => title.classList.remove('glitching'), 300);
  }, 5000);
}

// ===== NIGHT ALARM AUDIO HINT (no actual sound) =====
const alarmBlock = document.querySelector('.night-alarm-block');
if (alarmBlock) {
  const alarmObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        alarmBlock.style.transition = 'box-shadow 0.3s ease';
        alarmBlock.style.boxShadow = '0 0 60px rgba(255,34,51,0.15)';
      } else {
        alarmBlock.style.boxShadow = '';
      }
    });
  }, { threshold: 0.2 });
  alarmObserver.observe(alarmBlock);
}

// ===== FADE IN ON SCROLL =====
const fadeEls = document.querySelectorAll('.pillar, .upgrade-card, .prize-card, .op-card, .sidebar-card');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      e.target.style.opacity = '0';
      e.target.style.transform = 'translateY(16px)';
      setTimeout(() => {
        e.target.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        e.target.style.opacity = '1';
        e.target.style.transform = 'none';
      }, 60);
      fadeObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach(el => {
  el.style.opacity = '0';
  fadeObserver.observe(el);
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) active.style.color = 'var(--green)';
    }
  });
}, { rootMargin: '-40% 0px -40% 0px' });

sections.forEach(s => navObserver.observe(s));

// ===== GRID OVERLAY PARALLAX (subtle) =====
const gridOverlay = document.querySelector('.hero-grid-overlay');
if (gridOverlay) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY * 0.1;
    gridOverlay.style.backgroundPosition = `0 ${y}px, 0 ${y}px`;
  }, { passive: true });
}

// ===== TYPEWRITER for classified tags =====
document.querySelectorAll('.classified-tag').forEach((el, i) => {
  const text = el.textContent;
  el.textContent = '';
  el.style.opacity = '1';
  let j = 0;
  setTimeout(() => {
    const interval = setInterval(() => {
      el.textContent = text.slice(0, j + 1);
      j++;
      if (j >= text.length) clearInterval(interval);
    }, 40);
  }, 400 + i * 200);
});
