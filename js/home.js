/* ═══════════════════════════════════════════════════════════════
   JADED — home.js
   concept, design & code by ghostly.grl ♥
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const { $, $$, RM, JADES } = JD;
  const hasG = !!(window.gsap && window.ScrollTrigger);
  const ST = (o) => (hasG && !RM ? o : null);

  /* ---------- hero ---------- */
  JD.ready.then(() => {
    if (!hasG || RM) return;
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .from('.blk', { clipPath: 'inset(100% 0 0 0)', duration: 1.2, stagger: 0.14 })
      .from('.blk__cn', { yPercent: 40, opacity: 0, duration: 1.2, stagger: 0.14 }, '<.2')
      .from('.blk__lat', { xPercent: -30, opacity: 0, duration: 1.1, stagger: 0.12 }, '<.3')
      .from('.hero__bangle', { y: -500, rotate: -40, duration: 1.4, ease: 'bounce.out' }, '<-.3')
      .call(() => JD.tap($('.hero__bangle'), null, { quiet: true }), null, '-=.75')
      .from('.hero__intro > *, .hero__year, .hero__vert', { y: 20, opacity: 0, duration: 1, stagger: 0.06 }, '<')
      .from('.hero__hours > *, .hero__word > *', { y: 30, opacity: 0, duration: 1, stagger: 0.06 }, '<.2')
      .from('.hero .seal', { scale: 2.2, opacity: 0, rotate: -20, duration: 0.5, ease: 'back.out(3)', stagger: 0.12 }, '<.3')
      .from('.hero__aside p, .hero__hint', { opacity: 0, duration: 1 }, '<');
    ['.blk--1', '.blk--2', '.blk--3'].forEach((s, i) => gsap.to(s, { yPercent: -16 - i * 14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } }));
    gsap.to('.hero__bangle', { yPercent: 18, rotate: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  });

  /* ---------- the test ---------- */
  // 01 · it rings: draw the decay
  const wv = $('[data-wave]'), wctx = wv.getContext('2d');
  let wT = 0, wF = 0, wRaf = 0;
  const drawWave = () => {
    const r = wv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
    if (wv.width !== Math.round(r.width * d)) { wv.width = Math.round(r.width * d); wv.height = Math.round(r.height * d); }
    const W = r.width, H = r.height, t = (performance.now() - wT) / 1000;
    wctx.setTransform(d, 0, 0, d, 0, 0); wctx.clearRect(0, 0, W, H);
    wctx.strokeStyle = '#140e10'; wctx.lineWidth = 1.4; wctx.beginPath();
    for (let x = 0; x <= W; x++) {
      const p = x / W, env = Math.exp(-p * 3.2) * Math.max(0, 1 - t / 2.6);
      const y = H / 2 + Math.sin(p * wF * 0.06 + t * 40) * env * (H * 0.45);
      x ? wctx.lineTo(x, y) : wctx.moveTo(x, y);
    }
    wctx.stroke();
    if (t < 2.6) wRaf = requestAnimationFrame(drawWave); else wRaf = 0;
  };
  $('.tcard--tap').addEventListener('ring', (e) => { wT = performance.now(); wF = JADES[e.detail.kind].f; if (!wRaf) drawWave(); });
  // flat line to start
  requestAnimationFrame(() => { wT = performance.now() - 5000; drawWave(); });

  // 02 · it stays cold: press and hold
  const hold = $('[data-hold]'), tEl = $('[data-temp]'), bar = $('[data-temp-bar]'), hl = $('[data-hold-line]');
  let temp = 18, holding = false, last = 0;
  const LINES = [[18.6, 'press and hold. real jade takes ages to warm up. like you, eventually.'], [19.6, 'still cold. that’s the point.'], [20.8, 'a little warmer. don’t get attached. (get attached.)'], [22, 'there. it took its time. it’ll stay warm now.']];
  const tick = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    temp += holding ? dt * 0.55 * (1 - (temp - 18) / 6) : -dt * 0.9;
    temp = Math.max(18, Math.min(23.4, temp));
    tEl.textContent = temp.toFixed(1); bar.style.width = ((temp - 18) / 5.4) * 100 + '%';
    const l = [...LINES].reverse().find(([v]) => temp >= v) || LINES[0]; if (hl.textContent !== l[1]) hl.textContent = l[1];
    if (holding || temp > 18) requestAnimationFrame(tick);
  };
  const start = (e) => { e.preventDefault(); holding = true; hold.classList.add('is-holding'); last = performance.now(); requestAnimationFrame(tick); };
  const stop = () => { holding = false; hold.classList.remove('is-holding'); };
  hold.addEventListener('pointerdown', start); addEventListener('pointerup', stop); hold.addEventListener('pointerleave', stop);
  hold.addEventListener('keydown', (e) => { if (e.key === ' ' || e.key === 'Enter') { if (!holding) start(e); } });
  hold.addEventListener('keyup', stop);

  // 03 · light goes through: a torch
  const torch = $('[data-torch]');
  const lit = document.createElement('span'); lit.className = 'torch__lit'; JD.paint(lit, 'honey'); torch.appendChild(lit);
  torch.addEventListener('pointermove', (e) => { const r = lit.getBoundingClientRect(); lit.style.setProperty('--mx', e.clientX - r.left + 'px'); lit.style.setProperty('--my', e.clientY - r.top + 'px'); });
  torch.addEventListener('pointerleave', () => { lit.style.setProperty('--mx', '-200px'); });

  /* ---------- the album: tracklist ---------- */
  const tl = $('[data-tracks]');
  JD.PIECES.forEach((pc, i) => {
    const li = document.createElement('li');
    li.className = 'tr' + (pc.bonus ? ' tr--bonus' : ''); li.dataset.kind = pc.kind; li.dataset.cursor = 'play'; li.tabIndex = 0; li.dataset.i = i;
    const dot = pc.also ? `linear-gradient(90deg, ${JADES[pc.kind].c} 50%, ${JADES[pc.also].c} 50%)` : JADES[pc.kind].c;
    li.innerHTML = `<span class="tr__play">▶</span><span class="tr__t"><b>${pc.no} · ${pc.track}</b><span>${pc.what}</span></span><span class="tr__dot" style="background:${dot}"></span><span class="tr__p">${JD.euro(pc.price)}</span>`;
    tl.appendChild(li);
  });
  const play = (li) => {
    $$('.tr').forEach((x) => x.classList.remove('is-playing'));
    li.classList.add('is-playing'); $('.tr__play', li).textContent = '♪';
    JD.ring(JADES[li.dataset.kind].f * (1 + (+li.dataset.i % 3) * 0.12));
    clearTimeout(li._t); li._t = setTimeout(() => { li.classList.remove('is-playing'); $('.tr__play', li).textContent = '▶'; }, 2200);
  };
  tl.addEventListener('click', (e) => { const li = e.target.closest('.tr'); if (li) play(li); });
  tl.addEventListener('keydown', (e) => { const li = e.target.closest('.tr'); if (li && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); play(li); } });
  // the peek: a little card follows the cursor with the piece
  const peek = $('.peek'), pin = $('.peek__in');
  let px = 0, py = 0, cx = 0, cy = 0, pRaf = 0;
  const follow = () => { cx += (px - cx) * 0.2; cy += (py - cy) * 0.2; peek.style.transform = `translate(${cx}px,${cy}px) scale(${peek.classList.contains('is-on') ? 1 : 0.6})`; pRaf = peek.classList.contains('is-on') ? requestAnimationFrame(follow) : 0; };
  tl.addEventListener('pointermove', (e) => { px = e.clientX; py = e.clientY; });
  tl.addEventListener('pointerover', (e) => {
    const li = e.target.closest('.tr'); if (!li || li === tl._cur) return; tl._cur = li;
    const pc = JD.PIECES[+li.dataset.i];
    pin.innerHTML = '<span data-bangle></span>'; JD.paint($('[data-bangle]', pin), pc.kind, pc.img);
    if (!peek.classList.contains('is-on')) { cx = px; cy = py; peek.classList.add('is-on'); if (!pRaf) follow(); }
  });
  tl.addEventListener('pointerleave', () => { peek.classList.remove('is-on'); tl._cur = null; });

  /* ---------- the colours ---------- */
  const win = $('[data-win]'), wb = $('[data-win-bangle]'), chips = $('[data-chips]');
  const SKY2 = { imperial: '#7fd1a8', lavender: '#e2d3f7', icy: '#eef8f4', honey: '#f6cf8a', black: '#5d6e65' };
  Object.entries(JADES).forEach(([k, j], i) => {
    const b = document.createElement('button');
    b.className = 'chip' + (i ? '' : ' is-on'); b.dataset.k = k; b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', !i); b.dataset.cursor = j.name;
    b.innerHTML = `<span class="chip__bar" style="--a:${j.a};--b:${j.b}"></span><b>${j.name}</b><span class="mono">${j.cn} · ${j.c}</span>`;
    chips.appendChild(b);
  });
  const setCol = (k, silent) => {
    const j = JADES[k];
    $$('.chip', chips).forEach((c) => { const on = c.dataset.k === k; c.classList.toggle('is-on', on); c.setAttribute('aria-checked', on); });
    win.style.setProperty('--c', j.c); win.style.setProperty('--c2', SKY2[k]);
    wb.dataset.tap = k; JD.paint($('.tap__fallback', wb), k);
    const txt = [$('[data-col-cn]'), $('[data-col-name]'), $('[data-col-line]')];
    const swap = () => { txt[0].textContent = j.cn; txt[1].textContent = j.name; txt[2].textContent = j.line; };
    if (hasG && !RM) gsap.timeline().to(txt, { y: -14, opacity: 0, duration: 0.25, stagger: 0.04 }).call(swap).to(txt, { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: 'expo.out' });
    else swap();
    if (!silent) JD.tap(wb, k);
  };
  chips.addEventListener('click', (e) => { const c = e.target.closest('.chip'); if (c) setCol(c.dataset.k); });
  if (hasG && !RM) {
    gsap.from('.win', { clipPath: 'inset(14% 10% 14% 10%)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.colours', start: 'top 75%' } });
    gsap.from('.chip', { y: 80, opacity: 0, stagger: 0.08, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.chart', start: 'top 85%' } });
    gsap.from('.chart__head > *', { x: -40, opacity: 0, stagger: 0.08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.chart', start: 'top 85%' } });
  }

  /* ---------- the call ---------- */
  const clock = $('[data-clock]');
  const setClock = () => { const d = new Date(); clock.textContent = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
  setClock(); setInterval(setClock, 30000);
  if (hasG && !RM) {
    gsap.from('.notes li', { y: -30, scale: 0.9, opacity: 0, stagger: 0.35, duration: 0.8, ease: 'back.out(2)', scrollTrigger: { trigger: '.call', start: 'top 55%' } });
    gsap.from('.call__phone', { y: 120, rotate: 6, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.call', start: 'top 75%' } });
    gsap.from('.call__photo', { clipPath: 'inset(0 100% 0 0)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: '.call', start: 'top 75%' } });
    gsap.from('.call__copy > *', { y: 40, opacity: 0, stagger: 0.08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.call', start: 'top 60%' } });
  }

  /* ---------- your year ---------- */
  const Z = [
    ['rat', '鼠', 'honey', 'clever, charming, already has a plan b. this is plan b.'],
    ['ox', '牛', 'black', 'loyal to a fault. the fault was them.'],
    ['tiger', '虎', 'imperial', 'you don’t wait for the call. you are the call.'],
    ['rabbit', '兔', 'lavender', 'soft heart, sharp memory. you remember everything they said.'],
    ['dragon', '龍', 'imperial', 'main character. buy the big bangle.'],
    ['snake', '蛇', 'lavender', 'calm, cold, a little dangerous. like jade, actually.'],
    ['horse', '馬', 'honey', 'always leaving first. good. keep it that way.'],
    ['goat', '羊', 'icy', 'too kind for them. start with yourself.'],
    ['monkey', '猴', 'honey', 'bored by the second date. jade won’t bore you. it’s seen worse.'],
    ['rooster', '雞', 'icy', 'you’re right. you were right then too.'],
    ['dog', '狗', 'black', 'you waited the longest. not anymore.'],
    ['pig', '豬', 'lavender', 'generous, warm, deserves a gift. from you, to you.'],
  ];
  const yi = $('[data-yr-input]');
  const showYear = () => {
    let y = parseInt(yi.value, 10); if (isNaN(y)) return; y = Math.max(1940, Math.min(2025, y));
    const [name, cn, col, line] = Z[(((y - 4) % 12) + 12) % 12], j = JADES[col];
    $('[data-z-name]').textContent = name; $('[data-z-col]').textContent = j.name; $('[data-z-line]').textContent = line;
    const zc = $('.year__luck b'); zc.style.setProperty('--zc', j.c); zc.style.setProperty('--zt', col === 'icy' || col === 'lavender' || col === 'honey' ? '#140e10' : '#f3ece2');
    const c = $('[data-z-cn]');
    if (c.textContent !== cn) { if (hasG && !RM) gsap.timeline().to(c, { rotationY: 90, duration: 0.18, ease: 'power2.in' }).call(() => (c.textContent = cn)).to(c, { rotationY: 0, duration: 0.4, ease: 'back.out(2)' }); else c.textContent = cn; }
    JD.set('year', y);
  };
  yi.value = JD.get('year', 2001);
  yi.addEventListener('input', showYear);
  $$('[data-yr]').forEach((b) => b.addEventListener('click', () => { yi.value = Math.max(1940, Math.min(2025, (+yi.value || 2001) + +b.dataset.yr)); showYear(); }));
  showYear();

  /* ---------- the box & certificate ---------- */
  const cert = $('.cert');
  $('[data-stamp]').addEventListener('click', () => {
    cert.classList.add('is-stamped'); JD.thud();
    if (hasG && !RM) gsap.fromTo('.cert__stamp .seal', { scale: 2.2, rotate: -30 }, { scale: 1, rotate: -8, duration: 0.45, ease: 'back.out(3)' });
    if (hasG && !RM) gsap.fromTo(cert, { rotate: -1.2, y: 0 }, { y: 4, rotate: -0.6, duration: 0.12, yoyo: true, repeat: 1 });
    JD.toast('<b>真品</b> certified. real. unlike some people.');
  });
  if (hasG && !RM) {
    gsap.from('.box__cn', { scale: 0.85, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.box', start: 'top 75%' } });
    gsap.from('.bx', { y: 100, rotate: (i) => [-4, 3, -2, 4][i], opacity: 0, stagger: 0.1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.box__grid', start: 'top 85%' } });
    gsap.from('.cert', { y: 80, rotate: 4, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.cert', start: 'top 90%' } });
  }

  /* ---------- the rest ---------- */
  if (hasG && !RM) {
    gsap.from('.test__head > *', { y: 40, opacity: 0, stagger: 0.08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.test', start: 'top 70%' } });
    gsap.from('.tcard', { y: 120, rotate: (i) => [-3, 2, -2][i], opacity: 0, stagger: 0.12, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.test__grid', start: 'top 85%' } });
    gsap.from('.album__title b', { yPercent: 100, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.album', start: 'top 70%' } });
    gsap.from('.album__title em, .album__vol, .album__sticker', { opacity: 0, y: 20, stagger: 0.1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.album', start: 'top 60%' } });
    gsap.from('.tr', { x: 60, opacity: 0, stagger: 0.05, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: '.tracks', start: 'top 80%' } });
    gsap.from('.year__cn', { scale: 0.6, rotate: -8, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.year', start: 'top 70%' } });
    gsap.from('.ft__word > *', { yPercent: 100, opacity: 0, stagger: 0.1, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.ft', start: 'top 70%' } });
  }
})();
