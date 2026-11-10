/* ═══════════════════════════════════════════════════════════════
   JADED — colours.js (the five jades)
   concept, design & code by ghostly.grl ♥
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const { $, $$, RM, JADES } = JD;
  const hasG = !!(window.gsap && window.ScrollTrigger);
  const ORDER = ['imperial', 'lavender', 'icy', 'honey', 'black'];
  const MORE = {
    imperial: { rarity: 5, glow: 4, warmth: 2, from: 620, note: 'C6', pairs: 'icy, black', piece: 'the-exs-birthday', per1000: 4 },
    lavender: { rarity: 3, glow: 4, warmth: 3, from: 160, note: 'A5', pairs: 'icy, honey', piece: 'left-on-read', per1000: 35 },
    icy:      { rarity: 4, glow: 5, warmth: 1, from: 320, note: 'E6', pairs: 'lavender, imperial', piece: 'seen-2347', per1000: 18 },
    honey:    { rarity: 2, glow: 3, warmth: 5, from: 210, note: 'G5', pairs: 'black, lavender', piece: 'im-fine', per1000: 60 },
    black:    { rarity: 3, glow: 1, warmth: 2, from: 240, note: 'E5', pairs: 'imperial, honey', piece: 'u-up', per1000: 22 },
  };
  const px = (n) => [1, 2, 3, 4, 5].map((i) => `<i class="${i <= n ? 'on' : ''}"></i>`).join('');
  const vars = (j) => `--a:${j.a};--b:${j.b};--c:${j.c}`;

  /* ---------- the board ---------- */
  const dots = $('[data-dots]');
  ORDER.forEach((k) => {
    const j = JADES[k], li = document.createElement('li');
    li.style.cssText = vars(j); li.dataset.cursor = 'listen';
    li.innerHTML = `<span></span><b>${j.cn}<br />${j.c}</b>`;
    li.addEventListener('click', () => JD.ring(k));
    dots.appendChild(li);
  });
  $$('.bd__views [data-bangle]').forEach((el) => JD.paint(el, 'imperial'));
  JD.ready.then(() => {
    if (!hasG || RM) return;
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .from('.bd__cn', { yPercent: 60, opacity: 0, duration: 1.2 })
      .from('.bd__lat', { letterSpacing: '1em', opacity: 0, duration: 1.4 }, '<.1')
      .from('.bd__kick, .bd__arc', { opacity: 0, duration: 1 }, '<')
      .from('.bd__panel', { y: 80, opacity: 0, duration: 1.2 }, '<.2')
      .from('.bd__dots li', { scale: 0, stagger: 0.07, duration: 0.8, ease: 'back.out(2)' }, '<.3')
      .from('.bd__views figure', { y: 30, opacity: 0, stagger: 0.08, duration: 0.8 }, '<');
  });

  /* ---------- the five chapters ---------- */
  const track = $('[data-track]');
  ORDER.forEach((k, i) => {
    const j = JADES[k], m = MORE[k];
    const s = document.createElement('article');
    s.className = 'cp cp--' + k; s.style.cssText = vars(j);
    s.innerHTML = `
      <p class="cp__no"><b>0${i + 1}</b> / 05</p>
      <h2 class="cp__cn">${j.cn}</h2>
      <div class="cp__stage">
        <button class="cp__bangle tap" data-tap="${k}" data-cursor="tap it" aria-label="${j.name}: tap to hear it"><span class="tap__fallback"></span><span class="tap__ripples"></span></button>
        <p class="cp__name">${j.name}</p>
      </div>
      <div class="cp__info">
        <p class="cp__for"><small>this one is</small>${j.line}</p>
        <div class="cp__stats">
          <span class="mono">rarity</span><span class="px">${px(m.rarity)}</span>
          <span class="mono">glow</span><span class="px">${px(m.glow)}</span>
          <span class="mono">warmth</span><span class="px">${px(m.warmth)}</span>
          <span class="mono">texts back</span><span class="mono">never. it’s a stone.</span>
          <span class="mono">pairs with</span><span>${m.pairs}</span>
        </div>
        <p class="cp__price">from ${JD.euro(m.from)}</p>
        <div class="cp__btns">
          <button class="cp__ring" data-ring-k="${k}" data-cursor="listen">♪ hear it · ${m.note}</button>
          <a class="cp__link" href="shop.html#${m.piece}" data-cursor="shop">see the ${j.name} piece →</a>
        </div>
      </div>`;
    track.appendChild(s);
    JD.paint($('.tap__fallback', s), k);
    $('[data-ring-k]', s).addEventListener('click', () => JD.tap($('.cp__bangle', s), k));
    // tilt with the cursor
    const stage = $('.cp__stage', s), b = $('.cp__bangle', s);
    stage.addEventListener('pointermove', (e) => { const r = stage.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; b.style.transform = `rotateY(${x * 24}deg) rotateX(${-y * 30}deg)`; });
    stage.addEventListener('pointerleave', () => (b.style.transform = ''));
  });

  if (hasG && !RM) {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 861px)', () => {
      const n = ORDER.length, prog = $('[data-prog]');
      const tw = gsap.to(track, {
        xPercent: (-100 * (n - 1)) / n, ease: 'none',
        scrollTrigger: { trigger: '.ch', start: 'top top', end: () => '+=' + innerWidth * (n - 1), pin: '.ch__pin', scrub: 0.7, snap: { snapTo: 1 / (n - 1), duration: 0.5, ease: 'power2.inOut' }, invalidateOnRefresh: true,
          onUpdate: (st) => { prog.style.width = ((st.progress * (n - 1) + 1) / n) * 100 + '%'; } },
      });
      track.style.width = n * 100 + 'vw';
      $$('.cp').forEach((cp, i) => {
        if (!i) return; // the first chapter is already on screen
        gsap.from($('.cp__name', cp), { yPercent: 60, opacity: 0, ease: 'expo.out', duration: 1, scrollTrigger: { trigger: cp, containerAnimation: tw, start: 'left 60%' } });
        gsap.from($('.cp__info', cp).children, { x: 60, opacity: 0, stagger: 0.06, ease: 'expo.out', duration: 1, scrollTrigger: { trigger: cp, containerAnimation: tw, start: 'left 55%' } });
      });
      return () => { track.style.width = ''; };
    });
  }

  /* ---------- rarity: 1000 squares per colour ---------- */
  const chart = $('[data-rarity]');
  const rows = [...ORDER].sort((a, b) => MORE[a].per1000 - MORE[b].per1000);
  const draws = [];
  rows.forEach((k) => {
    const j = JADES[k], m = MORE[k];
    const r = document.createElement('div'); r.className = 'rr';
    r.innerHTML = `<p class="rr__n"><b>${j.name}</b><span>${j.cn}</span></p><canvas aria-label="${m.per1000} in 1000"></canvas><p class="rr__v"><span data-v>0</span><small>in 1000</small></p>`;
    chart.appendChild(r);
    const cv = $('canvas', r), ctx = cv.getContext('2d');
    // the lit squares sit in a fixed, scattered order
    let seed = k.length * 97; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const lit = new Set(); while (lit.size < m.per1000) lit.add(Math.floor(rnd() * 1000));
    const draw = (shown) => {
      const w = cv.clientWidth, h = cv.clientHeight, d = Math.min(devicePixelRatio || 1, 2);
      cv.width = Math.round(w * d); cv.height = Math.round(h * d); ctx.setTransform(d, 0, 0, d, 0, 0);
      const cols = 200, rws = 5, cw = w / cols, ch = h / rws; let i = 0;
      for (let y = 0; y < rws; y++) for (let x = 0; x < cols; x++, i++) {
        const on = lit.has(i) && [...lit].indexOf(i) < shown;
        ctx.fillStyle = on ? (k === 'icy' ? '#7cc5ad' : j.c) : 'rgba(20,14,16,.08)';
        const s = on ? Math.min(cw, ch) : Math.min(cw, ch) * 0.45;
        ctx.fillRect(x * cw + (cw - s) / 2, y * ch + (ch - s) / 2, s, s);
      }
      $('[data-v]', r).textContent = Math.min(shown, m.per1000);
    };
    draw(RM ? m.per1000 : 0);
    draws.push({ r, draw, n: m.per1000 });
    new ResizeObserver(() => draw(r._shown ?? (RM ? m.per1000 : 0))).observe(cv);
  });
  if (hasG && !RM) draws.forEach(({ r, draw, n }, i) => {
    const o = { v: 0 };
    gsap.to(o, { v: n, duration: 1.4 + n / 60, delay: i * 0.12, ease: 'power2.out', onUpdate: () => { r._shown = Math.round(o.v); draw(r._shown); }, scrollTrigger: { trigger: r, start: 'top 85%' } });
  });
  if (hasG && !RM) gsap.from('.rar__head > *', { y: 40, opacity: 0, stagger: 0.08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.rar', start: 'top 70%' } });

  /* ---------- the stand ---------- */
  const picks = $('[data-picks]'), stackEl = $('[data-stack]');
  let stack = JD.get('stack', []).filter((k) => JADES[k]).slice(0, 3);
  ORDER.forEach((k) => {
    const b = document.createElement('button');
    b.className = 'pick'; b.dataset.k = k; b.dataset.cursor = 'add';
    b.innerHTML = `<span data-bangle></span><b>${JADES[k].name}</b><i></i>`;
    picks.appendChild(b); JD.paint($('[data-bangle]', b), k);
    b.addEventListener('click', () => {
      const at = stack.indexOf(k);
      if (at > -1) stack.splice(at, 1); else { stack.push(k); if (stack.length > 3) stack.shift(); }
      render(at > -1 ? null : k);
    });
  });
  const POS = [[4, 1], [30, 0.8], [52, 0.64]]; // bottom %, scale — the cone narrows
  const VERDICT = {
    '': 'your stack: empty. honestly, relatable.',
    'imperial,imperial': '',
    'black,imperial': 'green on black. it says “i’m doing great” in a font they can’t afford.',
    'icy,lavender': 'cold and pretty. like the last message you left on read.',
    'honey,lavender': 'sunset on your wrist. the kind of stack you wear to a second date that won’t happen.',
    'black,honey,imperial': 'the full drama. three acts, no intermission.',
    'icy,imperial,lavender': 'the classic trio. it rings like a group chat that agrees with you.',
    'black,icy,lavender': 'midnight, ice, bruises. very poetic. very 2 a.m.',
  };
  const verdict = () => {
    const key = [...stack].sort().join(',');
    if (VERDICT[key]) return VERDICT[key];
    if (stack.length === 1) return `just ${JADES[stack[0]].name}. one is a statement. a single in every sense.`;
    if (stack.length === 2) return `${JADES[stack[0]].name} and ${JADES[stack[1]].name}. a duet. at least someone’s singing together.`;
    return `${stack.map((k) => JADES[k].name).join(', ')}. a chord nobody else would choose. that’s the point.`;
  };
  function render(added) {
    stackEl.innerHTML = '';
    stack.forEach((k, i) => {
      const el = document.createElement('div'); el.className = 'on';
      el.style.bottom = POS[i][0] + '%'; el.style.transform = `scale(${POS[i][1]})`;
      el.innerHTML = '<span data-bangle></span>'; stackEl.appendChild(el); JD.paint($('[data-bangle]', el), k);
      if (k === added && hasG && !RM) {
        gsap.fromTo(el, { y: -520, rotate: -14 }, { y: 0, rotate: 0, duration: 1.1, ease: 'bounce.out', onComplete: () => JD.ring(k, 0.7) });
      }
    });
    if (added && (!hasG || RM)) JD.ring(added, 0.7);
    $$('.pick', picks).forEach((p) => { const at = stack.indexOf(p.dataset.k); p.classList.toggle('is-in', at > -1); $('i', p).textContent = at > -1 ? at + 1 : ''; });
    $('[data-verdict]').textContent = verdict();
    JD.set('stack', stack);
  }
  render();
  $('[data-play]').addEventListener('click', () => {
    if (!stack.length) return JD.toast('nothing to play. <b>add a bangle</b> first.');
    stack.forEach((k, i) => setTimeout(() => {
      JD.ring(k, 0.75);
      const el = stackEl.children[i]; if (el && hasG && !RM) gsap.fromTo(el.firstChild, { rotate: -4 }, { rotate: 0, duration: 1, ease: 'elastic.out(1.2,.25)' });
    }, i * 110));
  });
  $('[data-clear]').addEventListener('click', () => {
    if (hasG && !RM && stack.length) gsap.to(stackEl.children, { y: -600, opacity: 0, stagger: 0.06, duration: 0.6, ease: 'power3.in', onComplete: () => { stack = []; render(); } });
    else { stack = []; render(); }
  });
  if (hasG && !RM) {
    gsap.from('.stand__copy > *', { y: 40, opacity: 0, stagger: 0.07, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.stand', start: 'top 70%' } });
    gsap.from('.cone', { scaleY: 0, transformOrigin: 'bottom', duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.stand', start: 'top 70%' } });
  }
})();
