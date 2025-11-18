// Lightweight interactions: typewriter, theme toggle, smooth scroll, filter, modal, form validation, reveal on scroll.

document.addEventListener('DOMContentLoaded', function () {
  // Typewriter for roles / name
  typeWriter(['Frontend Engineer', 'JavaScript • Web Performance', 'Accessible Interfaces'], '#typed-role', 60);
  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  setTheme(savedTheme);
  themeToggle.addEventListener('click', () => setTheme(root.classList.contains('light') ? 'dark' : 'light'));
  function setTheme(name) {
    if (name === 'light') root.classList.add('light'); else root.classList.remove('light');
    localStorage.setItem('theme', name);
    themeToggle.textContent = name === 'light' ? '🌙' : '🌞';
  }

  // Smooth scroll for header nav links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const target = document.querySelector(a.getAttribute('href'));
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth',block:'start'});
        // collapse mobile nav if open
        document.getElementById('nav')?.classList.remove('show');
      }
    });
  });

  // Menu toggle for small screens
  document.getElementById('menuToggle').addEventListener('click', ()=>{
    document.getElementById('nav').classList.toggle('show');
  });

  // Project filtering
  const filters = document.querySelectorAll('.filters button');
  const grid = document.getElementById('projectGrid');
  filters.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      filters.forEach(b=>b.classList.remove('active')); btn.classList.add('active');
      const type = btn.getAttribute('data-filter');
      filterGrid(type);
    });
  });
  function filterGrid(type){
    const items = grid.querySelectorAll('.card');
    items.forEach(i=>{
      if(type === '*' || i.dataset.type === type) i.style.display = ''; else i.style.display = 'none';
    });
  }

  // Modal for project details (demo static content)
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalLink = document.getElementById('modalLink');
  document.querySelectorAll('.view-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.dataset.id;
      openModal(projectData(id));
    });
  });
  document.querySelector('.modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });
  function openModal(data){
    modalTitle.textContent = data.title;
    modalBody.textContent = data.description;
    modalLink.href = data.link;
    modal.setAttribute('aria-hidden','false');
  }
  function closeModal(){
    modal.setAttribute('aria-hidden','true');
  }
  function projectData(id){
    // Replace with dynamic content or fetch when integrating real projects
    const examples = {
      'alpha': {title:'Project Alpha', description:'An SPA focused on fast interactions, a11y, and low bundle size.', link:'#'},
      'build-helper': {title:'Build Helper', description:'Developer tooling to improve build times and dev ergonomics.', link:'#'},
      'mobile-app': {title:'Mobile App', description:'Cross-platform mobile app with native-like performance.', link:'#'}
    };
    return examples[id] || {title:'Project', description:'Details coming soon', link:'#'};
  }

  // Simple form validation + demo submit
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(!form.checkValidity()){
      status.textContent = 'Please fill out all fields correctly.';
      return;
    }
    // Demo: pretend to submit, show success
    status.textContent = 'Sending…';
    setTimeout(()=>{
      status.textContent = 'Thanks — message sent (demo).';
      form.reset();
    }, 800);
  });

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Scroll reveal for sections
  const reveals = document.querySelectorAll('.section, .card, .hero-text, .hero-card');
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) { e.target.style.opacity=1; e.target.style.transform='none'; obs.unobserve(e.target); }
    });
  }, {threshold: 0.12});
  reveals.forEach(r=>{
    r.style.opacity = 0;
    r.style.transform = 'translateY(14px)';
    r.style.transition = 'opacity 420ms ease, transform 420ms ease';
    obs.observe(r);
  });

  // Basic typewriter implementation
  function typeWriter(words, selector, speed=80){
    const el = document.querySelector(selector);
    if(!el) return;
    let w = 0, l = 0, deleting=false;
    function tick(){
      const current = words[w];
      el.textContent = current.slice(0, l) + (deleting ? '' : '');
      if(!deleting && l < current.length){ l++; setTimeout(tick, speed + Math.random()*60); }
      else if(!deleting && l === current.length){ deleting = true; setTimeout(tick, 1200); }
      else if(deleting && l > 0){ l--; setTimeout(tick, speed/2); }
      else { deleting=false; w = (w+1) % words.length; setTimeout(tick, 300); }
    }
    tick();
  }
});
