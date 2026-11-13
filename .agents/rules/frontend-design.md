---
description: Frontend design, monochrome aesthetic, mobile-first responsive guidelines, animations, and anti-patterns for MOCHI.
trigger: always_on
globs: "**/*.{ts,tsx,js,jsx,html,css,scss}"
---

# Frontend Design Rules — MOCHI: Your Pocket Companion

## 1. Premium Visual Quality & Aesthetic Philosophy
MOCHI is NOT a modern corporate dashboard or generic AI web app with gradient cards and purple drop-shadows. MOCHI is a tactile, nostalgic digital toy—a fusion of 1990s Tamagotchi hardware aesthetic, modern Japanese pixel art (like Neko Atsume), and clean Swiss typography.

### Design Pillars:
- **Warm LCD / Game Boy Paper Feel:** Crisp monochrome pixel art set against a warm, high-contrast LCD canvas (`#F4F4F0` background with `#111111` ink lines).
- **Physicality & Tactile Delight:** Physical handheld device framing option, embossed buttons, micro-vibrations (haptic feedback API where supported), bouncy spring animations.
- **Intentional Negative Space:** Uncluttered screens centered on the living companion rather than overwhelming stat gauges.

## 2. Monochrome Character Artwork Guidelines
- **Strict Color Budget:**
  - Ink Primary: `#121212` (pure deep charcoal / black)
  - Surface Primary: `#FFFFFF` (pure white character fills)
  - Secondary Shade (Subtle Shadow): `#E0E0DC` (soft grayscale for ambient pixel shading)
  - Canvas Background: `#F5F5F0` (light warm LCD tint)
  - Frame Accent: `#242424` (dark charcoal console border)
- **Zero Color Bleed:** No pastel colors, no rainbow gradients, and no neon badges on character sprites.
- **Character Continuity:**
  - Mochi's round silhouette, pair of distinct leaves sprout on the head, stubby feet, and small hands must remain identical across all emotion states.
  - Sprites must be crisp at $1\times, 2\times, 4\times$ integer scaling using CSS `image-rendering: pixelated` / `crisp-edges`.

## 3. Mobile-First Responsive Architecture
- **Primary Viewport:** Optimized for standard smartphones ($360\text{px} \times 640\text{px}$ up to $430\text{px} \times 932\text{px}$).
- **Touch-Friendly Hit Targets:** All interactive touch elements must measure at least $44\text{px} \times 44\text{px}$ to comply with WCAG 2.1 accessibility criteria.
- **Gesture Support:**
  - Single tap: Inspect status / interact.
  - Double tap: Trigger "Super Happy" interaction.
  - Drag & Drop: Drag Mochi or food item to the top edge of the screen to feed.
  - Keyboard fallback: Spacebar while hovering over Mochi to run; arrow keys for movement.
- **Desktop Adaptation:** On tablet and desktop screens ($\ge 768\text{px}$), the application should render as an elegant virtual handheld console centered on a cozy retro desktop desk background.

## 4. Animation Principles
- **Pixel-Accurate Frame Animations:** 2-to-4 frame idle breathing, ear/sprout wiggle, and bouncy walk cycles running at retro frame rates (6–12 FPS) to preserve authentic retro feel.
- **Smooth UI Transitions:** 60 FPS CSS transitions (`cubic-bezier(0.34, 1.56, 0.64, 1)`) for UI panels, drawer slide-ins, and dialogue bubbles.
- **Respect User Accessibility:** Honor `prefers-reduced-motion` media queries by disabling camera shakes and continuous bouncing.

## 5. Anti-Patterns to Strictly Avoid
- ❌ **Generic AI SaaS Look:** No frosted glassmorphic gradient cards with purple/blue glowing borders.
- ❌ **Tiny Click Targets:** No microscopic text buttons that frustrate mobile users.
- ❌ **Pixel Blur:** Never render pixel sprites without `image-rendering: pixelated`.
- ❌ **Aggressive Micro-Transactions / Clutter:** No banner ads, floating coins, or spammy progress bars that distract from companion care.

