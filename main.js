// Sticky nav on scroll
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// Mobile menu toggle
const toggle = document.querySelector('.nav__toggle');
const links = document.querySelector('.nav__links');

toggle.addEventListener('click', () => {
  links.classList.toggle('open');
});

links.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => links.classList.remove('open'));
});

// Tracklist interaction
document.querySelectorAll('.tracklist__item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.tracklist__item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });
});

// Newsletter form
function handleSubmit(e) {
  e.preventDefault();
  const msg = document.getElementById('confirm-msg');
  msg.textContent = 'You\'re in. Stay tuned for exclusive drops.';
  e.target.reset();
}

// Scroll-in animations using IntersectionObserver
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.tour__item, .stat, .tracklist__item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
