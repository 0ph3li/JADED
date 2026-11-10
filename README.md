# JADED · 翡翠 — jade for the jaded

**JADED** is a concept website for a jade jewellery shop in via Paolo Sarpi, Milano's Chinatown. The shop doesn't exist.
It sells bangles, a pendant and a phone charm in five jades (imperial green, lavender, icy, honey and black) to girls who stopped waiting for the call.

You test real jade by tapping it with a coin: real stone rings, clear and long, while glass and resin go *tok*. So on this site **every bangle rings when you tap it**.

> it rings when it’s real. he didn’t.

Concept, design & code by **ghostly.grl** ♥ · case study 29 of martina.exe · 🎬 reel: [`reel/jaded-reel.mp4`](reel/jaded-reel.mp4)

---

## The idea

Jade jewellery is usually sold as heritage and luck. JADED sells it as aftercare, and makes the test for real jade the whole brand:

- **Everything rings.** Each jade has its own note, played on a stone bell built with Web Audio. Tap a bangle anywhere on the site and it ripples, wobbles and rings.
- **The collection is an album.** Nine pieces, nine tracks: *left on read*, *u up?*, *situationship*, *the ex’s birthday*, *seen 23:47*, *i’m fine*, *new number, who dis*, *healing era*, and the bonus track *self-gift*.
- **Every colour is someone you used to text.** Imperial green is for the one who left, lavender for the one who said “i’m not ready”, black jade for the ones we don’t talk about.
- **It’s a real shop, with real tests.** The site explains the actual ways to spot fake jade: tap it, hold it, shine a light through it, weigh it, look at it under a loupe. It also explains the type A / B / C grades on a lab certificate.

### Art direction: one shocking-pink poster world

There is one world only: the **shocking-pink poster** from the moodboard. That means pink and cream paper, black ink, cream characters in black blocks, and red seals. **Jade green** is the only other colour, taken from the roof tiles and leaves in the references.

Every screen is rebuilt from a reference in the `VIBES/` moodboard, often screen by screen:

| reference (`VIBES/`) | becomes |
|---|---|
| `05-dong-fang-zhen-cang.jpg` | the home poster: 翡 翠 玉 in black blocks, with pink serif over them |
| `01-misery-butterfly-board.jpg` | the tests as a booklet spread, and the collection as an album cover with a tracklist |
| `07-lucky-snake-window.jpg` | the colours, seen through a lattice window |
| `03-bed-phone.jpg` | the call: a girl on a pink bed and a lock screen full of missed calls |
| `04-oriental-spring-garden.jpg` | the shop: pieces hanging on red cords like lanterns |
| `11-four-seasons-tea.jpg` | four ways to wear it, as four season banners |
| `09-sprout-society.jpg` | the colours brand board, turned pink |
| `02-bitmap-effect.jpg` | the rarity chart, a thousand tiny squares per colour |
| `08-wear-the-feeling.jpg` | the *@ISIT- REAL?* magazine spread |
| `10-four-beasts-merch.jpg` | the whole *your year* page, and the box on the home |
| `06-tea-banners-pastel.jpg` | the whole *visit* page, one banner per section |

**Type**:
- [Noto Serif TC](https://fonts.google.com/noto/specimen/Noto+Serif+TC): every Chinese character, from hairline 200 to black 900.
- [Bodoni Moda](https://fonts.google.com/specimen/Bodoni+Moda): the italic voice.
- [Big Shoulders Display](https://fonts.google.com/specimen/Big+Shoulders+Display): condensed poster caps.
- [Figtree](https://fonts.google.com/specimen/Figtree): body text, and the giant black grotesk on *is it real?*.
- [Martian Mono](https://fonts.google.com/specimen/Martian+Mono): labels and small print.
- [Pixelify Sans](https://fonts.google.com/specimen/Pixelify+Sans): the merch on *your year*.

---

## Pages

### `index.html` · home
| screen | what happens |
|---|---|
| **The poster** | 翡 翠 玉 in black blocks on shocking pink, opening hours in tall condensed type, and a real bangle you can tap. It counts how many times you’ve tapped. |
| **We test every piece. He never passed any.** | Three cream cards. *It rings*: tap it and watch the waveform decay. *It stays cold*: press and hold, and the temperature barely moves. *Light goes through*: a torch follows the cursor and shows the veins. |
| **The collection is a tracklist** | *JADED is a Bangle*: an album cover photo and nine tracks. Press ▶ and a piece rings; hover and a card with the piece follows the cursor. |
| **Jade colour** | A lattice window. Pick a colour chip and the sky, the bangle and the line all change, and it rings in that colour’s note. |
| **It warms up to you slowly** | A girl on a pink bed and a lock screen: *hey*, *u up?*, *missed call*, then one message from JADED: your bangle is ready. |
| **What year were you born, babe?** | Type your year to get your animal, your jade and a jaded horoscope. |
| **玉盒 · the box** | The pink silk pouch, the black box, and a certificate you stamp 真品 yourself. |

### `shop.html` · the pieces
| screen | what happens |
|---|---|
| **九件 the pieces** | The spring garden poster: nine pieces drop in on red cords and hang like lanterns. They sway in a draft; tap one and it swings and rings. |
| **The velvet tray** | Every piece on black velvet. Filter by colour (it rings) or type, and sort by price. |
| **The counter** | Open a piece and tap it to hear it. Pick an inner diameter from 52 to 62 mm, then *hold it at the counter* for 48 hours. Deep links work, e.g. `shop.html#self-gift`. |
| **Find your size** | Slide your hand width to get your bangle size. It rings at every new size. |
| **Four ways to wear it** | Four season banners: *every day* (jade gets shinier from your skin), *not at the gym*, *mind the marble*, *if it breaks* (it took the bad luck for you). |

### `colours.html` · the five jades
| screen | what happens |
|---|---|
| **五色 five jades** | A brand board turned pink: standard colours, hex dots that ring, and three views of the bangle (front, side, top). |
| **Five chapters, sideways** | Pinned, one colour per screen: the big character (帝王綠, 紫羅蘭, 冰種, 黃翡, 墨翠), the bangle tilting in 3D with your cursor, who it’s for, rarity / glow / warmth in pixels, and *texts back: never. it’s a stone.* |
| **Rarer than a decent apology** | A bitmap chart with a thousand squares per colour, from 4 in 1000 for imperial up to 60 for honey. |
| **The stand** | Pick three colours. They slide down a black velvet cone and ring together as a chord, and the stack gets a verdict (*“green on black. it says ‘i’m doing great’ in a font they can’t afford.”*). |

### `real.html` · is it real?
| screen | what happens |
|---|---|
| **@ISIT- R E A L ?** | A magazine spread copied from the moodboard: a night flash portrait, a coin tapping a peacock bangle, and the jade bangle where the pink ball was. Tap it and it rings. |
| **The lineup** | *Two of them are real. Three of them are lying.* Five suspects stand on a pink height chart: two real jades, glass, resin and dyed B+C jade. Run five tests on each one, then stamp it 真 real or 假 fake and get a score out of 5. |
| **A, B, C. We only sell A.** | Natural, bleached, dyed. A rings; B and C go tok and crack. |
| **Bring the one he gave you** | A free test at the counter. *We can tell you if the bangle is real. The rest is on you.* |

The five tests in the lineup:
- **tap it**: you hear it and see the decay.
- **hold it**: the temperature after five seconds.
- **light it**: a torch from behind. Black jade turns green inside.
- **weigh it**: a red digital scale.
- **look closer**: a 10× loupe showing crystals, bubbles, flow lines or dye in the cracks.

### `year.html` · your year
The four sacred beasts merch board, copied screen by screen and printed with **your** animal.

| screen | what happens |
|---|---|
| **年年有玉** | The poster: brushed ink in a cream oval, NIANNIANYOUYU in pixel type, your birth year with − / +, and an ink wheel of the twelve animals that turns until yours is on top, with your jade in the middle. A *be the one before* switch is there for anyone born in January or early February. |
| **Totes + masks** | Your animal and its horoscope on a cream tote, your jade on a pink one. The masks give your lucky hour from the old two-hour clock (the rat gets 23–01, *“the u up? hour. coincidence.”*) and who not to text: your opposite on the wheel. |
| **Tickets + cups** | Who to text back (your 三合 triangle), your 2026 in the year of the fire horse, your lucky number and your lucky jade. |
| **Four squares** | The twelve (tap one to borrow it), a playlist with one song per animal, a CD that spins and plays your animal on jade, and *一生一玉*: the next year of your animal, when the bangle will still be on your wrist. |

### `visit.html` · visit
The pastel tea banners, one per section, stacked on black.

| screen | what happens |
|---|---|
| **「來坐」 come by** | Hairline type in brackets, a tea cup and a bangle on the table, and a live sign that knows whether the shop is open right now, in Milano time. |
| **Via Paolo Sarpi, nine** | A pastel map. A little dot walks you there from M2 Moscova (*past the dumplings… left on via paolo sarpi*). |
| **Hours** | Seven day cards: today is lit up with a line for the time of day, and every day has its own line (*sun: closed. we’re at dim sum.*). |
| **When you come** | Four steps: tea, the tap test, the fitting, the pouch. |
| **The fitting** | Try it: a bangle is a closed circle, so hold the button and the hand folds small while the bangle slides from the fingertips past the knuckles to the wrist. Let go too soon and it gets stuck. |
| **A seat at the counter** | Pick a day (the next six open days), a time (some are taken), what it’s for and a first name, and you get a ticket. The booking is never sent anywhere. |

---

## Details worth finding

- **Sound**: every jade has its own note. The nav toggle remembers your choice, and the footer counts every bangle you’ve tapped.
- **Loader**: the bangle drops, *tink*, ripples, *it rings. it’s real.* It plays once per visit.
- **Custom cursor**: a pink dot that turns into a jade ring over anything you can tap, with labels (*tap it*, *hold it*, *look closer*, *walk it*…), plus magnetic buttons.
- **Live Milano clock**: opening hours, the open-now sign, today’s card and the booking slots all run on `Europe/Rome` time.
- **Tab title**: switch tabs and it reads *come back. it’s still cold.*
- **Konami code** (↑ ↑ ↓ ↓ ← → ← → B A): bangles rain down and everything turns imperial green.
- **Console**: open devtools for the cat, then run `JD.help()`. `JD.ring("lavender")` plays a colour, and `JD.imperial()` does what the konami code does.
- **Reduced motion**: with `prefers-reduced-motion` on, animations are skipped and the pages show in their final state.
- **Footer**: *no exes were contacted in the making of this site.*

---

## Photos

The pieces are transparent cut-outs (`.webp`) and the photos are `.jpg`, all optimised.

| folder | what |
|---|---|
| `img/JADES/` | the nine pieces: imperial, lavender, icy, honey and black bangles, the two-tone, the self-gift peacock bangle, the bi disc pendant and the phone charm |
| `img/HOME/` | the album cover, the girl on the bed, the pouch and the box |
| `img/REAL/` | the neon flash portrait, the coin on the peacock bangle, the lotus wallpaper |
| `img/VISIT/` | the arm for the fitting |

The catalogue lives in one place, `JD.PIECES` in `js/main.js`; both the home tracklist and the shop read from it. If a piece photo is ever missing, `JD.paint()` draws an SVG bangle in the right colour instead.

---

## Built with

- Plain **HTML / CSS / JavaScript**: no framework, no build step.
- [**GSAP 3.12.5**](https://gsap.com) + **ScrollTrigger** for entrances, pins, the sideways chapters and scrubs.
- [**Lenis 1.1.13**](https://lenis.darkroom.engineering) for smooth scrolling.
- **Web Audio** for the stone-bell rings (inharmonic partials plus the click of a coin), the *tok* of the fakes and the stand’s chords.
- **Canvas** for the waveforms, the loupe textures and the bitmap rarity chart.
- **SVG** for the fallback bangles, the ink-brush filter (`feDisplacementMap`), the orbit text (`textPath`) and the map.
- CSS container queries, vertical `writing-mode` type, and `clip-path` / `mask` tickets.
- `localStorage` (prefix `jd-`) for sound, taps, your year, held pieces, your size, your stack, the lineup score and your seat.

### Structure

```
JADED/
├── index.html · shop.html · colours.html · real.html · year.html · visit.html
├── css/
│   ├── style.css        shared: tokens, type, nav, loader, cursor, seals, slots, footer
│   └── <page>.css       one per page
├── js/
│   ├── main.js          shared engine (window.JD): JADES, PIECES, paint(), bangle(), ring(), tap(),
│   │                    cursor, lenis, scramble, slots, toast, loader, konami, signature
│   └── <page>.js        one per page
├── img/                 JADES · HOME · REAL · VISIT
├── reel/jaded-reel.mp4  the case-study reel (1080×1920, 30 fps)
├── VIBES/               the moodboard every screen is built from
└── favicon.svg
```

### Run it locally

Any static server works:

```bash
python3 -m http.server 5770
```

Then open http://localhost:5770 and turn the sound on.

---

JADED is a concept: the shop, the address, the prices and the people are made up. The jade tests and the grades are real. The moodboard refs in `VIBES/` belong to their authors.

<sub>concept, design & code by ghostly.grl ♥ · 2026</sub>

