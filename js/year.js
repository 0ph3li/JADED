/* ═══════════════════════════════════════════════════════════════
   JADED — year.js (your year)
   concept, design & code by ghostly.grl ♥
   - type your birth year: the ink wheel turns to your animal and
     every piece of "merch" on the page is printed with it
   - lucky hour (the old two-hour clock), who to text (三合),
     who not to (your opposite), 2026 in the year of the fire horse
   - the cd plays your animal on jade (a pentatonic tune, seeded)
   - saved in jd-year, same as the home
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const JD = window.JD, { $, $$, RM } = JD;
  const G = !!window.gsap;

  //   en, cn, pinyin, jade, piece, line (same as the home), 2026, song, lucky no.
  const Z = [
    ['rat', '鼠', 'shu', 'honey', 'im-fine', 'clever, charming, already has a plan b. this is plan b.', 'your clash year: the horse sits right across from you. wear the jade, skip the drama, don’t reply before noon.', 'plan b', 2],
    ['ox', '牛', 'niu', 'black', 'u-up', 'loyal to a fault. the fault was them.', 'slow and steady. the horse runs, you arrive. someone from 2019 will text. the answer is no.', 'loyal (to a fault)', 1],
    ['tiger', '虎', 'hu', 'imperial', 'the-exs-birthday', 'you don’t wait for the call. you are the call.', 'the horse is on your side. a great year to start something and not tell anyone until it works.', 'i am the call', 3],
    ['rabbit', '兔', 'tu', 'lavender', 'left-on-read', 'soft heart, sharp memory. you remember everything they said.', 'quiet luck. a small, pretty thing makes a big difference. (it’s a bangle.)', 'screenshot', 6],
    ['dragon', '龍', 'long', 'imperial', 'self-gift', 'main character. buy the big bangle.', 'big year. the horse makes room for you. so does your wrist.', 'main character', 7],
    ['snake', '蛇', 'she', 'lavender', 'healing-era', 'calm, cold, a little dangerous. like jade, actually.', 'money comes in, people go out. honestly, both are good news.', 'cold blooded', 9],
    ['horse', '馬', 'ma', 'honey', 'im-fine', 'always leaving first. good. keep it that way.', 'your own year, 本命年. tradition says wear red and jade for protection. we sell one of those.', 'leaving first', 7],
    ['goat', '羊', 'yang', 'icy', 'seen-2347', 'too kind for them. start with yourself.', 'the horse’s best friend. everything gets easier after the spring. let it.', 'too kind', 2],
    ['monkey', '猴', 'hou', 'honey', 'im-fine', 'bored by the second date. jade won’t bore you. it’s seen worse.', 'busy, funny, slightly chaotic. keep one thing that doesn’t move. like a stone.', 'second date', 9],
    ['rooster', '雞', 'ji', 'icy', 'seen-2347', 'you’re right. you were right then too.', 'you’ll be right a lot this year. try saying it less. kidding. say it.', 'told you so', 8],
    ['dog', '狗', 'gou', 'black', 'u-up', 'you waited the longest. not anymore.', 'the horse has your back. finally, someone who does.', 'not anymore', 4],
    ['pig', '豬', 'zhu', 'lavender', 'left-on-read', 'generous, warm, deserves a gift. from you, to you.', 'a softer year. say yes to the gift, say no to the ex.', 'gift to self', 5],
  ];
  const HOUR = { 0: 'the u up? hour. coincidence.', 4: 'breakfast. you’re unstoppable before anyone’s awake.', 6: 'lunch. the horse eats first.', 11: 'late. the good conversations happen now.' };
  const pad = (n) => String((n + 24) % 24).padStart(2, '0');
  const idxOf = (y) => (((y - 4) % 12) + 12) % 12;
  const the = (i) => 'the ' + Z[i][0];

  const yi = $('[data-yr-input]'), prevBtn = $('[data-prev]');
  let year = JD.get('year', 2001), before = false, cur = -1;

  /* the wheel */
  const wheel = $('[data-wheel]');
  wheel.innerHTML = Z.map(([en, cn], i) => {
    const a = (i * 30 * Math.PI) / 180;
    return `<span data-i="${i}" style="left:${50 + 44 * Math.sin(a)}%;top:${50 - 44 * Math.cos(a)}%;transform:rotate(${i * 30}deg)" title="${en}">${cn}</span>`;
  }).join('');
  let wrot = 0;

  /* the twelve + the playlist */
  $('[data-twelve]').innerHTML = Z.map(([en, cn], i) => `<li><button data-i="${i}" data-cursor="${en}" aria-label="${en}">${cn}</button></li>`).join('');
  $('[data-playlist]').innerHTML = Z.map((z, i) => `<li data-i="${i}">${z[7]} <i>— ${z[0]}</i></li>`).join('');

  const setAll = (sel, fn) => $$(sel).forEach(fn);
  const flip = (els) => { if (G && !RM) gsap.fromTo(els, { rotationY: 90, scale: 0.8 }, { rotationY: 0, scale: 1, duration: 0.55, stagger: 0.02, ease: 'back.out(2)' }); };

  function show(user) {
    const i = (idxOf(year) - (before ? 1 : 0) + 12) % 12;
    if (i === cur) return;
    const first = cur === -1; cur = i;
    const [en, cn, pin, jade, piece, line, y26, , num] = Z[i], j = JD.JADES[jade];
    const cnEls = $$('[data-me-cn]');
    cnEls.forEach((el) => (el.textContent = cn));
    setAll('[data-me-up]', (el) => (el.textContent = en.toUpperCase()));
    setAll('[data-me-en]', (el) => (el.textContent = en));
    setAll('[data-me-pin]', (el) => (el.textContent = pin));
    setAll('[data-me-line]', (el) => (el.textContent = line));
    setAll('[data-me-2026]', (el) => (el.textContent = y26));
    setAll('[data-me-num]', (el) => (el.textContent = num));
    setAll('[data-me-jname]', (el) => (el.textContent = j.name));
    setAll('[data-me-jcn]', (el) => (el.textContent = j.cn));
    setAll('[data-me-piece]', (el) => (el.href = 'shop.html#' + piece));
    setAll('[data-me-jade]', (el) => JD.paint(el, jade));
    $('.po__jade').dataset.tap = jade;
    const h = i * 2 - 1;
    $('[data-me-hour]').textContent = pad(h) + '—' + pad(h + 2);
    $('[data-me-hour-line]').textContent = HOUR[i] || 'your best two hours of the day. send nothing outside them.';
    const c = (i + 6) % 12;
    $('[data-me-clash-cn]').textContent = Z[c][1];
    $('[data-me-clash]').textContent = the(c);
    const tri = [(i + 4) % 12, (i + 8) % 12];
    $('[data-me-trine]').textContent = tri.map((t) => Z[t][1]).join(' · ');
    $('[data-me-trine-en]').textContent = the(tri[0]) + ' and ' + the(tri[1]);
    $('[data-me-next]').textContent = 2026 + ((i - 6 + 12) % 12 || 12);
    $$('.wheel span, .twelve button, .pl li').forEach((el) => el.classList.toggle('is-me', +el.dataset.i === i));

    // turn the wheel so you're on top (the short way round)
    let target = -i * 30; while (target - wrot > 180) target -= 360; while (wrot - target > 180) target += 360; wrot = target;
    if (G && !RM && !first) gsap.to(wheel, { rotation: wrot, duration: 1.2, ease: 'expo.out' }); else wheel.style.transform = `rotate(${wrot}deg)`;
    if (!first) { flip(cnEls); if (user) JD.ring(jade, 0.6); }
  }

  function setYear(y, user) {
    if (isNaN(y)) return;
    year = Math.max(1930, Math.min(2026, y)); JD.set('year', year);
    if (document.activeElement !== yi) yi.value = year;
    show(user);
  }
  yi.value = year;
  yi.addEventListener('input', () => { const v = parseInt(yi.value, 10); if (v >= 1930 && v <= 2026) setYear(v, true); });
  yi.addEventListener('blur', () => (yi.value = year));
  $$('[data-yr]').forEach((b) => b.addEventListener('click', () => setYear(year + +b.dataset.yr, true)));
  prevBtn.addEventListener('click', () => { before = !before; prevBtn.classList.toggle('is-on', before); prevBtn.textContent = before ? 'undo, i’m the one on the year →' : 'be the one before →'; show(true); });

  // borrow an animal: jump to the nearest year that has it
  const borrow = (k) => { before = false; prevBtn.classList.remove('is-on'); prevBtn.textContent = 'be the one before →'; let d = (k - idxOf(year) + 12) % 12; if (d > 6) d -= 12; let y = year + d; if (y > 2026) y -= 12; setYear(y, true); };
  wheel.addEventListener('click', (e) => { const s = e.target.closest('span[data-i]'); if (s) borrow(+s.dataset.i); });
  $('[data-twelve]').addEventListener('click', (e) => { const b = e.target.closest('button[data-i]'); if (b) borrow(+b.dataset.i); });
  $('[data-playlist]').addEventListener('click', (e) => { const l = e.target.closest('li[data-i]'); if (l) borrow(+l.dataset.i); });

  setYear(year, false);

  /* ═══════════════ the cd: your animal played on jade ═══════════════ */
  const cd = $('[data-cd]'), cdt = $('[data-cd-t]');
  let playing = 0;
  cd.addEventListener('click', () => {
    if (playing) return;
    if (!JD.soundOn) { JD.toast('<b>靜</b> sound is off. turn it on up top.'); return; }
    const z = Z[cur], f = JD.JADES[z[3]].f / 2, R = [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3, 2, 9 / 4];
    let s = cur * 7919 + 13; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const notes = Array.from({ length: 10 }, (_, k) => (k === 9 ? 0 : (rnd() * R.length) | 0));
    playing = 1; cd.classList.add('is-playing');
    cdt.textContent = `now playing: ${z[7]} — ${z[0]}`;
    notes.forEach((n, k) => setTimeout(() => JD.ring(f * R[n] * (k % 4 === 3 ? 2 : 1), k === 9 ? 0.9 : 0.55), k * 280 + (k === 9 ? 200 : 0)));
    setTimeout(() => { playing = 0; cd.classList.remove('is-playing'); cdt.textContent = 'tap the cd. your animal, played on jade.'; }, 10 * 280 + 2600);
  });

  /* ═══════════════ motion ═══════════════ */
  JD.ready.then(() => {
    if (!G || RM) return;
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .from('.po__oval', { scaleX: 0, duration: 1.1, ease: 'expo.inOut' })
      .from('.po__title b', { yPercent: 60, opacity: 0, rotate: -10, stagger: 0.08, duration: 1 }, '-=.6')
      .from('.po__pix, .po__yr, .pick, .po__orn, .po__big, .po__foot', { y: 30, opacity: 0, stagger: 0.07, duration: 0.9 }, '-=.7')
      .from('.wheel span', { scale: 0, opacity: 0, stagger: 0.04, duration: 0.6, ease: 'back.out(2)' }, 0.3)
      .from('.po__orbit', { opacity: 0, duration: 1.2 }, 0.3)
      .from('.po__me', { scale: 0.4, rotate: -30, opacity: 0, duration: 1.3, ease: 'back.out(1.5)' }, 0.7)
      .call(() => JD.tap($('.po__jade'), null, { quiet: true }));
  });
  if (G && !RM && window.ScrollTrigger) {
    gsap.from('.tote', { y: 120, rotate: (i) => (i ? 3 : -3), opacity: 0, stagger: 0.12, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.mr--a', start: 'top 80%', once: true } });
    gsap.from('.mask', { x: 60, opacity: 0, stagger: 0.12, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.masks', start: 'top 85%', once: true } });
    gsap.from('.tk', { y: 80, opacity: 0, stagger: 0.12, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.mr--b', start: 'top 85%', once: true } });
    gsap.from('.cup', { y: 60, opacity: 0, stagger: 0.1, duration: 1, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.cups', start: 'top 90%', once: true } });
    gsap.from('.sq__c', { y: 90, opacity: 0, stagger: 0.1, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.sq', start: 'top 85%', once: true } });
  }
})();
