# Visual Redesign: Streamlined Scholar

## Summary

The site will adopt an Art Deco editorial visual system: upright scholarly headings, geometric framing, thin rules, and a warm maroon/plum light and dark palette. The implementation will be built around **Tailwind CSS v4's CSS-first theme configuration** and **small, reusable Astro components**, instead of expanding the existing route-level CSS files into a second hand-authored design system.

The redesign covers all current site routes:

- `/` with Home, Projects, and Let's chat panels
- `/projects/`
- `/cv/`

The Zcal booking widget and browser PDF viewer are externally rendered surfaces. Their surrounding page chrome will be themed; their internal rendering is not required to match the selected theme.

---

## Design Direction

### Typography

- **Headings:** Merriweather, upright Roman weights only (`700` or `900`). Names, page headings, section headings, and project group headings must not use italics.
- **Body and UI:** Raleway, using readable text weights and geometric uppercase labels selectively.
- **Code-style metadata:** Use Raleway for this site rather than introducing a third typeface; do not describe it as monospace.

Load the fonts once in `src/layouts/Base.astro`:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&family=Raleway:wght@300;400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

### Geometric Motifs

Use three repeated motifs, each implemented once and reused:

1. **Flat framed surfaces:** one-pixel borders, square corners, restrained hover translation, and no decorative drop shadows.
2. **Diamond divider:** two rules with a centered rotated diamond for identity and section transitions.
3. **Frame accents:** subtle corner or double-rule accents on the primary identity surface and the CV sidebar only. These must not reduce mobile content width or overlap interactive controls.

---

## Architecture

### Tailwind v4 Design System

Tailwind v4 is already connected through `@tailwindcss/vite` in `astro.config.mjs`. The redesign must activate it in the stylesheet entry point and use it for the visual system.

`src/styles/global.css` is the Tailwind entry point for the homepage and projects page:

```css
@import "tailwindcss";
@import "./tokens.css";
@import "./base.css";

@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

@theme inline {
  --font-serif: var(--font-heading);
  --font-sans: var(--font-body);
  --color-canvas: var(--bg-primary);
  --color-panel: var(--bg-secondary);
  --color-ink: var(--text-primary);
  --color-muted: var(--text-secondary);
  --color-subtle: var(--text-muted);
  --color-rule: var(--border);
  --color-accent: var(--accent);
  --color-accent-strong: var(--accent-light);
  --ease-deco: var(--ease-smooth);
}
```

`src/styles/cv.css` may continue to be imported separately by the CV route, but it must import the shared Tailwind/theme entry rather than maintain an independent colour vocabulary:

```css
@import "./global.css";
```

The existing stylesheet responsibilities change as follows:

| File | Responsibility after redesign |
| --- | --- |
| `src/styles/tokens.css` | Runtime light/dark CSS variables only, plus reset and focus-ring primitives |
| `src/styles/global.css` | Tailwind import, custom dark variant, `@theme inline` mapping, shared imports |
| `src/styles/base.css` | Only document-wide behavior not cleanly expressed in component markup: grid background, reduced motion, page transition keyframes, and shared decorative pseudo-elements |
| `src/styles/home.css` | Remove after markup migration; home visual styling belongs in Astro component utility classes |
| `src/styles/projects.css` | Remove after markup migration; project visual styling belongs in `Projects.astro` utilities |
| `src/styles/cv.css` | Keep only CV layout/state selectors that support sidebar collapse, viewer sizing, and pseudo-element frame details |

### Semantic Runtime Tokens

Theme-changing values live as normal CSS variables so they update immediately when `data-theme` changes. Tailwind utilities refer to them through `@theme inline`.

```css
:root {
  --font-heading: "Merriweather", Georgia, serif;
  --font-body: "Raleway", system-ui, -apple-system, sans-serif;
  --accent: #7d3c52;
  --accent-light: #ad627d;
  --accent-dark: #5c2838;
  --ease-smooth: cubic-bezier(0.22, 1, 0.36, 1);
  --focus-color: #7d3c52;

  --bg-primary: #faf8f9;
  --bg-secondary: #ffffff;
  --border: rgba(125, 60, 82, 0.2);
  --text-primary: #1d171b;
  --text-secondary: #5a4b52;
  --text-muted: #82727a;
  --grid: rgba(125, 60, 82, 0.035);
}

html[data-theme="dark"] {
  --bg-primary: #120f11;
  --bg-secondary: #1a1518;
  --border: rgba(173, 98, 125, 0.34);
  --text-primary: #f5f2f4;
  --text-secondary: #cdbec5;
  --text-muted: #aea2a8;
  --grid: rgba(173, 98, 125, 0.06);
  --focus-color: #ad627d;
}

:focus-visible {
  outline: 2px solid var(--focus-color);
  outline-offset: 3px;
}
```

`#ad627d` has a contrast ratio of approximately `4.37:1` against the dark background `#120f11`, exceeding the `3:1` non-text contrast requirement for focus indication.

### Token Migration

The redesign must not leave components referencing removed copper-era tokens. Existing usage of `--ink`, `--parchment`, `--cream`, `--copper`, `--copper-light`, `--rule`, `--mono`, and `--aisafety` must be removed as affected markup moves to Tailwind utilities.

The AI Safety badge remains semantically distinct. Add an accessible theme-aware token mapping rather than reusing the maroon accent:

```css
:root {
  --tag-safety: #246253;
}

html[data-theme="dark"] {
  --tag-safety: #73c4af;
}

@theme inline {
  --color-safety: var(--tag-safety);
}
```

---

## Astro Component Structure

### New Components

#### `src/components/ThemeToggle.astro`

- Renders the global theme control once from `Base.astro`.
- Uses a button with an accessible label that reflects the next action.
- Its client-side script cycles `system -> light -> dark -> system`.
- A manual selection stores `theme=light` or `theme=dark` in `localStorage`; system mode removes the key.
- Displays current state text (`System`, `Light`, or `Dark`) so the three-state behavior is discoverable.

#### `src/components/DecoDivider.astro`

- Renders the rule/diamond/rule motif with decorative elements hidden from assistive technology.
- Accepts an optional class string only for layout spacing.
- Used in the home identity block and CV sidebar.

#### `src/components/Icon.astro`

- Renders the finite themed UI icon set (`resume`, `linkedin`, `github`, `scholar`, `website`, and `external-link`) as inline SVGs using `fill="currentColor"`.
- Accepts a typed icon name and a class string for sizing only; colour is inherited from the surrounding link or card state.
- Renders as decorative (`aria-hidden="true"`) because accessible names are owned by the containing link/card.
- Replaces CSS-filter colouring of external `<img>` icon assets; content imagery, portrait imagery, and project media remain file-backed assets.
- Retains the existing Font Awesome Free attribution/license notice beside the inlined path definitions if the superseded public SVG icon files are removed.

### Existing Components

- `src/layouts/Base.astro`: owns document fonts, the pre-paint theme initialization script, and one `ThemeToggle` instance for every route.
- `src/components/Card.astro`: accepts a typed `IconName` and uses `Icon.astro` plus Tailwind utilities for the shared framed link surface.
- `src/components/TabNav.astro`: keeps its existing vanilla tab logic and changes visual classes to Tailwind utility/state classes.
- `src/components/Publications.astro`: uses semantic utilities for publication typography and rules, plus `Icon.astro` for the external-link indicator.
- `src/components/Projects.astro`: keeps filtering and sorting behavior unchanged while moving its visual vocabulary to semantic Tailwind utilities.
- `src/pages/index.astro`: arranges page sections and removes heading italics and repeated decorative markup.
- `src/pages/cv/index.astro`: retains sidebar persistence and PDF viewer structure; composes `DecoDivider`, `Icon`, and Tailwind utilities with minimal CV state CSS.

---

## Theme Behavior

### Theme Resolution

Before first paint, an inline script in the document `<head>` resolves the theme:

1. Read `localStorage.getItem("theme")`.
2. If it is `light` or `dark`, set `document.documentElement.dataset.theme` to that value.
3. Otherwise, apply `dark` when `matchMedia("(prefers-color-scheme: dark)")` matches, and `light` otherwise.

The script must guard `localStorage` access so pages still render when storage is unavailable.

### Toggle Interaction

- **System mode:** no stored override; respond to changes in `prefers-color-scheme` while the page is open.
- **Light mode:** persist `theme=light`; ignore system changes.
- **Dark mode:** persist `theme=dark`; ignore system changes.
- The button displays its current mode as visible text and exposes the next action through an accessible name, for example: `Theme: System. Switch to Light theme.`
- Use action-neutral language such as `Switch`, not pointer-specific language such as `Click`, because the control must be usable by keyboard and assistive technology.
- The button is keyboard operable, has a visible focus ring in both themes, and updates its label/state text after each activation.

Theme storage is independent from the existing `sidebarHidden` setting used by the CV page.

---

## Page-Level Requirements

### Home And Tab Panels

- Render all display-name and section-heading text in upright Merriweather.
- Replace the current copper hover/shadow vocabulary with framed panel surfaces and accent rule movement.
- Keep tab URL hash behavior and browser back/forward behavior unchanged.
- Apply the theme to the shell surrounding the Zcal widget only; do not assume control of iframe/widget internals.

### Projects

- Keep existing filtering, sort, URL synchronization, media handling, and empty state behavior unchanged.
- Use semantic utility classes for cards, dropdowns, pills, tags, inputs, and generated group headings.
- Script-generated group headings must receive the same design-system class list as statically rendered headings.

### CV

- Keep sidebar expand/collapse state persistence and PDF rendering unchanged.
- Theme sidebar, mobile header, controls, and viewer background.
- Do not claim that browser-rendered PDF content changes theme.

---

## Accessibility And Quality Requirements

- All interactive controls retain visible `:focus-visible` styles with at least `3:1` contrast against adjacent backgrounds.
- Text colours meet WCAG AA contrast for their intended sizes in both themes.
- Decorative diamonds/frame accents are marked `aria-hidden="true"` or implemented as pseudo-elements.
- Decorative themed SVG icons are rendered through `Icon.astro` with `currentColor` and `aria-hidden="true"`; their parent controls provide the accessible names.
- Tailwind classes used for templates or scripted state changes must be complete literal class names (`text-safety`, `border-accent`, `bg-panel`); do not build utility names dynamically such as ``text-${variant}``.
- Respect `prefers-reduced-motion` for hover movement and entrance animations.
- Theme initialization does not cause visible light/dark flashing during initial page render.
- Mobile inspection includes `320px`, `375px`, and `600px` widths; decorative frames must not clip content or controls.

---

## Verification Plan

### Automated

Run:

```bash
pnpm build
```

Expected result: Astro produces all static routes without errors.

Search for obsolete palette references:

```bash
rg -- '--(ink|parchment|cream|copper|copper-light|rule|mono|aisafety)' src
```

Expected result: no matches after the migration is complete.

Search for deprecated themed icon/filter treatment and dynamic utility construction:

```bash
rg 'images/icons|filter:|text-\$\{|bg-\$\{|border-\$\{' src
```

Expected result: no themed UI icon asset references, CSS filter colouring, or dynamically constructed Tailwind colour utilities remain in `src`.

### Browser Verification

Run:

```bash
pnpm dev
```

Inspect `/`, `/#projects`, `/#chat`, `/projects/`, and `/cv/`:

- Verify first-paint theme resolution for system, persisted light, and persisted dark states.
- Cycle the toggle through System, Light, Dark, and back to System; reload between states.
- Change the operating-system colour preference while in System mode and while an override is set.
- Keyboard-tab through theme toggle, tab navigation, link cards, project controls, project cards, CV sidebar toggle, and download controls in both themes.
- Confirm link, social, and external-link icons inherit the surrounding text/accent state in both themes without image filters.
- Confirm upright Merriweather headings and aligned geometric dividers.
- Confirm the Zcal and PDF embedded surfaces remain usable even when their internal colours do not match the site chrome.
- Inspect the mobile widths listed above and a desktop layout.
