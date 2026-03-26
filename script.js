
  /* ── Custom Cursor ── */
const curDot  = document.getElementById('curDot');
const curRing = document.getElementById('curRing');
let mx=0, my=0, rx=0, ry=0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  curDot.style.left = mx + 'px';
  curDot.style.top  = my + 'px';
});
(function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  curRing.style.left = rx + 'px';
  curRing.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();
document.addEventListener('mouseleave', () => {
  curDot.style.opacity = '0'; curRing.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  curDot.style.opacity = '1'; curRing.style.opacity = '0.7';
});

/* ── Nav: transparent → solid on scroll ── */
const nav = document.getElementById('mainNav');
function handleNavScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 60);
  document.getElementById('scrollTop').classList.toggle('visible', window.scrollY > 400);
}
window.addEventListener('scroll', handleNavScroll, { passive:true });
handleNavScroll();

/* ── Animated counters ── */
const cntObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.getAttribute('data-target'));
    let cur = 0; const step = target / 80;
    const timer = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = target >= 1000 ? Math.floor(cur).toLocaleString() : Math.floor(cur);
      if (cur >= target) clearInterval(timer);
    }, 18);
    cntObs.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num[data-target]').forEach(el => cntObs.observe(el));

/* ── Hero Slider ── */
let curSlide = 0, TOTAL = 3, autoTimer;
function goSlide(n) {
  document.getElementById('slide-' + curSlide).classList.remove('active');
  document.querySelectorAll('.h-dot')[curSlide].classList.remove('active');
  curSlide = ((n % TOTAL) + TOTAL) % TOTAL;
  document.getElementById('slide-' + curSlide).classList.add('active');
  document.querySelectorAll('.h-dot')[curSlide].classList.add('active');
}
function changeSlide(dir) { clearInterval(autoTimer); goSlide(curSlide + dir); startAuto(); }
function startAuto() { autoTimer = setInterval(() => goSlide(curSlide + 1), 5500); }
startAuto();

/* Keyboard & touch for slider */
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft')  changeSlide(-1);
  if (e.key === 'ArrowRight') changeSlide(1);
  if (e.key === 'Escape')     closeModalBtn();
});
let touchStartX = 0;
document.getElementById('hero').addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive:true });
document.getElementById('hero').addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].screenX;
  if (Math.abs(diff) > 50) changeSlide(diff > 0 ? 1 : -1);
}, { passive:true });

/* ══════════════════════════════════════════
   CCI-INSPIRED ANIMATION OBSERVERS
══════════════════════════════════════════ */

/* ── 1. slide-up: cards, gallery items, general reveals ── */
const slideUpObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.1 });
document.querySelectorAll('.slide-up, .reveal').forEach(el => slideUpObs.observe(el));

/* ── 2. slide-left / slide-right ── */
const slideHObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.12 });
document.querySelectorAll('.slide-left, .slide-right').forEach(el => slideHObs.observe(el));

/* ── 3. scale-up (event cards) ── */
const scaleObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.12 });
document.querySelectorAll('.scale-up').forEach(el => scaleObs.observe(el));

/* ── 4. clip-reveal ── */
const clipObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.15 });
document.querySelectorAll('.clip-reveal').forEach(el => clipObs.observe(el));

/* ── 5. Image overlay wipe reveal ── */
const imgObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.15 });
document.querySelectorAll('.img-reveal-wrap').forEach(el => imgObs.observe(el));

/* ── 6. Grow-line ── */
const lineObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.5 });
document.querySelectorAll('.grow-line').forEach(el => lineObs.observe(el));

/* ── 7. Script label slide-in ── */
const scriptObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.3 });
document.querySelectorAll('.script-label').forEach(el => scriptObs.observe(el));

/* ── 8. Word-by-word headline reveal ── */
function initWordReveal() {
  document.querySelectorAll('[data-word-reveal]').forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(w =>
      `<span class="word-reveal-wrap"><span class="word-reveal">${w}</span></span>`
    ).join(' ');

    const wordObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.word-reveal').forEach((span, i) => {
            setTimeout(() => span.classList.add('in'), i * 80);
          });
          wordObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    wordObs.observe(el);
  });
}
initWordReveal();

/* ── 9. Testimonial card subtle 3D tilt on mouse move ── */
document.querySelectorAll('.t-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect  = card.getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    const rotX  = ((e.clientY - cy) / (rect.height / 2)) * -6;
    const rotY  = ((e.clientX - cx) / (rect.width  / 2)) *  6;
    card.style.transform = `translateY(-4px) perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── 10. Gallery tab switch — re-trigger slide-up on newly shown items ── */
function setGTab(btn, panel) {
  document.querySelectorAll('.g-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.gallery-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const target = document.getElementById('panel-' + panel);
  target.classList.add('active');

  /* Reset & re-trigger slide-up animations for newly visible items */
  target.querySelectorAll('.g-item.slide-up').forEach(item => item.classList.remove('in'));
  requestAnimationFrame(() => {
    target.querySelectorAll('.g-item.slide-up').forEach((item, i) => {
      setTimeout(() => item.classList.add('in'), i * 30);
    });
  });
}

/* ── 11. Parallax on hero scroll ── */
window.addEventListener('scroll', () => {
  const hero = document.getElementById('hero');
  const scrolled = window.scrollY;
  if (scrolled < window.innerHeight) {
    document.querySelectorAll('.slide-bg').forEach(bg => {
      bg.style.transform = `translateY(${scrolled * 0.3}px)`;
    });
  }
}, { passive: true });

/* ── 12. Section background parallax for dark sections ── */
const parallaxSections = document.querySelectorAll('#testimonials');
const parallaxObs2 = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('parallax-active');
    } else {
      e.target.classList.remove('parallax-active');
    }
  });
}, { threshold: 0 });
parallaxSections.forEach(s => parallaxObs2.observe(s));

/* ── Mobile menu ── */
function toggleMenu() {
  document.getElementById('hamburger').classList.toggle('open');
  document.getElementById('mobMenu').classList.toggle('open');
  document.body.style.overflow =
    document.getElementById('mobMenu').classList.contains('open') ? 'hidden' : '';
}

/* ── Modal ── */
function openModal() {
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModalBtn();
}
function closeModalBtn() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Init: trigger animations on items already in view on load ── */
window.addEventListener('load', () => {
  document.querySelectorAll('.slide-up, .scale-up, .slide-left, .slide-right, .reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setTimeout(() => { el.classList.add('in'); el.classList.add('visible'); }, 100);
    }
  });
  /* Trigger img-reveal-wrap for images already on screen */
  document.querySelectorAll('.img-reveal-wrap').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) setTimeout(() => el.classList.add('in'), 200);
  });
});
