document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const savedTheme = localStorage.getItem('sayed-theme');
  if (savedTheme === 'light') body.classList.add('light-mode');

  const syncThemeIcon = () => {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    const light = body.classList.contains('light-mode');
    icon.className = light ? 'fa-regular fa-sun' : 'fa-regular fa-moon';
    themeToggle.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
  };
  syncThemeIcon();

  themeToggle?.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    localStorage.setItem('sayed-theme', body.classList.contains('light-mode') ? 'light' : 'dark');
    syncThemeIcon();
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  if (window.AOS) window.AOS.init({ once: true, duration: 850, offset: 80, easing: 'ease-out-cubic' });

  const nav = document.querySelector('.glass-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = [...document.querySelectorAll('main header[id], main section[id]')];
  const onScroll = () => {
    nav?.classList.toggle('scrolled', window.scrollY > 20);
    const y = window.scrollY + 130;
    let current = sections[0]?.id || 'home';
    sections.forEach(section => { if (section.offsetTop <= y) current = section.id; });
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const glow = document.querySelector('.cursor-glow');
  window.addEventListener('pointermove', event => {
    if (!glow) return;
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });

  const counters = document.querySelectorAll('[data-counter]');
  const animateCounter = element => {
    const target = Number(element.dataset.counter || 0);
    const duration = 1400;
    const startTime = performance.now();
    const tick = now => {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      element.textContent = `${value}${target >= 50 ? '+' : ''}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(counter => counterObserver.observe(counter));

  const filterButtons = document.querySelectorAll('[data-filter]');
  const projectItems = document.querySelectorAll('.project-item');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      projectItems.forEach(item => {
        const categories = item.dataset.category || '';
        item.classList.toggle('hide', filter !== 'all' && !categories.includes(filter));
      });
    });
  });
});
