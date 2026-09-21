# web3min — Design system

Source of truth for UI. Do not prompt “make it look premium.” Build from these rules and the visual references below.

## References (real, not generated)

- Duolingo product chrome — chunky 4px lip, rounded everything, one loud primary, HUD capsules. [open-design Duolingo DESIGN.md](https://github.com/nexu-io/open-design/blob/main/design-systems/duolingo/DESIGN.md)
- Landdding 2026 — type does the work; no Inter-for-everything; one saturated accent. Not dark-SaaS (that is the wrong category).
- Motion-in-design / Duo motion — press 180ms, unlock 320ms, node pulse 1.6s, back-out overshoot only on rewards.
- Logo lockup — mascot face + wordmark, like Duo owl + name. Not a gem/diamond mark.

This is a **toy that teaches**, not a SaaS landing. Palette stays rose-peach for the blobfish. Worlds get their own 4-color skins. App chrome does not.

## Color (chrome)

| Token | Hex | Role |
|---|---|---|
| bg | `#fff7f9` | page |
| paper | `#ffe4eb` | cards |
| fg | `#3b1f2a` | ink |
| muted | `#9a5b6c` | secondary text |
| line | `#f4cdd6` | hairline-never; always 2px |
| primary | `#f25d7a` | brand, CTA, active nav |
| primary-shadow | `#c4455e` | 4px lip |
| streak | `#ff7a4d` | fire |
| gold | `#e09a18` | bintang |
| danger | `#e23d4a` | nyawa / salah |

World skins override `--world-*` only inside a unit section or quiz shell. Never mix a world hue into the sticky HUD.

## Type

- Family: **Nunito 800** (DIN Round stand-in). No Inter. No second family.
- Buttons: 14–16px, uppercase, tracking `0.08em`
- Display: 28–32px black, tracking tight, line 1.1
- Body: 15–16px extra-bold, line 1.45
- Labels: 11–12px extra-bold, uppercase

## Shape

- Nothing pointy. Buttons 16px, cards 24–28px, nodes full circle, HUD pills full.
- Every pressable surface has a **4px solid lip** in a darker shade of its own fill.
- Press: `translateY(4px)` + lip collapses, **180ms**, `cubic-bezier(0.2, 0, 0, 1)`.
- Unlock / pop: `cubic-bezier(0.34, 1.56, 0.64, 1)` (back-out). Never on chrome.

## Motion budget

| Event | Duration | Notes |
|---|---|---|
| Button press | 180ms | interruptible transition |
| Quiz option enter | 320ms, 70ms stagger | no blur |
| Skill node pulse | 1.6s | scale 1 → 1.05 |
| Mascot float | 2.2s | idle only |
| Wrong shake | 280ms | X axis 6px |
| Confetti | 900ms | complete only |

`prefers-reduced-motion`: kill loops, keep press.

## Components

- **Wordmark:** idle mascot 32px + `web3min` primary, never icon-font logo.
- **HUD:** streak / bintang / nyawa in bordered capsules, not naked icons.
- **Bottom nav:** 5 tabs, active = soft primary pill + filled icon. Inactive faint outline. Mobile only.
- **Side nav (desktop ≥1024):** left rail, same 5 items, brand on top. Bottom nav hides.
- **Desk rail (≥1280):** misi harian + liga + airdrop clips (modal gas, token nyangkut). Path stays the main column. At 1024–1279 the same clips sit above the path.
- **Quiz keys:** A–D (or Benar/Salah icon) in world color when selected.
- **Check CTA:** world skin, not generic sky blue.
- **Currency:** bintang (star / gold). Never diamond / gem.

## Fusion: Duolingo path × Pokémon overworld

Taste Skill read: playful education game for Indonesian learners. Variance 8 / motion 6 / density 4.

Keep Duo chrome (hearts, streak, bintang, path nodes, 180ms press). Overlay Pokémon *feel* without Pokémon IP:

- Units are **rute**. Checkpoints are **laga**. Chests are **item**.
- WorldGate is **Pusat web3min** (rest stop between routes).
- Each rute has a **tipe** (Rumput, Gelap, Api…) shown as a kind chip, not a designer swatch.
- Quiz foe uses an **HP bar** (soal). Player HP stays Duo hearts.
- Profile has a **lencana rute** case (20 stamps). Locked = grayscale.
- web3min is the professor. Copy stays Indonesian, short, no em-dash.
- **Desktop:** Duo three-column (nav · path · misi). Quiz widens, path snakes more. Mobile stays phone-first.

Do not use Pokédex, Poké Ball, Pikachu, or official type names as trademarks. Inspired, not cloned.


No glassmorphism, no gradient blobs, no Inter, no emoji-as-icon, no “premium dark AI” look, no blur-on-enter, no hairline 1px borders.
