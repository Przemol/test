// ── Nav ──────────────────────────────────────────
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

const toggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');

toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── Track Data ───────────────────────────────────
const TRACKS = [
  { name: 'Dead Stars',       dur: '3:42', secs: 222 },
  { name: 'Neon Shadows',     dur: '4:01', secs: 241 },
  { name: 'Ghost Protocol',   dur: '3:28', secs: 208 },
  { name: 'Infrared',         dur: '4:15', secs: 255 },
  { name: 'Last of My Kind',  dur: '3:55', secs: 235 },
  { name: 'Concrete Sky',     dur: '5:02', secs: 302 },
];

// ── Player State ─────────────────────────────────
let currentTrack = 0;
let isPlaying = false;
let elapsed = 0;
let ticker = null;

const playerName     = document.getElementById('player-name');
const playerDur      = document.getElementById('player-duration');
const playerElapsed  = document.getElementById('player-elapsed');
const playerFill     = document.getElementById('player-fill');
const playerThumb    = document.getElementById('player-thumb');
const btnPlay        = document.getElementById('btn-play');

function fmt(s) {
  const m = Math.floor(s / 60);
  const sec = String(Math.floor(s % 60)).padStart(2, '0');
  return `${m}:${sec}`;
}

function loadTrack(idx) {
  currentTrack = (idx + TRACKS.length) % TRACKS.length;
  elapsed = 0;
  const t = TRACKS[currentTrack];
  playerName.textContent = t.name;
  playerDur.textContent  = t.dur;
  playerElapsed.textContent = '0:00';
  setProgress(0);

  document.querySelectorAll('.tracklist__item').forEach((item, i) => {
    item.classList.toggle('active', i === currentTrack);
  });
}

function setProgress(pct) {
  playerFill.style.width  = pct + '%';
  playerThumb.style.left  = pct + '%';
}

function tick() {
  elapsed++;
  const total = TRACKS[currentTrack].secs;
  if (elapsed >= total) {
    loadTrack(currentTrack + 1);
    if (isPlaying) startTicker();
    return;
  }
  playerElapsed.textContent = fmt(elapsed);
  setProgress((elapsed / total) * 100);
}

function startTicker() {
  clearInterval(ticker);
  ticker = setInterval(tick, 1000);
}

function pauseTicker() {
  clearInterval(ticker);
  ticker = null;
}

function togglePlay() {
  isPlaying = !isPlaying;
  btnPlay.textContent = isPlaying ? '⏸' : '▶';
  btnPlay.classList.toggle('playing', isPlaying);
  isPlaying ? startTicker() : pauseTicker();
}

btnPlay.addEventListener('click', togglePlay);

document.getElementById('btn-prev').addEventListener('click', () => {
  loadTrack(currentTrack - 1);
  if (isPlaying) startTicker();
});

document.getElementById('btn-next').addEventListener('click', () => {
  loadTrack(currentTrack + 1);
  if (isPlaying) startTicker();
});

document.getElementById('player-bar').addEventListener('click', e => {
  const bar = e.currentTarget;
  const pct = e.offsetX / bar.offsetWidth;
  elapsed = Math.floor(pct * TRACKS[currentTrack].secs);
  playerElapsed.textContent = fmt(elapsed);
  setProgress(pct * 100);
});

document.querySelectorAll('.tracklist__item').forEach((item, idx) => {
  item.addEventListener('click', () => {
    loadTrack(idx);
    if (!isPlaying) togglePlay();
    else startTicker();
  });
});

loadTrack(0);

// ── Gallery Lightbox ─────────────────────────────
const lightbox   = document.getElementById('lightbox');
const lbImg      = document.getElementById('lb-img');
const lbCaption  = document.getElementById('lb-caption');
const lbClose    = document.getElementById('lb-close');

const BG_MAP = { 'gp-1': '#1c0030', 'gp-2': '#001a10', 'gp-3': '#1a1000', 'gp-4': '#001020', 'gp-5': '#1a0010' };

document.querySelectorAll('.gallery__item').forEach(item => {
  item.addEventListener('click', () => {
    const label = item.dataset.label || '';
    const ph    = item.querySelector('.gallery__placeholder');
    const cls   = [...ph.classList].find(c => c.startsWith('gp-')) || 'gp-1';
    lbImg.style.background = `linear-gradient(135deg, ${BG_MAP[cls] || '#111'}, #0a0a0a)`;
    lbImg.style.display     = 'flex';
    lbImg.style.alignItems  = 'center';
    lbImg.style.justifyContent = 'center';
    lbImg.innerHTML = `<span style="font-family:var(--font-display);font-size:3rem;letter-spacing:0.1em;color:rgba(232,255,0,0.2)">XENO</span>`;
    lbCaption.textContent = label;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
}

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ── Merch cart feedback ───────────────────────────
document.querySelectorAll('.merch__item .btn--sm:not([disabled])').forEach(btn => {
  btn.addEventListener('click', () => {
    const orig = btn.textContent;
    btn.textContent = 'Added ✓';
    btn.style.background = 'var(--accent)';
    btn.style.color = '#000';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.style.color = '';
    }, 1800);
  });
});

// ── Newsletter form ───────────────────────────────
function handleSubmit(e) {
  e.preventDefault();
  const msg = document.getElementById('confirm-msg');
  msg.textContent = "You're in. Stay tuned for exclusive drops.";
  e.target.reset();
}

// ── Scroll-in animations ──────────────────────────
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll(
  '.tour__item, .stat, .tracklist__item, .merch__item, .gallery__item'
).forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = `opacity 0.5s ${i * 0.04}s ease, transform 0.5s ${i * 0.04}s ease`;
  fadeObserver.observe(el);
});
