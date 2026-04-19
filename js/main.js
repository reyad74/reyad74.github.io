/**
 * Portfolio Main Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initBackground();
  initMouseTrail();
  initCursorFollower();
  initReveal();
  initHeroTilt();
  initScrollProgress();
  initBackToTop();
  initRippleEffect();
  initActiveLinks();
  loadData();
  initContactForm();
  initHeroAnimation();
  initNameAnimation();
  initLazyLoading();
  document.getElementById('year').textContent = new Date().getFullYear();
});

// Hide loader when page is fully loaded
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => loader.style.display = 'none', 800);
    }, 500);
  }
});

// Navbar scroll effect
function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

// Mobile menu toggle
function initMobileMenu() {
  const menuToggle = document.getElementById('mobile-menu');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('open');
    });
  }

  // Close menu when clicking a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuToggle.classList.remove('open');
    });
  });
}
// Background Particles
function initBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', resize);
  resize();
  
  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  for (let i = 0; i < 100; i++) particles.push(new Particle());
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// ===========================
// PREMIUM MAGNETIC CURSOR
// ===========================
function initCursorFollower() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  // Only on non-touch devices
  if (window.matchMedia('(pointer: coarse)').matches) {
    dot.style.display = 'none';
    ring.style.display = 'none';
    return;
  }

  let mouseX = -100, mouseY = -100;
  let ringX   = -100, ringY   = -100;

  // Dot follows instantly
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Ring lerps (smooth lag)
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover detection — buttons, links, cards
  const hoverTargets = 'a, button, .card, .btn, .back-to-top, .menu-toggle, .nav-item, label';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hover');
      ring.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hover');
      ring.classList.remove('hover');
    });
  });

  // Text detection — morph ring into text cursor pill
  const textTargets = 'p, h1, h2, h3, h4, li, span, label, .response';
  document.querySelectorAll(textTargets).forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('text-hover');
      ring.classList.add('text-hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('text-hover');
      ring.classList.remove('text-hover');
    });
  });

  // Click burst — spawn 8 particles flying outward
  document.addEventListener('click', (e) => {
    const count = 8;
    for (let i = 0; i < count; i++) {
      const burst = document.createElement('div');
      burst.classList.add('cursor-burst');
      const angle = (i / count) * 360;
      const dist  = 30 + Math.random() * 30;
      const bx = Math.cos(angle * Math.PI / 180) * dist;
      const by = Math.sin(angle * Math.PI / 180) * dist;
      burst.style.left = e.clientX + 'px';
      burst.style.top  = e.clientY + 'px';
      burst.style.setProperty('--bx', bx + 'px');
      burst.style.setProperty('--by', by + 'px');
      document.body.appendChild(burst);
      setTimeout(() => burst.remove(), 500);
    }
  });

  // Hide/show on page leave
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
}

// Scroll reveal animation with staggering
function initReveal() {
  const reveals = document.querySelectorAll('.reveal:not(.active)');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger children if it's a grid
        const children = entry.target.querySelectorAll('.card, .skill-category, .timeline-item');
        if (children.length > 0) {
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('active');
            }, index * 100);
          });
        }
        
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(reveal => observer.observe(reveal));
}

// Fetch and render data
async function loadData() {
  try {
    const [profile, projects, experience, skills] = await Promise.all([
      fetch('data/profile.json').then(res => res.json()),
      fetch('data/projects.json').then(res => res.json()),
      fetch('data/experience.json').then(res => res.json()),
      fetch('data/skills.json').then(res => res.json())
    ]);

    renderProfile(profile);
    renderProjects(projects.projects || projects);
    renderExperience(experience);
    renderSkills(skills.skills || skills);

    // Re-bind cursor hover after dynamic content loads
    refreshCursorBindings();
  } catch (err) {
    console.error('Error loading data:', err);
  }
}

// Called after dynamic content is injected to pick up new interactive elements
function refreshCursorBindings() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  document.querySelectorAll('a, button, .card, .btn, .skill-tag, .back-to-top, .timeline-content').forEach(el => {
    if (el.dataset.cursorBound) return;
    el.dataset.cursorBound = '1';
    el.addEventListener('mouseenter', () => { dot.classList.add('hover'); ring.classList.add('hover'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('hover'); ring.classList.remove('hover'); });
  });
}

function renderProfile(profile) {
  // Update Hero Image & Navbar Logo
  if (profile.image) {
    const heroImg = document.querySelector('.hero-image .image-wrapper-inner img');
    if (heroImg) heroImg.src = profile.image;

    const navLogo = document.querySelector('.logo-img');
    if (navLogo) navLogo.src = profile.image;
  }

  // Terminal Whoami effect
  const terminal = document.getElementById('whoami-response');
  const bio = profile.bio;
  let i = 0;
  
  function typeWriter() {
    if (i < bio.length) {
      terminal.innerHTML += bio.charAt(i);
      i++;
      setTimeout(typeWriter, 10);
    }
  }
  
  // Start typing when section is visible
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      typeWriter();
      observer.unobserve(entries[0].target);
    }
  });
  observer.observe(document.getElementById('about'));

  // Contact Details
  const contactDiv = document.getElementById('contact-details');
  contactDiv.innerHTML = `
    <p style="margin-bottom: 1rem;"><strong>Email:</strong> <a href="mailto:${profile.email}" class="command">${profile.email}</a></p>
    <p style="margin-bottom: 1rem;"><strong>Phone:</strong> ${profile.phone}</p>
    <p style="margin-bottom: 2rem;"><strong>Location:</strong> ${profile.location}</p>
    <div style="display: flex; gap: 1.5rem;">
        ${profile.socials.github ? `<a href="${profile.socials.github}" target="_blank" class="command">GitHub</a>` : ''}
        ${profile.socials.linkedin ? `<a href="${profile.socials.linkedin}" target="_blank" class="command">LinkedIn</a>` : ''}
        ${profile.socials.youtube ? `<a href="${profile.socials.youtube}" target="_blank" class="command">YouTube</a>` : ''}
    </div>
  `;

  // Footer Socials with icons
  const footerSocials = document.getElementById('footer-socials');
  if (footerSocials) {
    footerSocials.innerHTML = `
      <h3>Connect</h3>
      <div class="footer-social-links">
        ${profile.socials.github ? `<a href="${profile.socials.github}" target="_blank"><i class="fab fa-github"></i> GitHub</a>` : ''}
        ${profile.socials.linkedin ? `<a href="${profile.socials.linkedin}" target="_blank"><i class="fab fa-linkedin"></i> LinkedIn</a>` : ''}
        ${profile.socials.youtube ? `<a href="${profile.socials.youtube}" target="_blank"><i class="fab fa-youtube"></i> YouTube</a>` : ''}
        ${profile.socials.kaggle ? `<a href="${profile.socials.kaggle}" target="_blank"><i class="fab fa-kaggle"></i> Kaggle</a>` : ''}
      </div>
    `;
  }
}

function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');
  if (!Array.isArray(projects)) {
    console.error("Projects data is not an array:", projects);
    return;
  }
  grid.innerHTML = projects.map(proj => `
    <div class="card reveal glass-card-modern">
      <div class="card-img-wrapper">
        <img src="${proj.image}" alt="${proj.title}" class="card-img" onerror="this.src='images/proj_1.jpg'">
        <div class="card-overlay">
          <a href="${proj.link}" target="_blank" class="btn-view-modern"><i class="fas fa-external-link-alt"></i> View Project</a>
        </div>
      </div>
      <div class="card-content">
        <h3>${proj.title}</h3>
        <p>${proj.description}</p>
      </div>
    </div>
  `).join('');
  initReveal(); // Re-init for new elements
}

function renderExperience(data) {
  const timeline = document.getElementById('experience-timeline');
  let html = '';

  // Experience
  data.experience.forEach((item, index) => {
    const side = index % 2 === 0 ? 'left' : 'right';
    html += `
      <div class="timeline-item ${side} reveal">
        <div class="timeline-content">
          <span style="color: var(--accent-color); font-size: 0.8rem; font-weight: 700;">${item.period}</span>
          <h3 style="margin: 0.5rem 0;">${item.role}</h3>
          <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">${item.company}</p>
          <ul style="padding-left: 1.2rem; font-size: 0.85rem; color: var(--text-secondary);">
            ${item.description.map(desc => `<li style="margin-bottom: 0.5rem;">${desc}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  });

  // Education
  data.education.forEach((item, index) => {
    const side = (data.experience.length + index) % 2 === 0 ? 'left' : 'right';
    html += `
      <div class="timeline-item ${side} reveal">
        <div class="timeline-content">
          <span style="color: var(--accent-color); font-size: 0.8rem; font-weight: 700;">${item.period}</span>
          <h3 style="margin: 0.5rem 0;">${item.degree}</h3>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">${item.institution}</p>
          <p style="font-size: 0.8rem; margin-top: 0.5rem;">Grade: ${item.grade}</p>
        </div>
      </div>
    `;
  });

  timeline.innerHTML = html;
  initReveal();
}

function renderSkills(skills) {
  const container = document.getElementById('skills-container');
  
  // Categorize skills (in a real app, this would be in the data)
  const categories = {
    "Languages": skills.filter(s => ["PYTHON", "SQL"].includes(s.name.toUpperCase())),
    "Data Science": skills.filter(s => ["DATA VISUALIZATION", "STATISTICAL ANALYSIS", "MACHINE LEARNING"].includes(s.name.toUpperCase())),
    "Tools & Libraries": ["TensorFlow", "Pandas", "Power BI", "Tableau", "Git"].map(name => ({ name }))
  };

  container.innerHTML = Object.entries(categories).map(([name, list]) => `
    <div class="skill-category reveal">
      <h3>${name}</h3>
      <div class="skill-list">
        ${list.map(skill => `<span class="skill-item">${skill.name}</span>`).join('')}
      </div>
    </div>
  `).join('');

  initReveal(); // Ensure new elements are observed
}

// Contact form handling
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button');
    const originalText = btn.textContent;
    
    // Get form data
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const message = form.querySelector('textarea').value;

    // Save to localStorage for Admin Panel
    const messages = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
    messages.unshift({
      name,
      email,
      message,
      date: new Date().toLocaleString(),
      status: 'unread'
    });
    localStorage.setItem('portfolio_messages', JSON.stringify(messages));

    btn.textContent = 'Sending...';
    btn.disabled = true;

    // Simulate sending
    setTimeout(() => {
      btn.textContent = 'Message Sent!';
      btn.style.background = '#22c55e';
      form.reset();
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1000);
  });
}

// Text Scramble Animation
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span style="color: var(--accent-color); opacity: 0.5;">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

function initHeroAnimation() {
  const el = document.querySelector('.hero p strong');
  if (!el) return;
  const fx = new TextScramble(el);
  const phrases = ['Junior Data Scientist', 'Machine Learning Engineer', 'Data Analytics Specialist'];
  let counter = 0;
  const next = () => {
    fx.setText(phrases[counter]).then(() => {
      setTimeout(next, 3000);
    });
    counter = (counter + 1) % phrases.length;
  };
  next();
}

// Interactive Hero Tilt
function initHeroTilt() {
  const hero = document.querySelector('.hero');
  const wrapper = document.querySelector('.image-wrapper');
  if (!hero || !wrapper) return;

  hero.addEventListener('mousemove', (e) => {
    const { left, top, width, height } = wrapper.getBoundingClientRect();
    const x = (e.clientX - (left + width / 2)) / 30;
    const y = (e.clientY - (top + height / 2)) / 30;
    
    wrapper.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
  });
  hero.addEventListener('mouseleave', () => {
    wrapper.style.transform = 'rotateY(0deg) rotateX(0deg)';
  });
}

// Scroll Progress Indicator
function initScrollProgress() {
  const bar = document.getElementById('scroll-bar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    bar.style.width = scrolled + "%";
  });
}

// Back to Top Logic
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  const circle = document.querySelector('.progress-ring__circle');
  if (!btn || !circle) return;

  const radius = circle.r.baseVal.value;
  const circumference = radius * 2 * Math.PI;

  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = circumference - (scroll / height) * circumference;
    
    circle.style.strokeDashoffset = progress;

    if (scroll > 300) btn.classList.add('visible');
    else btn.classList.remove('visible');
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Ripple Effect for Buttons
function initRippleEffect() {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn')) {
      const btn = e.target;
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    }
  });
}

// Active Link Highlighting
function initActiveLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  });
}

// Performance: Lazy Loading
function initLazyLoading() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.setAttribute('loading', 'lazy');
  });
}

// Advanced Name Animation
function initNameAnimation() {
  const title = document.querySelector('.name-reveal');
  if (!title) return;
  
  const text = title.innerHTML;
  title.innerHTML = '';
  
  // Wrap lines in divs
  const lines = text.split('<br>');
  lines.forEach((line, lineIdx) => {
    const lineDiv = document.createElement('div');
    lineDiv.style.overflow = 'hidden';

    const content = document.createElement('div');
    content.className = 'name-line';
    content.innerHTML = line;

    lineDiv.appendChild(content);
    title.appendChild(lineDiv);
  });
}

// ===========================
// GLOWING MOUSE TRAIL
// ===========================
function initMouseTrail() {
  // Only on desktop
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'trail-canvas';
  canvas.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    z-index: 9999;
  `;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const trail = [];
  const MAX   = 28;
  let mx = -200, my = -200;

  window.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    trail.push({ x: mx, y: my, r: 6, life: 1 });
    if (trail.length > MAX) trail.shift();
  });

  function drawTrail() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < trail.length; i++) {
      const t     = trail[i];
      const ratio = i / trail.length;   // 0 = oldest, 1 = newest
      const alpha = ratio * 0.55;
      const radius = 2 + ratio * 5;

      const grad = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, radius * 3);
      grad.addColorStop(0,   `rgba(56, 189, 248, ${alpha})`);
      grad.addColorStop(0.5, `rgba(139, 92, 246, ${alpha * 0.5})`);
      grad.addColorStop(1,   'rgba(0,0,0,0)');

      ctx.beginPath();
      ctx.arc(t.x, t.y, radius * 3, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    requestAnimationFrame(drawTrail);
  }
  drawTrail();
}
