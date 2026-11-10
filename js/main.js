/* ═══════════════════════════════════════════════════════════════
   JADED — main.js (shared)
   concept, design & code by ghostly.grl ♥

   window.JD  ·  localStorage prefix "jd-"
   - JD.JADES: the five colours (+ their tone when tapped)
   - JD.bangle(kind): an svg jade bangle (gradient, veins, sheen)
     — a stand-in until her photos arrive
   - JD.ring(kind): the tap test. web audio bell, partials like stone
   - JD.tap(el): ripples + wobble + ring
   - loader, cursor, nav, sound toggle, lenis, scramble, magnetic,
     slots, toast, konami (everything turns imperial)
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const JD = (window.JD = {});
  const RM = (JD.RM = matchMedia('(prefers-reduced-motion: reduce)').matches);
  const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (JD.$ = (s, r = document) => r.querySelector(s));
  const $$ = (JD.$$ = (s, r = document) => [...r.querySelectorAll(s)]);
  const lerp = (a, b, t) => a + (b - a) * t;
  const hasG = () => !!window.gsap;

  JD.get = (k, d) => { try { const v = localStorage.getItem('jd-' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } };
  JD.set = (k, v) => { try { localStorage.setItem('jd-' + k, JSON.stringify(v)); } catch (e) {} };

  /* ═══════════════ the five jades ═══════════════ */
  JD.JADES = {
    imperial: { img: 'JADES/imperial.webp', name: 'imperial green', cn: '帝王綠', a: '#7fe0ae', b: '#0d6b41', c: '#1d8a5a', vein: '#e6fff1', f: 1046.5,
      line: 'for the one who left. the rarest, the most expensive, the one you keep thinking about.' },
    lavender: { img: 'JADES/lavender.webp', name: 'lavender', cn: '紫羅蘭', a: '#efe3ff', b: '#8c6cc0', c: '#bfa6e2', vein: '#ffffff', f: 880,
      line: 'for the one who said “i’m not ready”. soft, a little cold, very pretty. like the excuse.' },
    icy: { img: 'JADES/icy.webp', name: 'icy', cn: '冰種', a: '#ffffff', b: '#a9cfc2', c: '#dcefe8', vein: '#ffffff', f: 1318.5,
      line: 'for when you feel nothing. clear as glass, cold as the last text you sent.' },
    honey: { img: 'JADES/honey.webp', name: 'honey', cn: '黃翡', a: '#ffe0a3', b: '#a8661a', c: '#e0a13c', vein: '#fff4d8', f: 784,
      line: 'for the one who was sweet once. warm colour, still a stone.' },
    black: { img: 'JADES/black.webp', name: 'black jade', cn: '墨翠', a: '#4b5a52', b: '#070a09', c: '#1d2420', vein: '#6f8c7c', f: 659.3,
      line: 'for the ones we don’t talk about. looks black. hold it to the light: it’s green inside.' },
  };

  /* ═══════════════ the svg bangle ═══════════════ */
  let uid = 0;
  JD.bangle = (kind = 'imperial') => {
    const j = JD.JADES[kind] || JD.JADES.imperial, id = 'b' + ++uid;
    // a ring seen from slightly above: outer + inner ellipse, the hole sits a bit high
    const ring = 'M10 100 A110 66 0 1 0 230 100 A110 66 0 1 0 10 100 Z M44 92 A76 40 0 1 1 196 92 A76 40 0 1 1 44 92 Z';
    return `<svg viewBox="0 0 240 200" aria-hidden="true">
  <defs>
    <linearGradient id="${id}g" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stop-color="${j.a}"/><stop offset=".55" stop-color="${j.c}"/><stop offset="1" stop-color="${j.b}"/></linearGradient>
    <radialGradient id="${id}r" cx=".5" cy=".42" r=".6"><stop offset=".55" stop-color="#000" stop-opacity=".35"/><stop offset=".75" stop-color="#000" stop-opacity="0"/></radialGradient>
    <filter id="${id}v" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".018 .05" numOctaves="4" seed="${uid * 7}"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -2.2 1.35"/><feComposite in2="SourceGraphic" operator="in"/></filter>
    <filter id="${id}s"><feGaussianBlur stdDeviation="2.2"/></filter>
    <clipPath id="${id}c"><path d="${ring}" clip-rule="evenodd"/></clipPath>
  </defs>
  <ellipse cx="120" cy="176" rx="96" ry="12" fill="#140e10" opacity=".22" filter="url(#${id}s)"/>
  <g class="bng">
    <path d="${ring}" fill-rule="evenodd" fill="url(#${id}g)"/>
    <g clip-path="url(#${id}c)">
      <rect width="240" height="200" fill="${j.vein}" opacity=".55" filter="url(#${id}v)"/>
      <ellipse cx="120" cy="96" rx="96" ry="58" fill="url(#${id}r)"/>
      <path d="M44 92 A76 40 0 0 1 196 92" fill="none" stroke="#000" stroke-opacity=".28" stroke-width="10" filter="url(#${id}s)"/>
      <path d="M30 84 A92 50 0 0 1 120 40" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="5" stroke-linecap="round" filter="url(#${id}s)"/>
      <path d="M150 150 A90 46 0 0 0 214 112" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3" stroke-linecap="round" filter="url(#${id}s)"/>
      <ellipse cx="66" cy="130" rx="10" ry="4" fill="#fff" opacity=".7" filter="url(#${id}s)"/>
    </g>
    <path d="${ring}" fill-rule="evenodd" fill="none" stroke="#140e10" stroke-opacity=".25" stroke-width="1"/>
  </g>
</svg>`;
  };
  // her photos when we have them, the svg when we don't (or while one fails to load)
  JD.paint = (el, kind, src) => {
    el.dataset.bangle = kind;
    const file = src || (JD.JADES[kind] || {}).img;
    if (!file) { el.innerHTML = JD.bangle(kind); return; }
    const im = new Image(); im.alt = ''; im.draggable = false; im.decoding = 'async'; im.className = 'jd-photo';
    im.onerror = () => { el.innerHTML = JD.bangle(kind); };
    im.src = 'img/' + file; el.innerHTML = ''; el.appendChild(im);
  };

  /* ═══════════════ the pieces (one of each, like a record) ═══════════════ */
  JD.PIECES = [
    { id: 'left-on-read', track: 'left on read', what: 'lavender jade bangle', kind: 'lavender', type: 'bangle', price: 280, img: 'JADES/lavender.webp',
      line: 'soft, a little cold, very pretty. it doesn’t answer either, but it looks better doing it.' },
    { id: 'u-up', track: 'u up?', what: 'black jade bangle', kind: 'black', type: 'bangle', price: 240, img: 'JADES/black.webp',
      line: 'for 2 a.m. looks black, hold it to the lamp and it’s green inside. some people are like that. not him.' },
    { id: 'situationship', track: 'situationship', what: 'two-tone bangle, half imperial, half icy', kind: 'imperial', also: 'icy', type: 'bangle', price: 340, img: 'JADES/two-tone.webp',
      line: 'half green, half nothing. it can’t decide either. at least it’s honest about it.' },
    { id: 'the-exs-birthday', track: 'the ex’s birthday', what: 'imperial green bangle', kind: 'imperial', type: 'bangle', price: 620, img: 'JADES/imperial.webp',
      line: 'buy yourself the present you were going to buy them. it’s the better gift anyway.' },
    { id: 'seen-2347', track: 'seen 23:47', what: 'icy jade bangle', kind: 'icy', type: 'bangle', price: 320, img: 'JADES/icy.webp',
      line: 'clear as glass, cold as the last text you sent. the most minimal one. it says nothing, beautifully.' },
    { id: 'im-fine', track: 'i’m fine', what: 'honey jade bangle', kind: 'honey', type: 'bangle', price: 210, img: 'JADES/honey.webp',
      line: 'warm colour, still a stone. for when you say “i’m fine” and, honestly, you nearly are.' },
    { id: 'new-number', track: 'new number, who dis', what: 'jade donut charm with a green tassel', kind: 'icy', also: 'imperial', type: 'charm', price: 45, img: 'JADES/phone-charm.webp',
      line: 'hang it on the phone you changed the number of. lucky knot, jade donut, a tassel to fidget with.' },
    { id: 'healing-era', track: 'healing era', what: 'lavender bi disc pendant on a silver chain', kind: 'lavender', type: 'pendant', price: 160, img: 'JADES/pendant.webp',
      line: 'a bi disc: a circle with a hole in the middle. in china it means heaven. we think it means “getting there”.' },
    { id: 'self-gift', track: 'bonus: self-gift', what: 'imperial bangle with a silver peacock', kind: 'imperial', type: 'bangle', price: 1400, img: 'JADES/self-gift.webp', bonus: true,
      line: 'the bonus track. a peacock, because you’re allowed to show off now. wrapped by you, for you.' },
  ];
  JD.PIECES.forEach((p, i) => (p.no = String(i + 1).padStart(2, '0')));
  JD.euro = (n) => '€ ' + n.toLocaleString('it-IT');
  $$('[data-bangle]').forEach((el) => JD.paint(el, el.dataset.bangle));

  /* ═══════════════ sound: the tap test ═══════════════ */
  JD.soundOn = JD.get('sound', true);
  let ac = null;
  const ctx = () => { if (!ac) { const A = window.AudioContext || window.webkitAudioContext; if (A) ac = new A(); } if (ac && ac.state === 'suspended') ac.resume(); return ac; };
  JD.ring = (kind = 'imperial', vel = 1) => {
    if (!JD.soundOn) return;
    const a = ctx(); if (!a) return;
    const f = typeof kind === 'number' ? kind : (JD.JADES[kind] || JD.JADES.imperial).f;
    const t = a.currentTime, out = a.createGain(); out.gain.value = 0.22 * vel; out.connect(a.destination);
    // stone bell: inharmonic partials, the high ones die first
    [[1, 1, 2.8], [2.76, 0.45, 1.6], [5.4, 0.22, 0.9], [8.93, 0.1, 0.5], [0.5, 0.12, 1.2]].forEach(([m, g, d]) => {
      const o = a.createOscillator(), e = a.createGain();
      o.type = 'sine'; o.frequency.value = f * m * (1 + (Math.random() - 0.5) * 0.003);
      e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(g, t + 0.004); e.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(e); e.connect(out); o.start(t); o.stop(t + d + 0.05);
    });
    // the "tink" of the coin
    const n = a.createBufferSource(), buf = a.createBuffer(1, a.sampleRate * 0.03, a.sampleRate), ch = buf.getChannelData(0);
    for (let i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / ch.length, 3);
    const hp = a.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 4000;
    const ng = a.createGain(); ng.gain.value = 0.35;
    n.buffer = buf; n.connect(hp); hp.connect(ng); ng.connect(out); n.start(t);
    JD.lastRing = { f, t: performance.now() };
  };
  JD.thud = () => { // what fake jade sounds like
    if (!JD.soundOn) return; const a = ctx(); if (!a) return;
    const t = a.currentTime, o = a.createOscillator(), e = a.createGain();
    o.type = 'triangle'; o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(90, t + 0.08);
    e.gain.setValueAtTime(0.25, t); e.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    o.connect(e); e.connect(a.destination); o.start(t); o.stop(t + 0.15);
  };

  /* ═══════════════ JD.tap: ripples + wobble + ring ═══════════════ */
  JD.tinks = JD.get('tinks', 0);
  const showTinks = () => $$('[data-tinks],[data-tinks-total]').forEach((el) => (el.textContent = JD.tinks));
  showTinks();
  JD.tap = (el, kind, o = {}) => {
    kind = kind || el.dataset.tap || 'imperial';
    if (!o.quiet) { JD.ring(kind); JD.tinks++; JD.set('tinks', JD.tinks); showTinks(); }
    const rp = $('.tap__ripples', el);
    if (rp && hasG() && !RM) {
      for (let k = 0; k < 3; k++) {
        const i = document.createElement('i'); rp.appendChild(i);
        gsap.fromTo(i, { scale: 0.55, opacity: 0.9 }, { scale: 1.5 + k * 0.35, opacity: 0, duration: 1.4 + k * 0.3, delay: k * 0.12, ease: 'expo.out', onComplete: () => i.remove() });
      }
    }
    const body = $('.slot.has-img', el) || $('.tap__fallback', el) || el;
    if (hasG() && !RM) gsap.fromTo(body, { rotate: -3, scale: 0.97 }, { rotate: 0, scale: 1, duration: 1.2, ease: 'elastic.out(1.2, .25)' });
    el.dispatchEvent(new CustomEvent('ring', { bubbles: true, detail: { kind } }));
  };
  document.addEventListener('click', (e) => { const t = e.target.closest('.tap[data-tap]'); if (t) JD.tap(t); });

  /* sound toggle */
  const sb = $('[data-sound]');
  const paintSound = () => { if (!sb) return; sb.setAttribute('aria-pressed', JD.soundOn); $('b', sb).textContent = JD.soundOn ? 'sound on' : 'sound off'; };
  paintSound();
  sb && sb.addEventListener('click', () => { JD.soundOn = !JD.soundOn; JD.set('sound', JD.soundOn); paintSound(); if (JD.soundOn) JD.ring('icy', 0.6); });

  /* ═══════════════ cursor ═══════════════ */
  const cur = $('.cursor');
  if (cur && FINE) {
    document.documentElement.classList.add('has-cursor');
    const label = $('.cursor__label', cur);
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; }, { passive: true });
    addEventListener('pointerdown', () => cur.classList.add('is-down'));
    addEventListener('pointerup', () => cur.classList.remove('is-down'));
    (function f() { cx = lerp(cx, x, RM ? 1 : 0.3); cy = lerp(cy, y, RM ? 1 : 0.3); cur.style.transform = `translate3d(${cx}px,${cy}px,0)`; requestAnimationFrame(f); })();
    document.addEventListener('pointerover', (e) => {
      const el = e.target.closest('[data-cursor], a, button, input, select');
      const tap = !!(el && el.matches('.tap, [data-hold], [data-torch]'));
      cur.classList.toggle('is-hover', !!el && !tap);
      cur.classList.toggle('is-tap', tap);
      const t = el && el.dataset.cursor; label.textContent = t || ''; cur.classList.toggle('has-label', !!t);
    });
  }

  /* ═══════════════ lenis ═══════════════ */
  if (window.Lenis && !RM) {
    const lenis = (JD.lenis = new Lenis({ lerp: 0.1, smoothWheel: true }));
    if (window.gsap && window.ScrollTrigger) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    else (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })();
  }
  if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ═══════════════ nav ═══════════════ */
  const nav = $('.nav');
  if (nav) {
    let last = 0;
    addEventListener('scroll', () => {
      const y = scrollY;
      nav.classList.toggle('is-hidden', y > last && y > 300 && !document.body.classList.contains('menu-open'));
      nav.classList.toggle('is-solid', y > 80); last = y;
    }, { passive: true });
    const here = location.pathname.split('/').pop() || 'index.html';
    $$('.nav__links a').forEach((a) => a.getAttribute('href') === here && a.classList.add('is-here'));
    const burger = $('.nav__burger');
    burger && burger.addEventListener('click', () => document.body.classList.toggle('menu-open'));
  }

  /* ═══════════════ scramble ═══════════════ */
  const GLY = '翡翠玉真冰紫黃墨綠·—/';
  JD.scramble = (el) => {
    const final = el.dataset.text || (el.dataset.text = el.textContent); let f = 0; const total = 22;
    clearInterval(el._s);
    el._s = setInterval(() => {
      el.textContent = final.split('').map((c, i) => (c === ' ' ? ' ' : i < (f / total) * final.length ? c : GLY[(Math.random() * GLY.length) | 0])).join('');
      if (++f > total) { clearInterval(el._s); el.textContent = final; }
    }, 34);
  };
  if (!RM) { const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { JD.scramble(e.target); io.unobserve(e.target); } }), { threshold: 0.6 }); $$('[data-scramble]').forEach((el) => io.observe(el)); }

  /* ═══════════════ magnetic ═══════════════ */
  if (FINE && !RM) $$('.magnetic').forEach((el) => {
    el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px,${(e.clientY - r.top - r.height / 2) * 0.35}px)`; });
    el.addEventListener('pointerleave', () => { el.style.transition = 'transform .5s cubic-bezier(.2,.8,.2,1)'; el.style.transform = ''; setTimeout(() => (el.style.transition = ''), 500); });
  });

  /* ═══════════════ image slots ═══════════════ */
  JD.fillSlot = (s) => {
    const sp = $(':scope > span', s); if (sp) sp.dataset.file = 'img/' + s.dataset.img;
    const im = new Image();
    im.onload = () => { im.alt = sp ? sp.textContent : ''; s.prepend(im); s.classList.add('has-img'); };
    im.src = 'img/' + s.dataset.img;
  };
  $$('.slot[data-img]').forEach(JD.fillSlot);

  /* ═══════════════ toast ═══════════════ */
  JD.toast = (html) => {
    let t = $('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.innerHTML = html; t.classList.add('is-on'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('is-on'), 3200);
  };

  /* ═══════════════ loader: the tap test ═══════════════ */
  JD.ready = new Promise((res) => {
    const L = $('.loader');
    const done = () => { document.body.classList.remove('is-loading'); res(); };
    if (!L || !hasG()) { L && L.remove(); return done(); }
    if (RM || sessionStorage.getItem('jd-seen')) { L.remove(); return done(); }
    sessionStorage.setItem('jd-seen', 1);
    const t = $('[data-loader-t]', L), rp = $$('.loader__ripples i', L);
    gsap.timeline({ onComplete: () => L.remove() })
      .from('.loader__bangle', { y: -260, rotate: -30, duration: 0.7, ease: 'bounce.out' })
      .call(() => (t.textContent = 'tink.'))
      .fromTo(rp, { scale: 0.5, opacity: 0.9 }, { scale: 2.4, opacity: 0, duration: 1.2, stagger: 0.14, ease: 'expo.out' })
      .fromTo('.loader__bangle', { rotate: -4 }, { rotate: 0, duration: 0.8, ease: 'elastic.out(1.2,.25)' }, '<')
      .call(() => (t.textContent = 'it rings. it’s real.'), null, '-=.7')
      .to('.loader__bangle', { scale: 0.3, opacity: 0, duration: 0.45, ease: 'power3.in' }, '+=.25')
      .to(L, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut', onStart: done }, '-=.1');
  });

  /* ═══════════════ tab title ═══════════════ */
  const title = document.title;
  document.addEventListener('visibilitychange', () => { document.title = document.hidden ? 'come back. it’s still cold.' : title; });

  /* ═══════════════ konami: everything turns imperial ═══════════════ */
  const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let ki = 0;
  addEventListener('keydown', (e) => { ki = e.key === code[ki] ? ki + 1 : e.key === code[0] ? 1 : 0; if (ki === code.length) { ki = 0; JD.imperial(); } });
  JD.imperial = () => {
    $$('[data-bangle]').forEach((el) => JD.paint(el, 'imperial'));
    [0, 140, 280].forEach((d, i) => setTimeout(() => JD.ring([1046.5, 1318.5, 1568][i] / 1, 0.7), d));
    if (hasG()) for (let i = 0; i < 26; i++) {
      const p = document.createElement('div'); p.className = 'petal'; p.innerHTML = JD.bangle(['imperial', 'lavender', 'icy', 'honey'][i % 4]);
      document.body.appendChild(p);
      gsap.fromTo(p, { x: Math.random() * innerWidth, y: -40, rotate: 0 }, { y: innerHeight + 60, rotate: Math.random() * 720, x: `+=${(Math.random() - 0.5) * 240}`, duration: 2.5 + Math.random() * 2.5, delay: Math.random() * 1.4, ease: 'power1.in', onComplete: () => p.remove() });
    }
    JD.toast('<b>帝王綠</b> everything is imperial now. you deserve it.');
    document.title = '帝王綠 · imperial';
  };

  /* ═══════════════ signature ═══════════════ */
  console.log('%c\n      .-""-.          /\\_/\\\n     /  玉  \\        ( o.o )  <3\n     \\      /         > ^ <\n      \'-..-\'     JADED · jade for the jaded\n     ~ tink ~\n\n  concept, design & code by ghostly.grl ♥\n  try JD.help()\n', 'color:#ff2e93;font-family:monospace;font-size:12px');
  JD.help = () => console.log('JD.ring("lavender") → hear a colour\nJD.imperial()       → everything turns imperial (or ↑↑↓↓←→←→ b a)\nJD.tinks            → how many times you tapped\nJD.JADES            → the five colours');
})();
