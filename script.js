/* =============================================
   NEUROCORP — script.js
   ============================================= */

// ---- Custom Cursor ----
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');
let mouseX = 0, mouseY = 0, curX = 0, curY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

function animateCursor() {
  curX += (mouseX - curX) * 0.12;
  curY += (mouseY - curY) * 0.12;
  cursor.style.left = curX + 'px';
  cursor.style.top = curY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, input, select, textarea, .upgrade-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
});

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ---- Mobile hamburger ----
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close nav on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ---- Counter Animation ----
function animateCounter(el, target, suffix) {
  const duration = 2000;
  const start = performance.now();
  const step = (timestamp) => {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

// ---- Intersection Observer for animations ----
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    // Counters
    if (entry.target.classList.contains('stat-num')) {
      const target = parseInt(entry.target.dataset.target);
      animateCounter(entry.target, target);
      io.unobserve(entry.target);
    }

    // Spec bars
    if (entry.target.classList.contains('spec-fill')) {
      entry.target.style.width = entry.target.dataset.width;
      io.unobserve(entry.target);
    }

    // Fade in cards
    if (entry.target.classList.contains('reveal')) {
      entry.target.classList.add('revealed');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.stat-num').forEach(el => io.observe(el));
document.querySelectorAll('.spec-fill').forEach(el => io.observe(el));

// ---- Staggered card reveals ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.upgrade-card, .spec-card, .testimonial').forEach((card, i) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s, border-color 0.3s, box-shadow 0.3s`;
  revealObserver.observe(card);
});

// ---- Contact form ----
const form = document.getElementById('contact-form');
form.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('.btn-primary');
  const original = btn.innerHTML;
  btn.innerHTML = '<span>TRANSMISSION SENT ✓</span>';
  btn.style.background = 'var(--cyan)';
  btn.style.color = '#000';
  setTimeout(() => {
    btn.innerHTML = original;
    btn.style.background = '';
    btn.style.color = '';
    form.reset();
  }, 3000);
});

// ---- Glitch title effect ----
const titleLines = document.querySelectorAll('.title-line');
setInterval(() => {
  titleLines.forEach(line => {
    line.style.textShadow = `${(Math.random()-0.5)*6}px 0 var(--cyan), ${(Math.random()-0.5)*4}px 0 var(--magenta)`;
    setTimeout(() => { line.style.textShadow = ''; }, 120);
  });
}, 4000);

// ---- Particle background ----
const canvas = document.createElement('canvas');
canvas.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:0;opacity:0.35;';
document.body.prepend(canvas);
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = Array.from({ length: 60 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 1.5 + 0.3,
  dx: (Math.random() - 0.5) * 0.4,
  dy: (Math.random() - 0.5) * 0.4,
  color: Math.random() > 0.5 ? '#00E5FF' : '#D500F9',
  alpha: Math.random() * 0.5 + 0.1
}));

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.alpha;
    ctx.fill();
    p.x += p.dx; p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });

  // Draw connecting lines
  ctx.globalAlpha = 1;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = particles[i].color;
        ctx.globalAlpha = (1 - dist / 120) * 0.12;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ---- Copy cyborg image to right folder ----
// (Image is referenced as cyborg_hero.png from index.html)

console.log('%cNEUROCORP SYSTEM INITIALIZED', 'color:#00E5FF;font-family:monospace;font-size:16px;font-weight:bold;');
console.log('%cv4.2.1 — All systems operational', 'color:#D500F9;font-family:monospace;');
