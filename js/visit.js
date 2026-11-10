/* ═══════════════════════════════════════════════════════════════
   JADED — visit.js (visit)
   concept, design & code by ghostly.grl ♥
   - is the door open right now? (milano time, tue—sat 12—20)
   - the week, with today lit up and a line for where the day is
   - the walk from M2 moscova along via paolo sarpi
   - the fitting: hold to fold your hand small, the bangle slides on
   - a seat at the counter: kept in this browser only (jd-visit)
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const JD = window.JD, { $, $$, RM } = JD;
  const G = !!window.gsap;
  const OPEN = 12, CLOSE = 20;

  /* ═══════════════ milano time ═══════════════ */
  const rome = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Rome' }));
  const isOpenDay = (d) => d >= 2 && d <= 6; // tue—sat
  const DN = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const MON = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const dur = (min) => (min >= 60 ? Math.floor(min / 60) + 'h ' : '') + (min % 60) + 'm';

  const nowEl = $('[data-now]'), nowT = $('[data-now-t]');
  function door() {
    const n = rome(), d = n.getDay(), m = n.getHours() * 60 + n.getMinutes();
    const t = $('[data-today]'); if (t) t.textContent = String(n.getMonth() + 1).padStart(2, '0') + '/' + String(n.getDate()).padStart(2, '0');
    let open = false, txt;
    if (isOpenDay(d) && m >= OPEN * 60 && m < CLOSE * 60) { open = true; txt = `open now · closes in ${dur(CLOSE * 60 - m)}. the kettle’s on.`; }
    else if (isOpenDay(d) && m < OPEN * 60) txt = `closed · opens today at 12.00, in ${dur(OPEN * 60 - m)}`;
    else { let k = 1; while (!isOpenDay((d + k) % 7)) k++; txt = `closed · back ${k === 1 ? 'tomorrow' : DN[(d + k) % 7]} at 12.00. we’re resting, like you should.`; }
    nowEl.classList.toggle('is-open', open); nowT.textContent = txt;
    week(n);
  }

  /* ═══════════════ the week ═══════════════ */
  const DAYS = [
    ['mon', '週一', 0, 'closed. we’re not ready to talk.'],
    ['tue', '週二', 1, 'quiet. the best day for a long fitting.'],
    ['wed', '週三', 1, 'new pieces come in. first look is yours.'],
    ['thu', '週四', 1, 'late tea at 19.00. bring a friend, or the friend’s ex.'],
    ['fri', '週五', 1, 'busy after 17. first dates buy here. we see everything.'],
    ['sat', '週六', 1, 'the busiest. bring patience, we bring tea.'],
    ['sun', '週日', 0, 'closed. we’re at dim sum.'],
  ];
  const daysEl = $('[data-days]');
  daysEl.innerHTML = DAYS.map(([en, cn, o, line], i) => `
    <li class="day ${o ? '' : 'is-closed'}" data-d="${(i + 1) % 7}">
      <span class="day__cn">${cn}</span><span class="day__en">${en}</span>
      <span class="day__l">${line}</span>
      <span class="day__bar" aria-hidden="true">${o ? '<i></i>' : ''}<u hidden></u></span>
      <span class="day__h">${o ? '12—20' : 'closed'}</span>
    </li>`).join('');
  function week(n) {
    $$('.day', daysEl).forEach((li) => {
      const today = +li.dataset.d === n.getDay(); li.classList.toggle('is-today', today);
      const u = $('u', li); u.hidden = !today; if (today) u.style.left = ((n.getHours() * 60 + n.getMinutes()) / 1440) * 100 + '%';
    });
  }
  door(); setInterval(door, 30000);

  /* ═══════════════ the walk ═══════════════ */
  const route = $('[data-route]'), walker = $('[data-walker]'), walkT = $('[data-walk-t]'), walkBtn = $('[data-walk]');
  const RL = route.getTotalLength();
  let walking = false;
  const place = (p) => { const pt = route.getPointAtLength(p * RL); walker.setAttribute('cx', pt.x); walker.setAttribute('cy', pt.y); };
  function walk() {
    if (walking) return; walking = true; walkBtn.classList.add('is-on');
    const o = { p: 0 }, end = () => { walking = false; walkBtn.classList.remove('is-on'); walkT.textContent = 'you’re here. the pink sign. come in.'; JD.ring('icy', 0.6); };
    if (!G || RM) { place(1); return end(); }
    gsap.to(o, { p: 1, duration: 4.2, ease: 'none', onUpdate: () => { place(o.p); const left = Math.ceil(7 * (1 - o.p)); walkT.textContent = left ? `${left} min to go · ${o.p < 0.35 ? 'past the dumplings' : o.p < 0.7 ? 'turn onto via bramante' : 'left on via paolo sarpi'}` : 'almost…'; }, onComplete: end });
  }
  walkBtn.addEventListener('click', () => { place(0); walk(); });
  if (window.ScrollTrigger && G && !RM) ScrollTrigger.create({ trigger: '[data-map]', start: 'top 60%', once: true, onEnter: walk });

  /* ═══════════════ the fitting ═══════════════ */
  const hand = $('[data-hand]'), fj = $('[data-fit-jade]'), fline = $('[data-fit-line]'), fbar = $('[data-fit-bar]'), sq = $('[data-squeeze]');
  const KNUCK = 0.7, DUR = 1700;
  let p = 0, holding = false, done = false, last = 0, raf = 0;
  function draw() {
    // her arm photo: fingertips at the top, knuckles at ~21%, the wrist crease at ~43%
    const tip = hand.offsetTop, h = hand.offsetHeight || 640, half = fj.offsetHeight / 2;
    const top = tip - half, knuck = tip + 0.21 * h - half, wrist = tip + 0.44 * h - half;
    const y = p < KNUCK ? top + (knuck - top) * (p / KNUCK) : knuck + (wrist - knuck) * ((p - KNUCK) / (1 - KNUCK));
    fj.style.transform = `translateY(${y}px) scale(${1 - 0.06 * Math.sin(Math.min(1, p) * Math.PI)})`;
    hand.style.transform = `scaleX(${1 - 0.26 * Math.min(1, p / KNUCK) + (p > KNUCK ? 0.26 * ((p - KNUCK) / (1 - KNUCK)) * 0.6 : 0)})`;
    fbar.style.width = p * 100 + '%';
  }
  // runs on the gsap ticker (it keeps going even when the tab is in the background)
  function tick() {
    const t = performance.now(), dt = Math.min(250, t - (last || t)); last = t;
    if (holding && !done) p = Math.min(1, p + dt / DUR);
    else if (!done && p > 0) p = Math.max(p < KNUCK ? 0 : KNUCK, p - dt / (DUR * 0.6));
    draw();
    if (!done && p >= 1) finish();
    if (!(holding || (!done && p > 0 && p !== KNUCK))) stop();
  }
  const loop = () => { tick(); if (raf) raf = requestAnimationFrame(loop); };
  const go = () => { if (raf) return; last = 0; raf = 1; if (G) gsap.ticker.add(tick); else raf = requestAnimationFrame(loop); };
  const stop = () => { if (!raf) return; if (G) gsap.ticker.remove(tick); else cancelAnimationFrame(raf); raf = 0; last = 0; };
  function finish() {
    done = true; holding = false; sq.classList.remove('is-on');
    $('span', sq).textContent = 'take it off';
    fline.textContent = 'it’s on. it’s not coming off. that’s the point.';
    JD.ring('imperial'); JD.toast('<b>戴</b> it’s on. you’re officially jaded.');
    if (G && !RM) gsap.fromTo(fj, { rotate: -6 }, { rotate: 0, duration: 1.2, ease: 'elastic.out(1.2,.25)' });
  }
  function down(e) {
    e.preventDefault();
    if (done) { done = false; p = 0; draw(); $('span', sq).textContent = 'hold to squeeze'; fline.textContent = 'press and hold to fold your hand small. let go too soon and it gets stuck on the knuckles.'; return; }
    holding = true; sq.classList.add('is-on'); fline.textContent = p >= KNUCK ? 'past the knuckles. keep going…' : 'fold your thumb in. breathe out…'; go();
  }
  function up() {
    if (!holding) return; holding = false; sq.classList.remove('is-on');
    if (done) return;
    fline.textContent = p >= KNUCK ? 'over the knuckles! the hard part is done. hold again to slide it down.' : 'stuck on the knuckles. a bit more soap. hold again.';
    if (p < KNUCK) JD.thud();
    go();
  }
  sq.addEventListener('pointerdown', down);
  addEventListener('pointerup', up); addEventListener('pointercancel', up);
  sq.addEventListener('keydown', (e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) down(e); });
  sq.addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') up(); });
  sq.addEventListener('click', (e) => e.preventDefault());
  draw(); hand.complete || hand.addEventListener("load", draw);

  /* ═══════════════ a seat at the counter ═══════════════ */
  const form = $('[data-book]'), ticket = $('[data-ticket]');
  const dayBox = $('[data-book-days]'), timeBox = $('[data-book-times]'), forBox = $('[data-book-for]'), nameIn = $('[data-book-name]');
  const iso = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const TIMES = []; for (let h = OPEN; h < CLOSE; h++) TIMES.push(h + '.00', h + '.30');
  const openDays = () => {
    const out = [], n = rome(), d = new Date(n.getFullYear(), n.getMonth(), n.getDate());
    if (!(isOpenDay(d.getDay()) && n.getHours() * 60 + n.getMinutes() < CLOSE * 60 - 30)) d.setDate(d.getDate() + 1);
    while (out.length < 6) { if (isOpenDay(d.getDay())) out.push(new Date(d)); d.setDate(d.getDate() + 1); }
    return out;
  };
  const label = (d) => DN[d.getDay()].slice(0, 3) + ' ' + d.getDate() + ' ' + MON[d.getMonth()];
  let pick = { day: null, time: null, for: 'a bangle for me' };

  const DAYS6 = openDays();
  dayBox.innerHTML = DAYS6.map((d, i) => `<button type="button" class="chip${i ? '' : ' is-on'}" data-v="${iso(d)}"><b>${i === 0 && iso(d) === iso(rome()) ? 'today' : DN[d.getDay()].slice(0, 3)}</b>${d.getDate()} ${MON[d.getMonth()]}</button>`).join('');
  pick.day = iso(DAYS6[0]);
  function times() {
    const [Y, M, D] = pick.day.split('-').map(Number), seed = Y * 400 + M * 31 + D, n = rome();
    const isToday = pick.day === iso(n), nowM = n.getHours() * 60 + n.getMinutes();
    timeBox.innerHTML = TIMES.map((t, i) => {
      const [h, m] = t.split('.').map(Number);
      const taken = ((seed * (i + 7)) % 11) < 3 || (isToday && h * 60 + m <= nowM + 15);
      return `<button type="button" class="chip" data-v="${t}" ${taken ? 'disabled aria-label="' + t + ', taken"' : ''}>${t}</button>`;
    }).join('');
    const first = $('.chip:not([disabled])', timeBox); if (first) { first.classList.add('is-on'); pick.time = first.dataset.v; } else pick.time = null;
  }
  times();
  const chipGroup = (box, key, after) => box.addEventListener('click', (e) => {
    const c = e.target.closest('.chip'); if (!c || c.disabled) return;
    $$('.chip', box).forEach((x) => x.classList.toggle('is-on', x === c)); pick[key] = c.dataset.v; after && after();
  });
  chipGroup(dayBox, 'day', times); chipGroup(timeBox, 'time'); chipGroup(forBox, 'for');

  function showTicket(b) {
    const [Y, M, D] = b.day.split('-').map(Number), d = new Date(Y, M - 1, D);
    $('[data-t-name]').textContent = b.name ? b.name + ',' : 'you,';
    $('[data-t-when]').textContent = label(d) + ' · ' + b.time;
    $('[data-t-for]').textContent = 'for: ' + b.for + ' · tea included';
    form.hidden = true; ticket.hidden = false;
    if (G && !RM) gsap.from(ticket, { y: 60, rotate: -4, opacity: 0, duration: 1, ease: 'back.out(1.6)' });
  }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!pick.time) { JD.toast('<b>滿</b> that day is full. pick another one.'); return; }
    const b = { day: pick.day, time: pick.time, for: pick.for, name: nameIn.value.trim().slice(0, 24) };
    JD.set('visit', b); showTicket(b); JD.ring('lavender', 0.7);
    JD.toast('<b>座</b> your seat is kept. we’ll keep the kettle on.');
  });
  $('[data-unbook]').addEventListener('click', () => { try { localStorage.removeItem('jd-visit'); } catch (e) {} ticket.hidden = true; form.hidden = false; JD.thud(); });
  const saved = JD.get('visit', null);
  if (saved && saved.day >= iso(rome())) showTicket(saved); else if (saved) { try { localStorage.removeItem('jd-visit'); } catch (e) {} }

  /* ═══════════════ motion ═══════════════ */
  JD.ready.then(() => {
    if (!G || RM) return;
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .from('.vh__cn > *', { y: 60, opacity: 0, stagger: 0.1, duration: 1.2 })
      .from('.vh__tea em, .vh__x, .vh__date', { y: 30, opacity: 0, stagger: 0.08, duration: 1 }, '-=1')
      .from('.vh__hill', { yPercent: 40, opacity: 0, stagger: 0.1, duration: 1.4 }, '-=1')
      .from('.vh__cup', { y: 30, opacity: 0, duration: 0.9 }, '-=1')
      .from('.vh__jade', { y: -160, rotate: -20, opacity: 0, duration: 0.9, ease: 'bounce.out' }, '-=.8')
      .call(() => JD.tap($('.vh__jade'), 'icy', { quiet: true }))
      .from('.vh__box, .vh__now, .vh__addr', { opacity: 0, y: 14, stagger: 0.08, duration: 0.8 }, '-=.4');
  });
  if (G && !RM && window.ScrollTrigger) {
    $$('.st__copy, .wk__head, .hp__head, .bk__copy').forEach((h) => gsap.from(h.children, { y: 40, opacity: 0, stagger: 0.07, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 82%', once: true } }));
    gsap.from('.map', { y: 60, rotate: 2, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.map', start: 'top 85%', once: true } });
    gsap.from('.day', { y: 50, opacity: 0, stagger: 0.06, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: '.days', start: 'top 85%', once: true } });
    gsap.from('.steps li', { y: 50, opacity: 0, stagger: 0.1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.steps', start: 'top 85%', once: true } });
    gsap.from('.fit', { y: 60, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.fit', start: 'top 85%', once: true } });
    gsap.from('.bk__form > *', { y: 30, opacity: 0, stagger: 0.07, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: '.bk__form', start: 'top 85%', once: true } });
  }
})();
