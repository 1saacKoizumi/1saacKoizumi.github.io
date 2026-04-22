// ═══════════════════════════════════════
// APOLLO SIM — CRT EFFECTS
// ═══════════════════════════════════════

// Typewriter effect for elements with data-type attribute
function typeWriter(el, text, speed = 18, callback) {
  el.textContent = '';
  let i = 0;
  const cursor = document.createElement('span');
  cursor.textContent = '█';
  cursor.style.animation = 'blink-cursor 1s step-end infinite';
  cursor.style.color = 'var(--green)';
  el.appendChild(cursor);

  function type() {
    if (i < text.length) {
      el.insertBefore(document.createTextNode(text[i]), cursor);
      i++;
      setTimeout(type, speed + (Math.random() * 10));
    } else {
      cursor.remove();
      if (callback) callback();
    }
  }
  type();
}

// Run typewriter on all [data-type] elements in sequence
function runTypewriters() {
  const els = document.querySelectorAll('[data-type]');
  if (els.length === 0) return;

  let index = 0;
  function next() {
    if (index >= els.length) return;
    const el = els[index];
    const text = el.getAttribute('data-type');
    const speed = parseInt(el.getAttribute('data-speed') || '18');
    index++;
    typeWriter(el, text, speed, next);
  }
  next();
}

// Random static glitch flash
function glitch() {
  const screen = document.querySelector('.crt-screen');
  if (!screen) return;

  const interval = 6000 + Math.random() * 14000;
  setTimeout(() => {
    screen.style.transform = `translateX(${(Math.random()-0.5)*3}px)`;
    screen.style.filter = `brightness(1.3) contrast(1.1)`;
    setTimeout(() => {
      screen.style.transform = '';
      screen.style.filter = '';
      glitch();
    }, 60 + Math.random() * 80);
  }, interval);
}

// Page transition: flicker out before navigating
function navigateTo(url) {
  const screen = document.querySelector('.crt-screen');
  if (!screen) { window.location.href = url; return; }

  screen.style.transition = 'transform 0.1s, opacity 0.15s, filter 0.1s';
  screen.style.transform = 'scaleY(0.02)';
  screen.style.opacity = '0';
  screen.style.filter = 'brightness(3)';

  setTimeout(() => {
    window.location.href = url;
  }, 220);
}

// Wire up all .btn links to use navigateTo
function wireButtons() {
  document.querySelectorAll('.btn[href]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      navigateTo(this.getAttribute('href'));
    });
  });
}

// Boot sequence — status bar date/time
function updateClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  const now = new Date();
  const pad = n => String(n).padStart(2,'0');
  el.textContent = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  runTypewriters();
  glitch();
  wireButtons();
  updateClock();
  setInterval(updateClock, 1000);
});
