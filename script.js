// ============================================
//  BARRA HOME STAY — script.js (Premium Beach)
// ============================================

// ---- HAMBURGER MENU ----
const hamburger    = document.getElementById('nav-hamburger');
const navLinksMenu = document.querySelector('.nav-links');

if (hamburger && navLinksMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinksMenu.classList.toggle('nav-open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinksMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinksMenu.classList.remove('nav-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      navLinksMenu.classList.remove('nav-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

// ---- SCROLL PROGRESS ----
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total    = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.width = ((scrolled / total) * 100) + '%';
}, { passive: true });

// ---- CUSTOM CURSOR ----
const cursorOuter = document.getElementById('cursor-outer');
const cursorInner = document.getElementById('cursor-inner');
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
let outerX = mouseX, outerY = mouseY;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursorInner) {
    cursorInner.style.left = mouseX + 'px';
    cursorInner.style.top  = mouseY + 'px';
  }
  if (!document.body.classList.contains('cursor-ready')) {
    document.body.classList.add('cursor-ready');
  }
}, { passive: true });

(function animateCursor() {
  outerX += (mouseX - outerX) * 0.1;
  outerY += (mouseY - outerY) * 0.1;
  if (cursorOuter) {
    cursorOuter.style.left = outerX + 'px';
    cursorOuter.style.top  = outerY + 'px';
  }
  requestAnimationFrame(animateCursor);
})();

// Hover states for cursor
document.querySelectorAll('a, button, input, select, [role="button"], .g-item').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// Dark cursor on dark sections
const darkSections = ['hero', 'callout', 'cinema', 'reviews', 'cta-final', 'footer'];
window.addEventListener('scroll', () => {
  let overDark = false;
  darkSections.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top <= window.innerHeight / 2 && r.bottom > window.innerHeight / 2) overDark = true;
  });
  document.body.classList.toggle('cursor-dark', overDark);
}, { passive: true });

// ---- MAGNETIC BUTTONS ----
document.querySelectorAll('.btn-primary, .btn-outline-light, .nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width  / 2);
    const dy = e.clientY - (rect.top  + rect.height / 2);
    btn.style.transform = `translate(${dx * 0.22}px, ${dy * 0.3}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.25s';
    setTimeout(() => { btn.style.transition = ''; }, 500);
  });
});

// ---- NAV: dark-nav when over dark sections ----
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-link');
const navSections = ['galeria', 'simulador', 'localizacao'];
const darkNavZones = ['callout', 'reviews', 'cta-final', 'footer'];

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Dark nav when over dark-bg sections
  let inDark = false;
  darkNavZones.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top <= 54 && r.bottom > 54) inDark = true;
  });
  // Also hero at top
  if (scrollY < 80) inDark = true;
  nav.classList.toggle('dark-nav', inDark);

  // Active section highlight
  let current = '';
  navSections.forEach(id => {
    const el = document.getElementById(id);
    if (el && scrollY >= el.offsetTop - 120) current = id;
  });
  navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === current));
}, { passive: true });

// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ---- SCROLL REVEAL (opacity + translate) ----
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });
revealEls.forEach(el => revObs.observe(el));

// ---- CLIP-PATH IMAGE REVEAL ----
const clipEls = document.querySelectorAll('.reveal-clip, .reveal-clip-left');
const clipObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); clipObs.unobserve(e.target); }
  });
}, { threshold: 0.06 });
clipEls.forEach(el => clipObs.observe(el));

// Gallery + steps + stats: staggered reveal
document.querySelectorAll('.g-item, .step, .stat').forEach((el, i) => {
  el.classList.add('reveal');
  const mod = i % 4;
  if (mod === 1) el.classList.add('reveal-d2');
  if (mod === 2) el.classList.add('reveal-d3');
  if (mod === 3) el.classList.add('reveal-d4');
  revObs.observe(el);
});

// ---- ANIMATED COUNTERS ----
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el     = e.target;
    const target = parseInt(el.dataset.target);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const dur    = 1600;
    const start  = performance.now();
    const tick   = now => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = `${prefix}${Math.round(ease * target)}${suffix}`;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObs.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('.counter').forEach(c => counterObs.observe(c));

// ---- RANGE SLIDER (gold fill) ----
function updateRange(input) {
  const min = parseFloat(input.min);
  const max = parseFloat(input.max);
  const pct = ((parseFloat(input.value) - min) / (max - min)) * 100;
  input.style.background = `linear-gradient(to right, #b5892e ${pct}%, #e0d8ce ${pct}%)`;
}

// ---- SIMULADOR ----
const diariaEl    = document.getElementById('diaria');
const ocupacaoEl  = document.getElementById('ocupacao');
const diariaOut   = document.getElementById('diaria-val');
const ocupacaoOut = document.getElementById('ocupacao-val');
const brutaEl     = document.getElementById('receita-bruta');
const liquidaEl   = document.getElementById('receita-liquida');
const anualEl     = document.getElementById('receita-anual');

function fmt(v) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL',
    minimumFractionDigits: 0, maximumFractionDigits: 0
  }).format(v);
}

function calcSim() {
  if (!diariaEl) return;
  const d  = parseInt(diariaEl.value);
  const oc = parseInt(ocupacaoEl.value) / 100;
  const b  = d * 30 * oc;
  const l  = b * 0.65;
  const a  = l * 12;
  diariaOut.textContent   = `R$${d}`;
  ocupacaoOut.textContent = `${parseInt(ocupacaoEl.value)}%`;
  brutaEl.textContent    = fmt(b);
  liquidaEl.textContent  = fmt(l);
  anualEl.textContent    = fmt(a);
  updateRange(diariaEl);
  updateRange(ocupacaoEl);
}

if (diariaEl) {
  diariaEl.addEventListener('input', calcSim);
  ocupacaoEl.addEventListener('input', calcSim);
  calcSim();
}

// ---- LIGHTBOX ----
const galleryImages = [
  { src: 'fotosbarra/quarto.jpeg',    cap: 'Vista beira mar' },
  { src: 'fotosbarra/imagem2.jpeg',   cap: 'Vista mar e rio' },
  { src: 'fotosbarra/quarto.jpeg',    cap: 'Quarto com vista para o rio' },
  { src: 'fotosbarra/cozinha.jpeg',   cap: 'Interior — sala e cozinha integrada' },
  { src: 'fotosbarra/lavanderia.jpeg', cap: 'Lavanderia' },
  { src: 'fotosbarra/areacomum.PNG',   cap: 'Área comum' },
  { src: 'fotosbarra/academia.jpeg',   cap: 'Academia' },
  { src: 'fotosbarra/piscina.jpeg',    cap: 'Piscina' },
  { src: 'fotosbarra/spa.jpeg',        cap: 'Spa' },
];

const lb      = document.getElementById('lightbox');
const lbImg   = document.getElementById('lb-img');
const lbCap   = document.getElementById('lb-cap');
let lbCurrent = 0;
lbImg.style.transition = 'opacity 0.15s ease';

function openLb(i) {
  lbCurrent = i;
  lbImg.src = galleryImages[i].src;
  lbImg.alt = galleryImages[i].cap;
  lbCap.textContent = galleryImages[i].cap;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLb() {
  lb.classList.remove('open');
  document.body.style.overflow = '';
}
function navLb(dir) {
  lbCurrent = (lbCurrent + dir + galleryImages.length) % galleryImages.length;
  lbImg.style.opacity = '0';
  setTimeout(() => {
    lbImg.src = galleryImages[lbCurrent].src;
    lbCap.textContent = galleryImages[lbCurrent].cap;
    lbImg.style.opacity = '1';
  }, 150);
}

document.querySelectorAll('.g-item').forEach(item => {
  item.addEventListener('click', () => openLb(parseInt(item.dataset.index)));
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') openLb(parseInt(item.dataset.index));
  });
});
document.getElementById('lb-close').addEventListener('click', closeLb);
document.getElementById('lb-prev').addEventListener('click',  () => navLb(-1));
document.getElementById('lb-next').addEventListener('click',  () => navLb(1));
document.getElementById('lb-backdrop').addEventListener('click', closeLb);
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLb();
  if (e.key === 'ArrowLeft')  navLb(-1);
  if (e.key === 'ArrowRight') navLb(1);
});

// ---- HERO PARALLAX ----
const heroPhoto = document.getElementById('hero-photo');
window.addEventListener('scroll', () => {
  if (!heroPhoto || window.scrollY > window.innerHeight) return;
  heroPhoto.style.transform = `scale(1) translateY(${window.scrollY * 0.22}px)`;
}, { passive: true });

// ---- CINEMA PARALLAX ----
const cinemaImg = document.getElementById('cinema-img');
const cinemaSec = document.getElementById('cinema');
window.addEventListener('scroll', () => {
  if (!cinemaImg || !cinemaSec) return;
  const rect = cinemaSec.getBoundingClientRect();
  if (rect.bottom < 0 || rect.top > window.innerHeight) return;
  const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
  cinemaImg.style.transform = `translateY(${(progress - 0.5) * 55}px)`;
}, { passive: true });

// ---- CALLOUT PHOTO PARALLAX ----
const calloutPhoto = document.querySelector('.callout-photo');
const calloutSec   = document.getElementById('callout');
window.addEventListener('scroll', () => {
  if (!calloutPhoto || !calloutSec) return;
  const rect = calloutSec.getBoundingClientRect();
  if (rect.bottom < 0 || rect.top > window.innerHeight) return;
  const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
  calloutPhoto.style.transform = `translateY(${(progress - 0.5) * 50}px)`;
}, { passive: true });

// ---- WHATSAPP FORM ----
const PHONE = '5581986171170';

const objetivoMap = {
  investimento: 'Investimento para renda',
  moradia:      'Moradia',
};
const pagamentoMap = {
  avista:        'À vista',
  financiamento: 'Financiamento bancário',
  fgts:          'FGTS',
  pesquisando:   'Ainda pesquisando',
};
const creditoMap = {
  aprovado:      'Já possui crédito aprovado',
  'nao-aprovado':'Ainda não tem crédito aprovado',
};
const horarioMap = {
  manha: 'Manhã (8h–12h)',
  tarde: 'Tarde (12h–18h)',
  noite: 'Noite (18h–21h)',
};

const form = document.getElementById('contact-form');
if (form) {
  // Mostrar/ocultar campo de crédito quando financiamento for selecionado
  const creditoField = document.getElementById('credito-field');
  form.querySelectorAll('input[name="pagamento"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const show = radio.value === 'financiamento' && radio.checked;
      creditoField.classList.toggle('visible', show);
      if (!show) form.querySelectorAll('input[name="credito"]').forEach(r => { r.checked = false; });
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const nome = document.getElementById('nome');
    const wpp  = document.getElementById('wpp');
    let valid = true;
    [nome, wpp].forEach(f => {
      f.classList.toggle('error', !f.value.trim());
      if (!f.value.trim()) valid = false;
    });
    if (!valid) return;

    const objetivo  = form.querySelector('input[name="objetivo"]:checked');
    const pagamento = form.querySelector('input[name="pagamento"]:checked');
    const credito   = form.querySelector('input[name="credito"]:checked');
    const horario   = document.getElementById('horario').value;

    let msg = `Olá! Meu nome é *${nome.value.trim()}* e tenho interesse no flat do *Barra Home Stay* (Barra de Jangada).`;
    if (objetivo)  msg += `\n• Objetivo: ${objetivoMap[objetivo.value] || objetivo.value}`;
    if (pagamento) msg += `\n• Pagamento: ${pagamentoMap[pagamento.value] || pagamento.value}`;
    if (credito)   msg += `\n• Crédito: ${creditoMap[credito.value] || credito.value}`;
    msg += `\n• Melhor horário: ${horarioMap[horario]}`;
    msg += `\n• WhatsApp: ${wpp.value.trim()}`;

    // Disparo do evento de conversão
    if (typeof fbq !== 'undefined') fbq('track', 'Lead');
    if (typeof gtag !== 'undefined') gtag('event', 'generate_lead', { event_category: 'formulario', event_label: 'barra_home_stay' });

    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
  });

  form.querySelectorAll('input[type="text"], input[type="tel"]').forEach(i => {
    i.addEventListener('input', () => i.classList.remove('error'));
  });
}

// WhatsApp input mask
const wppInput = document.getElementById('wpp');
if (wppInput) {
  wppInput.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 7) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else if (v.length) v = `(${v}`;
    e.target.value = v;
  });
}
