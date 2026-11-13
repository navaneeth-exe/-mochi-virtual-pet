# Visual Design System & UI Specifications — MOCHI: Your Pocket Companion

> **Document Status:** Finalized Phase 2 Design System  
> **Aesthetic Philosophy:** Nostalgic Japanese Pixel Art & Tactile Monochrome LCD  
> **Visual Discipline:** Pure Monochrome Spectrum, Zero Color Bleed, Nearest-Neighbor Pixel Scaling

---

## 1. Aesthetic Vision & Design Pillars

MOCHI rejects the hyper-saturated, gradient-heavy visual cliches of modern gamified apps. Instead, it embraces the calm, tactile discipline of a 1990s Japanese electronic pocket companion (like Tamagotchi and Game Boy Pocket), refined with clean Swiss typography and modern touch ergonomics.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MOCHI DESIGN PILLARS                            │
├───────────────────┬────────────────────────────────────────────────────┤
│ 1. Tactile Calm   │ High-contrast monochrome palette that is gentle    │
│                   │ on the eyes; evokes physical handheld hardware.   │
├───────────────────┼────────────────────────────────────────────────────┤
│ 2. Character-First│ Mochi is the focal anchor. Interface elements stay │
│                   │ subordinate and unobtrusive until activated.       │
├───────────────────┼────────────────────────────────────────────────────┤
│ 3. Pixel Precision│ Absolute nearest-neighbor rendering (no blur).     │
│                   │ Crisp at 1x, 2x, 4x integer display scaling.       │
├───────────────────┼────────────────────────────────────────────────────┤
│ 4. Emotional Depth│ Clear, expressive facial states and micro-motions  │
│                   │ communicate needs without cluttered text tables.   │
└───────────────────┴────────────────────────────────────────────────────┘
```

---

## 2. Monochrome Color Palette (Exact Hex Tokens)

Every UI element and sprite strictly adheres to this 6-token grayscale spectrum:

| Token Variable | Hex Code | Visual Swatch | Semantic Purpose & Usage |
| :--- | :--- | :--- | :--- |
| `--color-ink-black` | `#111111` | ![#111111](https://via.placeholder.com/14/111111/111111.png) | Primary character contours, outer borders, active button icons, high-contrast headings. |
| `--color-ink-muted` | `#4B5563` | ![#4B5563](https://via.placeholder.com/14/4B5563/4B5563.png) | Secondary labels, timestamp captions, inactive tab outlines, subtle gauge borders. |
| `--color-shade-subtle` | `#D4D4CE` | ![#D4D4CE](https://via.placeholder.com/14/D4D4CE/D4D4CE.png) | Ambient ground shadow under Mochi, empty gauge segments, divider rules. |
| `--color-surface-pure` | `#FFFFFF` | ![#FFFFFF](https://via.placeholder.com/14/FFFFFF/FFFFFF.png) | Mochi body fills, dialogue speech bubbles, active button surfaces, modal cards. |
| `--color-lcd-canvas` | `#EDECE6` | ![#EDECE6](https://via.placeholder.com/14/EDECE6/EDECE6.png) | Primary viewport background (warm retro Game Boy / Tamagotchi paper tint). |
| `--color-chassis-dark` | `#222224` | ![#222224](https://via.placeholder.com/14/222224/222224.png) | Handheld console bezel, directional D-pad, physical device boundary on desktop. |

---

## 2B. Elevated Premium Palette & Motion Tokens (Transformation Update)

In accordance with the commercial-grade product transformation, the surrounding application environment incorporates a tasteful, warm, and sophisticated pastel palette inspired by Finch and Apple-quality mobile applications, while **Mochi itself remains 100% strictly monochrome black-and-white pixel art**:

| Token Variable | Hex Code | Visual Swatch | Semantic Purpose & Usage |
| :--- | :--- | :--- | :--- |
| `--color-bg-canvas` | `#FAF8F5` | ![#FAF8F5](https://via.placeholder.com/14/FAF8F5/FAF8F5.png) | Primary warm eggshell canvas backdrop; soft, calming, non-fatiguing. |
| `--color-bg-card` | `#FFFFFF` | ![#FFFFFF](https://via.placeholder.com/14/FFFFFF/FFFFFF.png) | Pure card surface with diffused ambient shadows (`shadow-sm`, `shadow-md`). |
| `--color-ink-primary` | `#18181B` | ![#18181B](https://via.placeholder.com/14/18181B/18181B.png) | Deep crisp charcoal ink typography and high-contrast iconography. |
| `--color-pastel-sage` | `#E8F2EA` | ![#E8F2EA](https://via.placeholder.com/14/E8F2EA/E8F2EA.png) | Energy gauge background, task completion badges, online presence indicators. |
| `--color-pastel-lavender` | `#EFEAF8` | ![#EFEAF8](https://via.placeholder.com/14/EFEAF8/EFEAF8.png) | Joy & Happiness gauge background, affection petting highlights. |
| `--color-pastel-peach` | `#FDF0EB` | ![#FDF0EB](https://via.placeholder.com/14/FDF0EB/FDF0EB.png) | Fullness & Hunger gauge background, berry reserve counters, action accents. |
| `--color-pastel-sky` | `#EBF4FC` | ![#EBF4FC](https://via.placeholder.com/14/EBF4FC/EBF4FC.png) | Play & activity button surfaces, interactive gesture highlights. |

---

## 3. Typography Hierarchy

MOCHI pairs a charming retro pixel header font with a highly legible, clean monospace/sans-serif body font for optimal readability across standard and retina displays.

- **Primary Pixel Font:** `'Silkscreen'`, `'Press Start 2P'`, or fallback `monospace`.
- **Secondary UI Font:** System Monospace Stack (`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`).

| Level | Size / Weight | Line Height | Tracking | Usage Example |
| :--- | :--- | :--- | :--- | :--- |
| **Display Header** | $18\text{px}$ / Pixel Bold | $24\text{px}$ | $+1.5\text{px}$ | Screen Titles ("MOCHI ROOM", "CO-PARENT") |
| **Section Header** | $14\text{px}$ / Pixel Regular | $20\text{px}$ | $+1.0\text{px}$ | Modal Headings ("VITALS", "TODAY'S TASKS") |
| **UI Body / Labels** | $12\text{px}$ / Monospace Medium | $16\text{px}$ | $+0.2\text{px}$ | Button labels, task descriptions, dialogue bubbles |
| **Metric / Gauge** | $10\text{px}$ / Monospace Bold | $14\text{px}$ | $+0.5\text{px}$ | Hunger (85%), Version counters, Room code |
| **Micro Caption** | $9\text{px}$ / Monospace | $12\text{px}$ | $0$ | Timestamp ("Fed 2m ago", "Device B joined") |

---

## 4. Component Styles

### 4.1 Buttons & Interactive Controls
- **Tactile Physicality:** Buttons are designed to look like physical plastic chiclet keys with a $2\text{px}$ black border and a $2\text{px}$ offset drop-shadow (`box-shadow: 2px 2px 0px #111111`).
- **Active State:** On click/tap, the button translates $1\text{px}$ down and right with shadow flattening (`transform: translate(1px, 1px); box-shadow: 1px 1px 0px #111111`), providing immediate tactile satisfaction.
- **Minimum Touch Target:** All mobile touch targets measure at least $48\text{px} \times 48\text{px}$ to comply with WCAG 2.1 accessibility criteria.

### 4.2 Cards, Panels & Drawers
- **Monochrome Modals:** Pure white background (`#FFFFFF`) with a solid $2\text{px}$ black border (`#111111`) and rounded corners (`border-radius: 8px`).
- **Tactile Drawer:** The tasks and interaction controls slide up from the bottom of the screen via a clean bottom drawer with a chunky drag handle (`━`).
- **Speech & Dialogue Bubbles:** Rounded white pill containers with a small downward triangle pointing to Mochi's sprout, rendered in crisp black outlines.

### 4.3 Navigation Style
- **Mobile Navigation:** Minimalist top status pill (displaying room code `#MCH-842` and caretaker counter) and an unobtrusive bottom action shelf.
- **Desktop Navigation:** Rendered on the physical console frame using authentic physical buttons:
  - **D-Pad:** Directional navigation for Mochi.
  - **Button A (Right):** Primary Action (Feed / Confirm).
  - **Button B (Right):** Secondary Action (Pet / Cancel).
  - **Start / Select (Bottom):** Menu drawer toggle & Sound mute.

---

## 5. Character Sprite Anatomy & Emotional Consistency

Mochi's character proportions and botanical sprout remain **100% mathematically consistent** across all expressions to guarantee instant brand recognition:

```
          [ SPPROUT ]  <-- Symmetrical 2-leaf sprout (always 8px tall)
          🌿     🌿
       ┌─────────────┐
       │             │  <-- Plump round body (32x28px base oval)
       │  (•  ‿  •)  │  <-- Dynamic facial expression area (16x10px)
       │             │
       └──┬───────┬──┘
          🦶     🦶     <-- Two stubby rounded feet (4px tall)
```

### The Five Verified Emotional Expressions:
1. **Idle State:** Neutral curved eyes, small closed smile, subtle 2-frame vertical breathing loop (1px bounce every 800ms).
2. **Sad State (Task 2):** Drooping down-angled eyes, small frowning mouth, single visible falling teardrop (`💧`).
3. **Happy State (Task 2):** Closed curved crescent smiling eyes (`^ ‿ ^`), wide open joyful smile, raised blush cheeks.
4. **Surprised State (Task 2):** Wide-open rounded circular eyes (`O ᗜ O`), open 'O' mouth, surprise reaction marks (`!?`).
5. **Angry State (Task 2):** Downward-slanted aggressive eyebrows, intense eyes, tight stern mouth, 4-way anger vein mark (`💢`).

---

## 6. Motion & Animation Principles

1. **Retro Character Framerate (8–12 FPS):** Mochi's sprite frame swaps run at authentic retro framerates using stepped CSS keyframes (`animation-timing-function: steps(2)`), preserving the authentic nostalgic Game Boy feel.
2. **Smooth UI Chrome (60 FPS):** All drawer slide-outs, modal transitions, and gauge fills run at a fluid 60 FPS using smooth cubic-bezier easing (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
3. **Task 1 Gesture 1 (Spacebar Run):** Fast horizontal displacement across the viewport paired with 2-frame alternating foot strides and small trailing pixel dust puffs.
4. **Task 1 Gesture 2 (Double-Tap Happy):** Rapid upward spring bounce ($24\text{px}$ leap) with squash-and-stretch on landing, radiating celebration speed lines.
5. **Task 1 Gesture 3 (Top-of-Window Feed):** 3-frame chomping mouth animation, floating heart pixel pop, and smooth gauge replenishment.
6. **Accessibility & Reduced Motion:** When `prefers-reduced-motion: reduce` is enabled, all bouncing and running camera shakes are disabled; emotion frames transition statically.

---

## 7. Responsive Viewport Breakpoints

| Breakpoint | Viewport Width | Presentation Mode & Layout Behavior |
| :--- | :--- | :--- |
| **Mobile Portrait (Default)** | $< 640\text{px}$ | **Full-Screen Pocket Toy:** Mochi takes up the main room canvas; bottom drawer slides up for tasks and controls. Maximum touch accessibility. |
| **Tablet / Foldable** | $640\text{px} - 1024\text{px}$ | **Adaptive Console:** Canvas centered on a warm wooden/retro desk background; subtle handheld bezel framing. |
| **Desktop / Widescreen** | $\ge 1024\text{px}$ | **Virtual Handheld Console Chassis:** Centered Game Boy / Tamagotchi chassis with active physical D-pad, A/B buttons, and desk surroundings. |

---

## 8. Production Asset Directory & Implemented CSS Utility Tokens

### 8.1 Production Character Sprites (`public/assets/mochi/`)
All sprites are saved as 512×512 PNG images with crisp black contours (`#111111`), opaque white internal fills (`#FFFFFF`), and clean transparent backgrounds (`alpha = 0`) generated via border-seeded BFS flood-fill:
- `mochi-idle.png` — Calm, neutral resting posture.
- `mochi-happy.png` — Joyful crescent smiling eyes, cheerful open mouth, raised blush cheeks.
- `mochi-sad.png` — Drooping eyes, quivering frown, teardrop.
- `mochi-surprised.png` — Wide circular eyes, open 'O' mouth, surprise reaction punctuation (`!?`).
- `mochi-angry.png` — Lowered aggressive brows, stern mouth, floating 4-way anger vein mark (`💢`).

### 8.2 Production Items & Web App Icons (`public/assets/`)
- `food-berry.png` — 64×64 pixel digital berry.
- `food-onigiri.png` — 64×64 pixel traditional rice ball.
- `icon-192.png` — 192×192 PWA application icon.
- `icon-512.png` — 512×512 PWA splash icon.
- `favicon.png` — 64×64 browser tab icon.

### 8.3 Custom CSS Design Tokens & Utilities (`src/styles/index.css`)
- `.lcd-screen`: Background `#C4CFA1` (active Game Boy paper tint), border `2px solid #111111`, inset shadow `inset 0 2px 4px rgba(0,0,0,0.15)`.
- `.retro-btn`: Border `2px solid #111111`, `box-shadow: 2px 2px 0px #111111`, active state `translate(1px, 1px)` with `box-shadow: 1px 1px 0px #111111`.
- `.speech-bubble`: White pill with crisp black border, downward triangle marker, and gentle floating animation.
- `.pixel-art`: Enforces `image-rendering: pixelated; image-rendering: crisp-edges`.
- Keyframes: `@keyframes mochi-breathe` (2-step idle respiration), `@keyframes mochi-run` (horizontal stride with dust), `@keyframes mochi-bounce` (vertical spring leap).
