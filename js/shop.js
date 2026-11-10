/* ═══════════════════════════════════════════════════════════════
   JADED — shop.js (the pieces)
   concept, design & code by ghostly.grl ♥
   the catalogue lives in main.js (JD.PIECES), shared with the home.
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const { $, $$, RM, JADES, PIECES } = JD;
  const hasG = !!(window.gsap && window.ScrollTrigger);
  const SIZES = [52, 54, 56, 58, 60, 62];
  const byId = (id) => PIECES.find((p) => p.id === id);

  /* ---------- 01 · the garden: pieces on silk cords ---------- */
  const strings = $('[data-strings]');
  const mobile = innerWidth < 861;
  const k = mobile ? 0.55 : Math.min(1.15, innerWidth / 1440 + 0.15);
  // x position (%), cord length (px) — arranged like the lanterns: long at the edges, short in the middle
  const LAYOUT = [[7, 250], [19, 110], [31, 320], [43, 60], [57, 170], [69, 40], [80, 290], [91, 120], [50, 380]];
  const DIM = { bangle: [200, 110], pendant: [70, 160], charm: [110, 196] };
  const swings = [];
  PIECES.forEach((p, i) => {
    let [x, len] = LAYOUT[i];
    if (p.bonus) { x = 24; len = 430; }
    const [w, h] = p.bonus ? [180, 176] : DIM[p.type];
    const s = document.createElement('div');
    s.className = 'str'; s.style.left = x + '%';
    s.style.setProperty('--len', len * (mobile ? 1.05 : k) + 'px'); s.style.setProperty('--w', w * k + 'px'); s.style.setProperty('--h', h * k + 'px');
    s.style.marginLeft = (-w * k) / 2 + 'px'; s.style.width = w * k + 'px';
    s.innerHTML = `<span class="str__cord"></span><span class="str__knot"></span>
      <button class="str__piece tap" data-tap="${p.kind}" data-cursor="tap it" aria-label="${p.track}: tap to hear it ring"><span class="tap__fallback"></span><span class="tap__ripples"></span></button>
      <span class="str__tag">${p.no} · ${p.track}</span>`;
    strings.appendChild(s);
    JD.paint($('.tap__fallback', s), p.kind, p.img);
    swings.push(s);
    // idle: a draft from the window
    if (hasG && !RM) gsap.to(s, { rotation: (i % 2 ? 1 : -1) * (1.2 + Math.random()), duration: 2.4 + Math.random() * 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: Math.random() });
    // tap → it swings
    s.addEventListener('ring', () => {
      if (!hasG || RM) return;
      gsap.killTweensOf(s);
      gsap.fromTo(s, { rotation: (Math.random() > 0.5 ? 1 : -1) * 16 }, { rotation: 0, duration: 2.6, ease: 'elastic.out(1, .18)',
        onComplete: () => gsap.to(s, { rotation: (i % 2 ? 1 : -1) * 1.6, duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut' }) });
    });
    // brush past it → it moves a little
    let lx = 0;
    s.addEventListener('pointermove', (e) => { const dx = e.clientX - lx; lx = e.clientX; if (hasG && !RM && Math.abs(dx) > 3) gsap.to(s, { rotation: `+=${Math.max(-4, Math.min(4, dx * 0.3))}`, duration: 0.4, overwrite: 'auto' }); });
  });

  JD.ready.then(() => {
    if (!hasG || RM) return;
    gsap.from(swings, { yPercent: -160, duration: 1.6, stagger: 0.08, ease: 'elastic.out(1, .5)' });
    gsap.from('.gd__cn', { y: 60, opacity: 0, duration: 1.2, ease: 'expo.out', delay: 0.5 });
    gsap.from('.gd__lat, .gd__sub', { y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out', delay: 0.7 });
    gsap.from('.gd__calli', { opacity: 0, y: -40, duration: 2, ease: 'expo.out', delay: 0.4 });
    gsap.from('.gd__seal', { scale: 2.4, opacity: 0, rotate: -30, duration: 0.6, ease: 'back.out(3)', delay: 1.1 });
    gsap.to('.gd__strings', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.gd', start: 'top top', end: 'bottom top', scrub: true } });
  });

  /* ---------- 02 · the tray ---------- */
  const velvet = $('[data-velvet]');
  PIECES.forEach((p) => {
    const c = document.createElement('article');
    c.className = 'pc'; c.dataset.id = p.id; c.dataset.cursor = 'open'; c.tabIndex = 0;
    c.innerHTML = `<div class="pc__well"><span class="pc__no">${p.no}</span>${p.bonus ? '<span class="pc__bonus">bonus track</span>' : ''}<span class="pc__held">on the counter</span><span class="tap__fallback"></span></div>
      <div class="pc__info"><b>${p.track}</b><span>${p.what}</span><i>${JD.euro(p.price)}</i></div>`;
    velvet.appendChild(c);
    JD.paint($('.tap__fallback', c), p.kind, p.img);
    c.addEventListener('click', () => open(p));
    c.addEventListener('keydown', (e) => e.key === 'Enter' && open(p));
  });
  // colour chips from the five jades
  const kg = $('[data-f="kind"]');
  Object.entries(JADES).forEach(([key, j]) => { const b = document.createElement('button'); b.dataset.v = key; b.style.setProperty('--c', j.c); b.innerHTML = `<i></i>${j.name}`; kg.appendChild(b); });

  const F = { kind: 'all', type: 'all', sort: 'no' };
  const apply = () => {
    const ok = (p) => (F.kind === 'all' || p.kind === F.kind || p.also === F.kind) && (F.type === 'all' || p.type === F.type);
    const list = [...PIECES].sort((a, b) => (F.sort === 'lo' ? a.price - b.price : F.sort === 'hi' ? b.price - a.price : a.no.localeCompare(b.no)));
    let n = 0;
    list.forEach((p) => { const c = $(`.pc[data-id="${p.id}"]`, velvet); velvet.appendChild(c); c.hidden = !ok(p); if (!c.hidden) n++; });
    $('[data-shown]').textContent = n; $('.tray__empty').hidden = n > 0;
    if (hasG && !RM) gsap.fromTo($$('.pc:not([hidden])'), { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: 0.6, ease: 'expo.out', overwrite: true });
    window.ScrollTrigger && ScrollTrigger.refresh();
  };
  $$('[data-f]').forEach((g) => g.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    $$('button', g).forEach((x) => x.classList.toggle('is-on', x === b));
    F[g.dataset.f] = b.dataset.v; apply();
    if (g.dataset.f === 'kind' && b.dataset.v !== 'all') JD.ring(b.dataset.v, 0.5);
  }));
  $('[data-sort]').addEventListener('change', (e) => { F.sort = e.target.value; apply(); });

  /* ---------- the counter strip (held pieces) ---------- */
  const held = () => JD.get('held', []).filter((h) => h.until > Date.now());
  const renderHeld = () => {
    const H = held(), ul = $('[data-held]');
    ul.innerHTML = '';
    H.forEach((h) => {
      const p = byId(h.id); if (!p) return;
      const li = document.createElement('li');
      li.innerHTML = `<span data-bangle></span><span>${p.track}${h.size ? ` · ${h.size} mm` : ''}</span><small>till ${new Date(h.until).toLocaleDateString('en-GB', { weekday: 'short' }).toLowerCase()}</small><button data-unhold="${p.id}" aria-label="let it go">let go ✕</button>`;
      ul.appendChild(li); JD.paint($('[data-bangle]', li), p.kind, p.img);
    });
    $('[data-held-empty]').hidden = H.length > 0;
    $$('.pc').forEach((c) => c.classList.toggle('is-held', H.some((h) => h.id === c.dataset.id)));
  };
  $('[data-held]').addEventListener('click', (e) => {
    const b = e.target.closest('[data-unhold]'); if (!b) return;
    JD.set('held', held().filter((h) => h.id !== b.dataset.unhold)); renderHeld();
    JD.toast('let go. <b>it’s fine.</b> you’re getting good at that.');
  });
  renderHeld();

  /* ---------- the counter (detail) ---------- */
  const ctr = $('.counter'), piece = $('.counter__piece');
  let cur = null, size = JD.get('size', 56);
  function open(p) {
    cur = p;
    piece.dataset.tap = p.kind; JD.paint($('[data-c-img]'), p.kind, p.img);
    $('[data-c-no]').textContent = p.no;
    $('[data-c-kind]').textContent = `${JADES[p.kind].name}${p.also ? ' + ' + JADES[p.also].name : ''} · ${p.type}`;
    $('[data-c-track]').textContent = p.track;
    $('[data-c-what]').textContent = p.what;
    $('[data-c-line]').textContent = p.line;
    $('[data-c-price]').textContent = JD.euro(p.price);
    const sz = $('[data-sz]'), box = $('[data-c-sizes]');
    box.hidden = p.type !== 'bangle';
    sz.innerHTML = SIZES.map((s) => `<button class="${s === size ? 'is-on' : ''}" data-s="${s}">${s}</button>`).join('');
    const isHeld = held().some((h) => h.id === p.id);
    $('[data-hold-it] span').textContent = isHeld ? 'it’s on the counter for you' : 'hold it at the counter';
    ctr.classList.add('is-open'); ctr.setAttribute('aria-hidden', 'false'); document.body.classList.add('counter-open'); JD.lenis && JD.lenis.stop();
    if (hasG && !RM) {
      gsap.from('.counter__body > *', { y: 24, opacity: 0, stagger: 0.05, duration: 0.7, delay: 0.15, ease: 'expo.out' });
      gsap.fromTo(piece, { y: -120, rotate: -14 }, { y: 0, rotate: 0, duration: 1.2, ease: 'bounce.out', delay: 0.1 });
    }
    history.replaceState(null, '', '#' + p.id);
  }
  const close = () => { ctr.classList.remove('is-open'); ctr.setAttribute('aria-hidden', 'true'); document.body.classList.remove('counter-open'); JD.lenis && JD.lenis.start(); history.replaceState(null, '', location.pathname); };
  $$('[data-close]', ctr).forEach((b) => b.addEventListener('click', close));
  addEventListener('keydown', (e) => e.key === 'Escape' && ctr.classList.contains('is-open') && close());
  $('[data-sz]').addEventListener('click', (e) => { const b = e.target.closest('[data-s]'); if (!b) return; size = +b.dataset.s; JD.set('size', size); $$('[data-s]').forEach((x) => x.classList.toggle('is-on', x === b)); syncSize(); });
  $('[data-close-to-size]').addEventListener('click', (e) => { e.preventDefault(); close(); setTimeout(() => (JD.lenis ? JD.lenis.scrollTo('#size', { offset: -40 }) : $('#size').scrollIntoView()), 80); });
  $('[data-hold-it]').addEventListener('click', () => {
    if (!cur) return;
    const until = Date.now() + 48 * 3600e3, H = held().filter((h) => h.id !== cur.id);
    H.push({ id: cur.id, size: cur.type === 'bangle' ? size : null, until }); JD.set('held', H);
    $('[data-hold-it] span').textContent = 'it’s on the counter for you';
    JD.toast(`<b>${cur.track}</b> is on the counter until ${new Date(until).toLocaleDateString('en-GB', { weekday: 'long' }).toLowerCase()}. it waits. it’s good at that.`);
    JD.ring(cur.kind, 0.6); renderHeld();
  });
  const deep = byId(location.hash.slice(1));
  if (deep) JD.ready.then(() => setTimeout(() => open(deep), 500));

  /* ---------- 03 · find your size ---------- */
  const hand = $('[data-hand]'), ring = $('[data-ring]'), scale = $('[data-scale]');
  scale.innerHTML = SIZES.map((s) => `<li data-v="${s}">${s} mm</li>`).join('');
  const LINE = { 52: 'dainty. it’ll stay exactly where you put it.', 54: 'small and snug. very you.', 56: 'the classic. snug over the knuckles, loose on the wrist.', 58: 'a little room to move. like your new rule about texting back.', 60: 'roomy. it’ll slide and clink. good.', 62: 'big hands, big bangle, big energy.' };
  const toMM = (cm) => Math.max(52, Math.min(62, 56 + Math.round(((cm - 7.6) * 5) / 2) * 2));
  function syncSize(fromSlider) {
    if (fromSlider) size = toMM(+hand.value);
    $('[data-hand-v]').textContent = (+hand.value).toFixed(1);
    hand.style.setProperty('--p', ((hand.value - 6.5) / 3) * 100 + '%');
    $('[data-size]').textContent = size; $('[data-size-line]').textContent = LINE[size];
    ring.style.setProperty('--s', 0.42 + ((size - 52) / 10) * 0.5);
    $$('li', scale).forEach((li) => li.classList.toggle('is-on', +li.dataset.v === size));
    JD.set('size', size);
  }
  hand.value = JD.get('hand', 7.6);
  hand.addEventListener('input', () => { const before = size; syncSize(true); JD.set('hand', +hand.value); if (size !== before) JD.ring(600 + (size - 52) * 40, 0.35); });
  syncSize(true);

  /* ---------- 04 · four ways ---------- */
  $$('.way__img').forEach((el) => JD.paint(el, el.dataset.bangle));

  /* ---------- scroll motion ---------- */
  if (hasG && !RM) {
    gsap.from('.velvet', { y: 80, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.tray', start: 'top 80%' } });
    gsap.from('.pc', { y: 50, opacity: 0, stagger: 0.06, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.velvet', start: 'top 75%' } });
    gsap.from('.size__copy > *', { y: 40, opacity: 0, stagger: 0.08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.size', start: 'top 70%' } });
    gsap.from('.size__stage', { clipPath: 'inset(0 0 100% 0)', duration: 1.3, ease: 'expo.inOut', scrollTrigger: { trigger: '.size', start: 'top 70%' } });
    gsap.from('.ways__head h2', { y: 50, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.ways', start: 'top 70%' } });
    $$('.way').forEach((w) => {
      gsap.timeline({ scrollTrigger: { trigger: w, start: 'top 82%' } })
        .fromTo(w, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.3, ease: 'expo.inOut' })
        .from($('.way__img', w), { y: -60, rotate: -10, opacity: 0, duration: 1, ease: 'bounce.out' }, '-=.5')
        .from($$('.way__cn span', w), { y: 50, opacity: 0, stagger: 0.1, duration: 0.9, ease: 'expo.out' }, '<')
        .from($('.way__tag', w), { scaleY: 0, transformOrigin: 'top', duration: 0.7, ease: 'expo.out' }, '<.1');
    });
    gsap.from('.held > *', { y: 30, opacity: 0, stagger: 0.1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.held', start: 'top 85%' } });
  }
})();
