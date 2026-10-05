(function () {
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

  // Reveal on scroll
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
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

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
    // Open mailto (documented stub — replace with CRM endpoint before go-live)
    window.location.href = `mailto:hello@jeremytzq.com?subject=${subject}&body=${body}`;
  });
})();
