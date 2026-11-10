/* ═══════════════════════════════════════════════════════════════
   JADED — real.js (is it real?)
   concept, design & code by ghostly.grl ♥
   - the spread: the bangle sits where the pink ball was. tap it
   - the lineup: five suspects (2 real, 3 fakes), five tests,
     your verdict. best score in jd-lineup
   - type A / B / C: A rings, B and C go tok (and crack)
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const JD = window.JD, { $, $$, RM } = JD;
  const G = !!window.gsap;
  const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ═══════════════ sounds the fakes make ═══════════════ */
  let ac = null;
  const ctx = () => { if (!ac) { const A = window.AudioContext || window.webkitAudioContext; if (A) ac = new A(); } if (ac && ac.state === 'suspended') ac.resume(); return ac; };
  const bell = (f, dec, lp) => {
    if (!JD.soundOn) return; const a = ctx(); if (!a) return;
    const t = a.currentTime, out = a.createGain(); out.gain.value = 0.2;
    let dest = a.destination;
    if (lp) { const flt = a.createBiquadFilter(); flt.type = 'lowpass'; flt.frequency.value = lp; flt.connect(dest); dest = flt; }
    out.connect(dest);
    [[1, 1, dec], [2.76, 0.4, dec * 0.55], [5.4, 0.18, dec * 0.3]].forEach(([m, g, d]) => {
      const o = a.createOscillator(), e = a.createGain(); o.type = 'sine'; o.frequency.value = f * m;
      e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(g, t + 0.003); e.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(e); e.connect(out); o.start(t); o.stop(t + d + 0.05);
    });
  };

  /* ═══════════════ the suspects ═══════════════ */
  const SUS = {
    lavender: { kind: 'lavender', real: true,
      tap: { snd: 'ring', dec: 2.8, line: 'a long, clear ring. it keeps going after you’ve stopped listening.' },
      hold: { to: 22.1, line: 'still cold after five seconds. jade pulls the heat out of your hand.' },
      light: { filter: 'brightness(1.5) saturate(1.3)', line: 'it glows unevenly: cloudy patches, tiny veins. alive.' },
      weigh: { g: 58.2, line: 'heavier than it looks. jade is dense: 3.3 grams per cm³.' },
      loupe: { tex: 'fibrous', line: 'felted crystals, like frost on a window. that’s jadeite.' },
      reveal: 'real. type A lavender. soft, cold, rings for days.' },
    black: { kind: 'black', real: true,
      tap: { snd: 'ring', dec: 2.6, line: 'it rings low and long. black jade has the deeper voice.' },
      hold: { to: 22.3, line: 'cold, and it stays cold. it’s not personal.' },
      light: { filter: 'brightness(3.2) sepia(1) hue-rotate(85deg) saturate(5)', line: 'black outside. green inside. some people are like that.' },
      weigh: { g: 59.6, line: 'heavy for its size. good sign.' },
      loupe: { tex: 'dark', line: 'tiny green flecks inside the black, packed tight.' },
      reveal: 'real. black jade. hold it to the light: it’s green inside.' },
    glass: { kind: 'icy', fake: 'glass',
      tap: { snd: 'glass', dec: 0.45, line: 'it rings, but too bright and too short. like a “haha” with no emoji.' },
      hold: { to: 24.6, line: 'cold for a second, then warm. glass gives up quickly.' },
      light: { filter: 'brightness(1.9) saturate(.2) contrast(.9)', line: 'one even glow and a round bubble. too perfect. suspicious.' },
      weigh: { g: 43.1, line: 'light for its size. glass is 2.5 grams per cm³.' },
      loupe: { tex: 'bubbles', line: 'round gas bubbles. real jade never has bubbles.' },
      reveal: 'glass. it rang, but it rang like a lie.' },
    resin: { kind: 'honey', fake: 'resin',
      tap: { snd: 'thud', dec: 0.1, line: 'tok. no ring at all. like knocking on a plastic chair.' },
      hold: { to: 29.4, line: 'warm almost at once. plastic is clingy.' },
      light: { filter: 'brightness(1.6) sepia(.6) saturate(1.8)', line: 'it glows like a nightlight. soft, yellow, cheap.' },
      weigh: { g: 19.8, line: 'you could lose it in a pocket. like him.' },
      loupe: { tex: 'swirls', line: 'flow lines, and a seam from the mould.' },
      reveal: 'resin. warm, light, went tok. we’ve all dated one.' },
    dyed: { kind: 'imperial', fake: 'dyed',
      tap: { snd: 'dull', dec: 0.55, line: 'a dull, short ring. the resin inside eats the sound.' },
      hold: { to: 22.4, line: 'cold. it is jade, technically. keep testing.' },
      light: { filter: 'brightness(1.6) saturate(3) hue-rotate(14deg)', line: 'the green sits in lines, like someone coloured it in.' },
      weigh: { g: 55.4, line: 'close. the resin filling makes it a little lighter.' },
      loupe: { tex: 'cracks', line: 'the colour pooled in a web of cracks. dye goes where it can.' },
      reveal: 'B+C jade: bleached, filled, dyed green. real stone, fake personality.' },
  };
  const TESTS = ['tap', 'hold', 'light', 'weigh', 'loupe'];
  const TNAME = { tap: 'tap it', hold: 'hold it', light: 'light it', weigh: 'weigh it', loupe: 'look closer' };
  const LET = 'ABCDE';

  /* ═══════════════ the spread ═══════════════ */
  const sb = $('.sp__bangle');

  JD.ready.then(() => {
    if (!G || RM) return;
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .from('.sp__pink', { scaleY: 0, transformOrigin: '50% 0', duration: 1.1, ease: 'expo.inOut' })
      .from('.sp__photo', { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, '-=.8')
      .from('.sp__t1', { yPercent: 60, opacity: 0, duration: 1 }, '-=.7')
      .from('.sp__t2 b', { yPercent: 80, opacity: 0, stagger: 0.06, duration: 0.9 }, '<.1')
      .from('.sp__dark', { clipPath: 'inset(0 100% 0 0)', duration: 1.1, ease: 'expo.inOut' }, '<')
      .from('.sp__bangle', { scale: 0.4, rotate: -40, opacity: 0, duration: 1.3, ease: 'back.out(1.6)' }, '-=.8')
      .from('.sp__copy, .sp__side, .sp__no', { opacity: 0, y: 14, duration: 0.8 }, '-=.6')
      .call(() => JD.tap(sb, 'imperial', { quiet: true }));

    // a little parallax on the spread
    const page = $('.sp__page');
    if (FINE && page) {
      const mv = [['.sp__bangle', 18], ['.sp__photo', -8], ['.sp__dark', 6], ['.sp__title', -5]].map(([s, k]) => [gsap.quickTo(s, 'x', { duration: 0.8 }), gsap.quickTo(s, 'y', { duration: 0.8 }), k]);
      page.addEventListener('pointermove', (e) => {
        const r = page.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
        mv.forEach(([qx, qy, k]) => { qx(nx * k); qy(ny * k); });
      });
      page.addEventListener('pointerleave', () => mv.forEach(([qx, qy]) => { qx(0); qy(0); }));
    }
  });

  /* ═══════════════ the lineup ═══════════════ */
  const row = $('[data-row]'), tools = $('[data-tools]');
  const cv = $('[data-cv]'), c2 = cv.getContext('2d'), big = $('[data-big]'), lightBox = $('[data-light]');
  const who = $('[data-ev-who]'), tname = $('[data-ev-test]'), line = $('[data-line]'), count = $('[data-count]');
  const stamps = $$('[data-verdict]'), score = $('[data-score]');
  let order = [], sel = null, done = {}, verdict = {}, anim = 0, busy = 0;

  // height chart labels on the wall
  const lines = $('.lu__lines');
  for (let i = 1; i < 14; i++) { const s = document.createElement('span'); s.style.top = i * 48 + 'px'; s.textContent = 66 - i * 2 + ' mm'; lines.appendChild(s); }

  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const build = () => {
    order = shuffle(Object.keys(SUS)); done = {}; verdict = {}; sel = null;
    row.innerHTML = order.map((id, i) => `
      <li class="su" tabindex="0" role="button" data-id="${id}" ${SUS[id].fake ? `data-fake="${SUS[id].fake}"` : ''} data-cursor="suspect ${LET[i]}" aria-label="suspect ${LET[i]}">
        <span class="su__stamp" aria-hidden="true"></span>
        <div class="su__jade"></div>
        <div class="su__card"><b>${LET[i]}</b><small>suspect · 嫌疑人</small><span class="su__dots">${TESTS.map(() => '<i></i>').join('')}</span></div>
        <p class="su__was"></p>
      </li>`).join('');
    $$('.su', row).forEach((li) => { done[li.dataset.id] = new Set(); JD.paint($('.su__jade', li), SUS[li.dataset.id].kind); });
    score.hidden = true; count.textContent = 'verdicts 0 / 5';
    pick(order[0], true);
    if (G && !RM) gsap.from($$('.su', row), { y: 50, opacity: 0, stagger: 0.08, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: row, start: 'top 85%', once: true } });
  };

  // the canvas always matches its box, so the lens stays round
  const fit = () => { const r = cv.getBoundingClientRect(), k = Math.min(2, devicePixelRatio || 1); cv.width = Math.max(320, r.width * k); cv.height = Math.max(160, r.height * k); };
  const clearView = () => {
    fit(); cancelAnimationFrame(anim); c2.clearRect(0, 0, cv.width, cv.height);
    big.innerHTML = ''; big.className = 'ev__big'; lightBox.classList.remove('on');
    $$('button', tools).forEach((b) => b.classList.remove('is-on'));
  };

  function pick(id, silent) {
    sel = id; clearView();
    $$('.su', row).forEach((li) => li.classList.toggle('is-sel', li.dataset.id === id));
    const i = order.indexOf(id);
    who.textContent = 'suspect ' + LET[i];
    tname.textContent = done[id].size ? done[id].size + ' / 5 tests run' : 'no test yet';
    const v = verdict[id];
    line.textContent = v ? SUS[id].reveal : silent ? 'suspect A. pick a test. any of them could be lying.' : 'suspect ' + LET[i] + '. what do we do with this one?';
    tools.removeAttribute('aria-disabled');
    stamps.forEach((s) => (s.disabled = !!v));
    drawIdle(id);
  }

  row.addEventListener('click', (e) => { const li = e.target.closest('.su'); if (li) pick(li.dataset.id); });
  row.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { const li = e.target.closest('.su'); if (li) { e.preventDefault(); pick(li.dataset.id); } } });

  // idle view: the suspect's letter and an empty bench
  function drawIdle(id) {
    const W = cv.width, H = cv.height;
    c2.fillStyle = 'rgba(243,236,226,.06)';
    for (let x = 0; x < W; x += 32) c2.fillRect(x, 0, 1, H);
    for (let y = 0; y < H; y += 32) c2.fillRect(0, y, W, 1);
    big.innerHTML = LET[order.indexOf(id)] + '<small>run a test</small>';
  }

  tools.addEventListener('click', (e) => {
    const b = e.target.closest('[data-test]'); if (!b || !sel) return;
    const t = b.dataset.test, s = SUS[sel], d = s[t];
    clearView(); b.classList.add('is-on');
    done[sel].add(t);
    const li = $(`.su[data-id="${sel}"]`, row);
    $$('.su__dots i', li)[TESTS.indexOf(t)].classList.add('on');
    tname.textContent = 'test: ' + TNAME[t];
    line.textContent = d.line;
    if (G && !RM) gsap.fromTo(line, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 });
    ({ tap: runTap, hold: runHold, light: runLight, weigh: runWeigh, loupe: runLoupe })[t](s, d, li);
  });

  /* ── tap: hear it, see it decay ── */
  function runTap(s, d, li) {
    if (d.snd === 'ring') JD.ring(s.kind);
    else if (d.snd === 'glass') bell(2093, d.dec);
    else if (d.snd === 'dull') bell(523, d.dec, 1400);
    else JD.thud();
    if (G && !RM) gsap.fromTo($('.su__jade', li), { rotate: -6 }, { rotate: 0, duration: 1.1, ease: 'elastic.out(1.2,.25)' });
    const W = cv.width, H = cv.height, T = 3.2, t0 = performance.now(), dur = RM ? 0 : 1300;
    const frame = (now) => {
      const p = dur ? Math.min(1, (now - t0) / dur) : 1;
      c2.clearRect(0, 0, W, H);
      c2.fillStyle = 'rgba(243,236,226,.35)'; c2.font = Math.round(H / 22) + 'px "Martian Mono", monospace';
      for (let k = 0; k <= 3; k++) { const x = 30 + (k / T) * (W - 60); c2.fillRect(x, H - 40, 1, 10); c2.fillText(k + 's', x - 8, H - 12); }
      c2.fillRect(30, H / 2 - 20, W - 60, 1);
      c2.beginPath(); c2.lineWidth = 3; c2.strokeStyle = '#ff2e93'; c2.shadowColor = '#ff2e93'; c2.shadowBlur = 12;
      const end = 30 + p * (W - 60);
      for (let x = 30; x <= end; x += 1.5) {
        const t = ((x - 30) / (W - 60)) * T;
        const env = d.snd === 'thud' ? Math.exp(-t * 40) : Math.exp((-5 * t) / d.dec);
        const y = H / 2 - 20 - Math.sin(t * Math.PI * 2 * (d.snd === 'glass' ? 30 : 16)) * env * (H * 0.36);
        x === 30 ? c2.moveTo(x, y) : c2.lineTo(x, y);
      }
      c2.stroke(); c2.shadowBlur = 0;
      if (p < 1) anim = requestAnimationFrame(frame);
      else { c2.fillStyle = '#f3ece2'; c2.font = Math.round(H / 16) + 'px "Martian Mono", monospace'; c2.textAlign = 'right'; c2.fillText(d.snd === 'thud' ? 'ring: 0.0 s' : 'ring: ' + d.dec.toFixed(1) + ' s', W - 30, H / 8); c2.textAlign = 'left'; }
    };
    anim = requestAnimationFrame(frame);
  }

  /* ── hold: the temperature barely moves (if it's real) ── */
  function runHold(s, d) {
    const o = { v: 21 };
    const paint = () => (big.innerHTML = o.v.toFixed(1) + '°<small>c, after five seconds in your hand</small>');
    paint();
    // a thermometer stripe along the bottom
    const W = cv.width, H = cv.height;
    const bar = (v) => { c2.clearRect(0, 0, W, H); const g = c2.createLinearGradient(30, 0, W - 30, 0); g.addColorStop(0, '#9fd8ff'); g.addColorStop(0.5, '#ff62ad'); g.addColorStop(1, '#ff3b3b'); c2.fillStyle = 'rgba(243,236,226,.1)'; c2.fillRect(30, H - 36, W - 60, 10); c2.fillStyle = g; c2.fillRect(30, H - 36, ((v - 20) / 12) * (W - 60), 10); };
    if (!G || RM) { o.v = d.to; paint(); bar(d.to); return; }
    gsap.to(o, { v: d.to, duration: 2.4, ease: 'power2.out', onUpdate: () => { paint(); bar(o.v); } });
  }

  /* ── light: a torch from behind ── */
  function runLight(s, d) {
    lightBox.innerHTML = '<span><img alt="" /></span>';
    const im = $('img', lightBox); im.src = 'img/' + JD.JADES[s.kind].img; im.style.filter = d.filter;
    if (s.fake === 'glass') { const b = document.createElement('i'); b.className = 'bub'; $('span', lightBox).appendChild(b); }
    lightBox.classList.add('on');
    if (G && !RM) gsap.fromTo($('span', lightBox), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: 'expo.out' });
  }

  /* ── weigh: the little kitchen scale ── */
  function runWeigh(s, d) {
    big.classList.add('is-scale');
    const o = { v: 0 };
    const paint = () => (big.innerHTML = o.v.toFixed(1) + ' g<small>same size, same cut, inner diameter 56 mm</small>');
    if (!G || RM) { o.v = d.g; return paint(); }
    gsap.timeline()
      .to(o, { v: d.g * 1.08, duration: 0.5, ease: 'power3.out', onUpdate: paint })
      .to(o, { v: d.g * 0.97, duration: 0.3, onUpdate: paint })
      .to(o, { v: d.g, duration: 0.4, onUpdate: paint });
  }

  /* ── loupe: 10× ── */
  const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  function runLoupe(s, d) {
    const k = cv.height / 360, W = cv.width / k, H = 360, cx = W / 2, cy = H / 2, R = H * 0.44, r = rng(d.tex.length * 97 + 11);
    c2.setTransform(1, 0, 0, 1, 0, 0);
    const j = JD.JADES[s.kind];
    c2.clearRect(0, 0, cv.width, cv.height); c2.setTransform(k, 0, 0, k, 0, 0);
    c2.save(); c2.beginPath(); c2.arc(cx, cy, R, 0, Math.PI * 2); c2.clip();
    const base = (a, b) => { const g = c2.createRadialGradient(cx - R * 0.3, cy - R * 0.3, 10, cx, cy, R * 1.2); g.addColorStop(0, a); g.addColorStop(1, b); c2.fillStyle = g; c2.fillRect(cx - R, cy - R, R * 2, R * 2); };
    const P = () => [cx + (r() * 2 - 1) * R, cy + (r() * 2 - 1) * R];
    if (d.tex === 'fibrous' || d.tex === 'dark') {
      d.tex === 'dark' ? base('#2c3a33', '#070a09') : base(j.a, j.b);
      for (let i = 0; i < 1100; i++) {
        const [x, y] = P(), a = r() * Math.PI, l = 4 + r() * 14;
        c2.strokeStyle = d.tex === 'dark' ? `rgba(${60 + r() * 60},${150 + r() * 80},${100 + r() * 40},${0.15 + r() * 0.35})` : r() < 0.6 ? `rgba(255,255,255,${0.08 + r() * 0.2})` : `rgba(40,20,60,${0.05 + r() * 0.1})`;
        c2.lineWidth = 1 + r(); c2.beginPath(); c2.moveTo(x, y); c2.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); c2.stroke();
      }
      c2.strokeStyle = 'rgba(255,255,255,.35)'; c2.lineWidth = 2; c2.shadowColor = '#fff'; c2.shadowBlur = 6;
      for (let k = 0; k < 2; k++) { c2.beginPath(); c2.moveTo(cx - R, cy - R * 0.6 + k * R * 0.9); c2.bezierCurveTo(cx - R * 0.3, cy - R * 0.9 + k * R, cx + R * 0.2, cy + R * 0.2 + k * 20, cx + R, cy - R * 0.1 + k * R * 0.5); c2.stroke(); }
      c2.shadowBlur = 0;
    } else if (d.tex === 'bubbles') {
      base('#f4fbf8', '#b9d5cb');
      for (let i = 0; i < 34; i++) {
        const [x, y] = P(), rr = 2 + Math.pow(r(), 2) * 22;
        c2.strokeStyle = 'rgba(80,110,100,.45)'; c2.lineWidth = 1.3; c2.beginPath(); c2.arc(x, y, rr, 0, Math.PI * 2); c2.stroke();
        c2.fillStyle = 'rgba(255,255,255,.9)'; c2.beginPath(); c2.arc(x - rr * 0.35, y - rr * 0.35, rr * 0.22, 0, Math.PI * 2); c2.fill();
      }
    } else if (d.tex === 'swirls') {
      base('#ffd88a', '#b4691c');
      c2.lineWidth = 2;
      for (let k = 0; k < 26; k++) {
        c2.strokeStyle = `rgba(255,240,200,${0.12 + r() * 0.2})`; c2.beginPath();
        const y0 = cy - R + k * (R * 2 / 26), ph = r() * 6, amp = 8 + r() * 18;
        for (let x = cx - R; x <= cx + R; x += 4) { const y = y0 + Math.sin(x / 40 + ph) * amp; x === cx - R ? c2.moveTo(x, y) : c2.lineTo(x, y); }
        c2.stroke();
      }
      c2.strokeStyle = 'rgba(90,40,10,.55)'; c2.lineWidth = 2.5; c2.beginPath(); c2.moveTo(cx - R, cy + R * 0.25); c2.lineTo(cx + R, cy - R * 0.05); c2.stroke();
    } else if (d.tex === 'cracks') {
      base('#eef2ec', '#c3cfc6');
      c2.lineCap = 'round';
      for (let k = 0; k < 26; k++) {
        let [x, y] = P(), a = r() * Math.PI * 2;
        c2.beginPath(); c2.moveTo(x, y);
        for (let st = 0; st < 12; st++) { a += (r() - 0.5) * 1.1; x += Math.cos(a) * 14; y += Math.sin(a) * 14; c2.lineTo(x, y); }
        c2.strokeStyle = 'rgba(18,184,106,.35)'; c2.lineWidth = 7; c2.stroke();
        c2.strokeStyle = '#0b8a4c'; c2.lineWidth = 1.8; c2.stroke();
      }
    }
    c2.restore();
    // the lens
    c2.strokeStyle = '#f3ece2'; c2.lineWidth = 4; c2.beginPath(); c2.arc(cx, cy, R, 0, Math.PI * 2); c2.stroke();
    c2.fillStyle = 'rgba(243,236,226,.6)'; c2.font = '18px "Martian Mono", monospace'; c2.fillText('10×', cx + R + 16, cy - R + 20);
    c2.fillStyle = 'rgba(255,255,255,.12)'; c2.beginPath(); c2.ellipse(cx - R * 0.45, cy - R * 0.5, R * 0.3, R * 0.12, -0.6, 0, Math.PI * 2); c2.fill(); c2.setTransform(1, 0, 0, 1, 0, 0);
    if (G && !RM) gsap.fromTo(cv, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'expo.out' });
  }

  /* ── the verdict ── */
  const LINES = [
    [5, 'five out of five. you’d have spotted him in the first week.'],
    [4, 'four. better than your track record.'],
    [3, 'three. not bad, not good. a situationship of a score.'],
    [0, 'you’d have believed him too. bring yours to the counter, we’ll test it for you.'],
  ];
  stamps.forEach((st) => st.addEventListener('click', () => {
    if (!sel || verdict[sel] || busy) return;
    const v = st.dataset.verdict, s = SUS[sel], right = (v === 'real') === !!s.real;
    verdict[sel] = v;
    const li = $(`.su[data-id="${sel}"]`, row), mark = $('.su__stamp', li);
    mark.textContent = v === 'real' ? '真' : '假'; mark.className = 'su__stamp is-' + v;
    $('.su__was', li).innerHTML = (right ? '<span class="ok">you got it.</span> ' : '<span class="no">nope.</span> ') + (s.real ? 'real jade' : s.fake === 'dyed' ? 'B+C jade' : s.fake);
    JD.thud(); if (s.real) setTimeout(() => JD.ring(s.kind, 0.7), 160);
    if (G && !RM) gsap.fromTo(mark, { scale: 2.4, opacity: 0, rotate: -30 }, { scale: 1, opacity: 1, rotate: -12, duration: 0.45, ease: 'back.out(2)' });
    else { mark.style.transform = 'rotate(-12deg)'; mark.style.opacity = 1; }
    line.textContent = s.reveal; stamps.forEach((b) => (b.disabled = true));
    const n = Object.keys(verdict).length; count.textContent = `verdicts ${n} / 5`;
    if (n === 5) return setTimeout(finish, 900);
    busy = 1;
    setTimeout(() => { busy = 0; const next = order.find((id) => !verdict[id]); if (next && sel && verdict[sel]) pick(next); }, 1500);
  }));

  function finish() {
    const n = order.filter((id) => (verdict[id] === 'real') === !!SUS[id].real).length;
    $('[data-score-n]').textContent = n;
    $('[data-score-line]').textContent = LINES.find(([k]) => n >= k)[1];
    score.hidden = false;
    const best = JD.get('lineup', 0); if (n > best) JD.set('lineup', n);
    if (n === 5) { [0, 140, 280].forEach((dl, i) => setTimeout(() => JD.ring([1046.5, 1318.5, 1568][i], 0.6), dl)); JD.toast('<b>真</b> five out of five. you have the eye.'); }
    if (G && !RM) gsap.from(score, { y: 40, opacity: 0, duration: 0.9, ease: 'expo.out' });
    JD.lenis ? JD.lenis.scrollTo(score, { offset: -120 }) : score.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  $('[data-again]').addEventListener('click', () => { build(); const w = $('.lu__wall'); JD.lenis ? JD.lenis.scrollTo(w, { offset: -90 }) : w.scrollIntoView({ behavior: 'smooth' }); });

  build();

  /* ═══════════════ type A, B, C ═══════════════ */
  $$('.gc').forEach((c) => {
    c.addEventListener('click', () => {
      const jd = $('.gc__jade', c);
      if (c.dataset.grade === 'a') JD.tap(jd, 'imperial');
      else {
        JD.thud(); c.classList.remove('is-crack'); void c.offsetWidth; c.classList.add('is-crack');
        clearTimeout(c._t); c._t = setTimeout(() => c.classList.remove('is-crack'), 2400);
        if (G && !RM) gsap.fromTo(jd, { x: -6 }, { x: 0, duration: 0.5, ease: 'elastic.out(1,.2)' });
      }
    });
  });

  /* ═══════════════ scroll reveals ═══════════════ */
  if (G && !RM && window.ScrollTrigger) {
    $$('.lu__head, .gr__head, .by__copy').forEach((h) => gsap.from(h.children, { y: 40, opacity: 0, stagger: 0.08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 82%', once: true } }));
    gsap.from('.gc', { y: 90, rotate: (i) => [-3, 2, -2][i], opacity: 0, stagger: 0.12, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.gr__cards', start: 'top 85%', once: true } });
    gsap.from('.by__photo', { clipPath: 'inset(100% 0 0 0)', duration: 1.3, ease: 'expo.inOut', scrollTrigger: { trigger: '.by', start: 'top 75%', once: true } });
    gsap.from('.lu__bench > *', { y: 40, opacity: 0, stagger: 0.1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.lu__bench', start: 'top 88%', once: true } });
  }
})();
