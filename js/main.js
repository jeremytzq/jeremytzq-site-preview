(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const mobile = document.getElementById('mobile-menu');

  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  burger?.addEventListener('click', () => mobile.classList.toggle('open'));
  mobile?.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => mobile.classList.remove('open'))
  );

  // Reveal
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => {
    if (reduce) el.classList.add('in');
    else io.observe(el);
  });

  // Count-up for stats
  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    if (Number.isNaN(target)) return;
    const suffix = el.getAttribute('data-suffix') || '';
    if (reduce) {
      el.textContent = target + suffix;
      return;
    }
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  const countIo = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateCount(e.target);
          countIo.unobserve(e.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  document.querySelectorAll('.stat-num[data-count]').forEach((el) => countIo.observe(el));

  // Hero portrait parallax
  const para = document.querySelector('[data-parallax]');
  if (para && !reduce) {
    let raf = 0;
    window.addEventListener(
      'scroll',
      () => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const rect = para.getBoundingClientRect();
          const mid = window.innerHeight / 2;
          const offset = (rect.top + rect.height / 2 - mid) * -0.06;
          para.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
        });
      },
      { passive: true }
    );
  }

  // Lead form → mailto stub
  const form = document.getElementById('lead-form');
  const success = document.getElementById('form-success');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const mobile = (data.get('mobile') || '').toString().trim();
    const interest = (data.get('interest') || '').toString().trim();
    const timeline = (data.get('timeline') || '').toString().trim();
    const message = (data.get('message') || '').toString().trim();
    if (!name || !mobile || !interest || !timeline) {
      form.reportValidity();
      return;
    }
    const subject = encodeURIComponent(`Website enquiry — ${interest} — ${name}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Mobile: ${mobile}`,
        `Interest: ${interest}`,
        `Timeline: ${timeline}`,
        message ? `Message: ${message}` : '',
        '',
        '— Sent from jeremytzq.com redesign preview form stub',
      ]
        .filter(Boolean)
        .join('\n')
    );
    success?.classList.add('show');
    window.location.href = `mailto:hello@jeremytzq.com?subject=${subject}&body=${body}`;
  });

  // New Projects grid
  const grid = document.getElementById('projects-grid');
  const note = document.getElementById('projects-note');
  const list = window.JTRE_PROJECTS || [];
  const meta = window.JTRE_PROJECTS_META || {};
  if (grid) {
    const iconFor = (type) =>
      type === 'EC' ? 'icons/key-FFFFFF.png' : 'icons/building-FFFFFF.png';
    grid.innerHTML = list
      .map((p, i) => {
        const isEc = p.type === 'EC';
        const waText = encodeURIComponent(
          `Hi Jeremy, I'd like to register interest in ${p.name}${isEc ? ' (EC)' : ''}. Can we talk through eligibility, timing and numbers?`
        );
        const rows = [
          ['Tenure', p.tenure],
          ['Developer', p.developer],
          [
            'Units',
            p.units != null
              ? `${p.units}${p.unitsNote ? ` · ${p.unitsNote}` : ''}`
              : null,
          ],
          ['District', p.district],
        ].filter(([, v]) => v);
        const delay = `d${(i % 4) + 1}`;
        return `
<article class="project-card ${isEc ? 'is-ec' : ''} reveal ${delay}">
  <div class="project-visual" aria-hidden="true">
    <div class="project-visual-glow"></div>
    <img src="${iconFor(p.type)}" alt="">
    <span class="project-type-pill">${p.type}</span>
  </div>
  <div class="project-body">
    <h3>${p.name}</h3>
    <p class="project-loc">${p.location}${p.district ? ` · ${p.district}` : ''}</p>
    <span class="project-status ${p.statusKind === 'launched' ? 'launched' : ''}">${p.status || ''}</span>
    <dl class="project-meta">
      ${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
    </dl>
    ${p.priceFrom ? `<div class="project-price">${p.priceFrom}</div>` : ''}
    ${p.blurb ? `<p class="project-blurb">${p.blurb}</p>` : ''}
    <div class="project-actions">
      <a class="btn btn-primary btn-sm" href="https://wa.me/6588868851?text=${waText}" target="_blank" rel="noopener">
        <img class="icon" src="icons/whatsapp-FFFFFF.png" alt=""> Register interest
      </a>
    </div>
  </div>
</article>`;
      })
      .join('');
    if (note) {
      note.textContent =
        meta.note || 'Info as at Oct 2026, subject to change.';
    }
    grid.querySelectorAll('.reveal').forEach((el) => {
      if (reduce) el.classList.add('in');
      else io.observe(el);
    });
  }

  // Hero entrance
  if (!reduce) document.documentElement.classList.add('motion-ok');
})();
