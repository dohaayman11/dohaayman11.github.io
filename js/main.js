/* =========================================================
   ROOTBUILD — main.js   v2 (Multiplex-inspired)
   ========================================================= */

/* ── 1. NAV: scroll background ── */
const nav = document.getElementById('nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── 2. NAV: active link by current page ── */
(function markActiveNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(link => {
    const href = link.getAttribute('href').split('#')[0];
    if (href === path || (path === '' && href === 'index.html'))
      link.closest('li').classList.add('active');
  });
})();

/* ── 3. NAV: mobile hamburger ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav__links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    })
  );
}

/* ── 4. Smooth scroll for in-page anchors ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ── 5. HERO SLIDER (Multiplex-style fullscreen) ── */
(function initHeroSlider() {
  const slides  = document.querySelectorAll('.hero__slide');
  const dots    = document.querySelectorAll('.hero__dot');
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');
  if (!slides.length) return;

  let current = 0;
  let timer;

  const goTo = (n) => {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  };

  const autoPlay = () => { clearInterval(timer); timer = setInterval(() => goTo(current + 1), 6000); };

  goTo(0);
  autoPlay();

  nextBtn?.addEventListener('click', () => { goTo(current + 1); autoPlay(); });
  prevBtn?.addEventListener('click', () => { goTo(current - 1); autoPlay(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); autoPlay(); }));

  // Pause on hover
  const heroEl = document.querySelector('.hero');
  heroEl?.addEventListener('mouseenter', () => clearInterval(timer));
  heroEl?.addEventListener('mouseleave', autoPlay);
})();

/* ── 6. Scroll-reveal (staggered, Multiplex-feel) ── */
(function initReveal() {
  const selector = [
    '.reveal', '.reveal-on-scroll',
    '.pillar', '.stats__item',
    '.intro__heading', '.intro__body',
    '.svc-card', '.project-card',
    '.cert-item', '.qhse-grid > *',
    '.mv-grid > *', '.approach__step',
    '.gallery__item', '.feat-card',
    '.svc-teaser', '.contact-card',
    '.team-card', '.contact-form',
    '.map-embed', '.profile-card',
    '.about-tag'
  ].join(',');

  const els = document.querySelectorAll(selector);
  if (!els.length) return;

  // Group by parent so siblings stagger
  const staggerGroups = new Map();
  els.forEach(el => {
    const parent = el.parentElement;
    if (!staggerGroups.has(parent)) staggerGroups.set(parent, []);
    staggerGroups.get(parent).push(el);
  });

  staggerGroups.forEach(children => {
    children.forEach((el, i) => { el.style.transitionDelay = `${i * 0.07}s`; });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible', 'is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -44px 0px' });

  els.forEach(el => observer.observe(el));
})();

/* ── 7. Stats count-up animation ── */
(function initCountUp() {
  const items = document.querySelectorAll('.stats__number');
  if (!items.length) return;

  const parse = str => {
    const match = str.match(/([\d,.]+)(.*)/);
    return match ? { value: parseFloat(match[1].replace(/,/g, '')), suffix: match[2].trim() } : { value: 0, suffix: '' };
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const { value, suffix } = parse(el.textContent);
      const duration = 1800;
      const start = performance.now();
      const tick = now => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * value) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  items.forEach(el => observer.observe(el));
})();

/* ── 8. Page transitions (Multiplex smooth fade+slide) ── */
(function initPageTransitions() {
  const wrapper = document.getElementById('content-wrapper');
  if (!wrapper) return;

  // Fade in on load
  requestAnimationFrame(() => {
    wrapper.style.opacity = '0';
    wrapper.style.transform = 'translateY(18px)';
    wrapper.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    requestAnimationFrame(() => {
      wrapper.style.opacity = '1';
      wrapper.style.transform = 'translateY(0)';
    });
  });

  // Fade out on internal link navigation
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('http') || href.includes('wa.me')) return;

    link.addEventListener('click', e => {
      e.preventDefault();
      wrapper.style.opacity = '0';
      wrapper.style.transform = 'translateY(-12px)';
      setTimeout(() => { window.location.href = href; }, 380);
    });
  });
})();

/* ── 9. Parallax on hero (subtle, Multiplex-feel) ── */
(function initParallax() {
  const activeBg = () => document.querySelector('.hero__slide.active .hero__slide-bg');
  window.addEventListener('scroll', () => {
    const bg = activeBg();
    if (!bg) return;
    const y = window.scrollY;
    if (y < window.innerHeight) bg.style.transform = `scale(1.06) translateY(${y * 0.18}px)`;
  }, { passive: true });
})();

/* ── 10. Profile download button pulse ── */
(function initProfilePulse() {
  const btn = document.querySelector('.profile-download-btn');
  if (!btn) return;
  btn.addEventListener('mouseenter', () => btn.classList.add('pulse'));
  btn.addEventListener('animationend', () => btn.classList.remove('pulse'));
})();

/* ── 11. Auto Generate Gallery Images (1 → 20) ── */
/* ── Gallery Slider (1 → 28) ── */
// (function initGalleryTrack() {
//   const track = document.querySelector('.gallery__track');
//   if (!track) return;

//   track.innerHTML = '';

//   for (let i = 1; i <= 28; i++) {
//     track.insertAdjacentHTML('beforeend', `
//       <a class="gallery__item">
//         <img src="Images/${i}.jpeg" alt="Project ${i}" loading="lazy" />
//         <div class="gallery__item-caption">Project ${i}</div>
//       </a>
//     `);
//   }
// })();
/* ── 11. Auto Generate Gallery Images (1 → 20) ── */
/* ── Gallery Grid (29 → 56) ── */
(function initGalleryGrid() {
  const galleryGrid = document.getElementById('galleryGrid');
  if (!galleryGrid) return;

  galleryGrid.innerHTML = '';

  for (let i = 29; i <= 56; i++) {
    galleryGrid.insertAdjacentHTML('beforeend', `
      <a class="gallery__item reveal-on-scroll">
        <img src="Images/${folder}/${i}.${extinstion}" alt="Project ${i}" loading="lazy" />
        <div class="gallery__item-caption">Project ${i}</div>
      </a>
    `);
  }
})();

function generateGallery(containerId, folder, start, end,extinstion) {
  const gallery = document.getElementById(containerId);

  if (!gallery) return;

  gallery.innerHTML = '';

  for (let i = start; i <= end; i++) {
    gallery.insertAdjacentHTML('beforeend', `
      <div class="works-photo-item reveal-on-scroll">
        <img src="Images/${folder}/${i}.${extinstion}" alt="${folder} Project ${i}" loading="lazy">
        <div class="works-photo-caption">${folder} Project ${i}</div>
      </div>
    `);
  }
}
// Images\Fitout\2.jpeg

generateGallery('FitoutPhotoGrid', 'Fitout', 1,56,'jpeg');
generateGallery('FirePhotoGrid', 'Fire', 1,6,'png');
generateGallery('worksPhotoGrid', 'Industrial', 1,14,'jpeg');

// generateGallery('worksPhotoGrid', 'Fire', 1, 12) 
//drop button 
const projectsToggle = document.querySelector('.nav__dropdown-toggle');
const dropdownMenu = document.querySelector('.dropdown-menu');

projectsToggle?.addEventListener('click', (e) => {
    e.stopPropagation();

    dropdownMenu.style.opacity =
        dropdownMenu.style.opacity === '1' ? '0' : '1';

    dropdownMenu.style.visibility =
        dropdownMenu.style.visibility === 'visible' ? 'hidden' : 'visible';

    dropdownMenu.style.transform =
        dropdownMenu.style.visibility === 'visible'
            ? 'translateY(0)'
            : 'translateY(10px)';
});

document.addEventListener('click', () => {
    dropdownMenu.style.opacity = '0';
    dropdownMenu.style.visibility = 'hidden';
    dropdownMenu.style.transform = 'translateY(10px)';
});