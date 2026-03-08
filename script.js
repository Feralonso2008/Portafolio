// ── Terminal falsa ──
const terminalBody = document.getElementById('terminalBody');
const lines = [
  { text: '$ Programador Junior', type: 'cmd' },
  { text: '> Fernando Suyon', type: 'val' },
  { text: '$ Estado', type: 'cmd' },
  { text: '> Aun aprendiendo',   type: 'ok'  },
];

function typeLine(el, text, cb) {
  let i = 0;
  const cursor = document.createElement('span');
  cursor.className = 'terminal-cursor';
  el.appendChild(cursor);
  const iv = setInterval(() => {
    cursor.before(document.createTextNode(text[i++]));
    if (i >= text.length) { clearInterval(iv); cursor.remove(); if (cb) cb(); }
  }, 45);
}

function deleteLine(el, cb) {
  const iv = setInterval(() => {
    const text = el.textContent;
    if (text.length === 0) { clearInterval(iv); el.remove(); if (cb) cb(); return; }
    el.textContent = text.slice(0, -1);
  }, 25);
}

function runLines(index) {
  if (index >= lines.length) {
    const allLines = [...terminalBody.children];
    let i = allLines.length - 1;
    function deleteNext() {
      if (i < 0) { setTimeout(() => runLines(0), 500); return; }
      deleteLine(allLines[i--], deleteNext);
    }
    setTimeout(deleteNext, 800);
    return;
  }
  const el = document.createElement('div');
  el.className = lines[index].type;
  terminalBody.appendChild(el);
  typeLine(el, lines[index].text, () => setTimeout(() => runLines(index + 1), 300));
}
window.addEventListener('load', () => setTimeout(() => runLines(0), 800));

// ── Custom cursor (solo desktop) ──
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  if (!isTouchDevice) {
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;
    let rafRunning = false;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
      if (!rafRunning) { rafRunning = true; requestAnimationFrame(animateRing); }
    });

    function animateRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      const dist = Math.abs(mx - rx) + Math.abs(my - ry);
      if (dist > 0.5) { requestAnimationFrame(animateRing); } else { rafRunning = false; }
    }
  }

// ── Navbar scroll ──
  const navbar = document.getElementById('navbar');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        ticking = false;
      });
      ticking = true;
    }
  });

// ── Hamburger menu ──
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

// ── Reveal on scroll ──
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 100);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));