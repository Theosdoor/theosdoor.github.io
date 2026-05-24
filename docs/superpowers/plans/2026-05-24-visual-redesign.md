# Streamlined Scholar Visual Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Art Deco editorial redesign across all site routes using Tailwind CSS v4 semantic utilities, reusable Astro components, and a persistent accessible three-state theme control.

**Architecture:** Runtime light/dark values live in `tokens.css`; Tailwind v4 exposes them as semantic utilities through `@theme inline` in `global.css`. `Base.astro` resolves theme state before paint and renders one reusable `ThemeToggle.astro`, while presentational structure is composed from Astro components and Tailwind classes; bespoke CSS remains only for document backgrounds, animation primitives, CV sidebar state, and decorative pseudo-elements.

**Tech Stack:** Astro 6 static output, Tailwind CSS v4 via `@tailwindcss/vite`, TypeScript-capable Astro scripts, Node built-in test runner, pnpm.

---

## File Structure

| Path | Responsibility | Action |
| --- | --- | --- |
| `package.json` | Adds the lightweight structural test command | Modify |
| `tests/visual-redesign.test.mjs` | Verifies Tailwind theme wiring, theme behavior contract, and removal of legacy tokens | Create |
| `src/styles/tokens.css` | Runtime theme variables, reset, focus primitive, and temporary migration aliases removed at completion | Replace, then clean up |
| `src/styles/global.css` | Tailwind v4 entry point and semantic utility mapping; retains old stylesheet imports only during migration | Replace, then clean up |
| `src/styles/base.css` | Global document layout, grid background, motion behavior, decorative pseudo-elements | Modify after markup migration |
| `src/styles/home.css` | Superseded component styling | Delete after migration |
| `src/styles/projects.css` | Superseded component styling | Delete after migration |
| `src/styles/cv.css` | CV-only viewer layout, state selectors, and decorative pseudo-elements | Reduce and retain |
| `src/components/ThemeToggle.astro` | Three-state accessible theme control and client interaction | Create |
| `src/components/DecoDivider.astro` | Reusable decorative divider | Create |
| `src/components/Icon.astro` | Typed inline `currentColor` SVGs for themed UI icons | Create |
| `src/layouts/Base.astro` | Fonts, pre-paint theme resolution, global toggle | Modify |
| `src/components/Card.astro` | Framed link-card utility markup using typed icon names | Modify |
| `src/components/TabNav.astro` | Tab utility styling while retaining hash behavior | Modify |
| `src/components/Publications.astro` | Publication typography and rules | Modify |
| `src/components/Projects.astro` | Project controls/cards utility styling; retain filter/sort behavior | Modify |
| `src/pages/index.astro` | Home composition and upright identity heading | Modify |
| `src/pages/projects/index.astro` | Standalone project-page spacing | Modify |
| `src/pages/cv/index.astro` | CV composition and sidebar divider; retain persistence logic | Modify |
| `public/images/icons/{resume,linkedin,github,gscholar,globe,external-link}.svg` | Superseded external themed UI icon files | Delete after migration |

## Implementation Notes

- Do not change the YAML content schema, routes, tab hash mapping, project filter/sort semantics, Zcal script integration, PDF URL, or CV sidebar storage key.
- Use the existing `pnpm` workflow and the existing Tailwind Vite integration in `astro.config.mjs`; do not add a Tailwind configuration JavaScript file.
- Use `theme` as the local-storage key only for explicit `light` and `dark` overrides. Missing storage means System mode.
- Use Tailwind classes for the migrated visual surface. Keep CSS selectors only when they implement runtime tokens, pseudo-elements, keyframes, generated-script classes, or state/layout behavior that is clearer outside markup.
- Render themed monochrome UI icons through a typed inline SVG component using `currentColor`; do not retain CSS-filter colour transforms for icon `<img>` elements.
- Keep utility class names as complete literal strings in templates and client scripts. Do not construct Tailwind colour utilities from variables.

---

### Task 1: Establish The Tailwind V4 Semantic Theme

**Files:**
- Modify: `package.json`
- Create: `tests/visual-redesign.test.mjs`
- Replace: `src/styles/tokens.css`
- Replace: `src/styles/global.css`

- [ ] **Step 1: Add a Node test command and write the failing theme-foundation test**

Add this script to `package.json`:

```json
"test": "node --test tests/*.test.mjs"
```

Create `tests/visual-redesign.test.mjs`:

```js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('Tailwind v4 exposes semantic runtime theme utilities', async () => {
  const global = await read('src/styles/global.css');
  const tokens = await read('src/styles/tokens.css');

  assert.match(global, /@import "tailwindcss";/);
  assert.match(global, /@custom-variant dark/);
  assert.match(global, /@theme inline/);
  assert.match(global, /--color-canvas:\s*var\(--bg-primary\)/);
  assert.match(global, /--color-safety:\s*var\(--tag-safety\)/);

  assert.match(tokens, /html\[data-theme="dark"\]/);
  assert.match(tokens, /--focus-color:\s*#ad627d/);
  assert.match(tokens, /outline:\s*2px solid var\(--focus-color\)/);
});
```

- [ ] **Step 2: Run the test to verify it fails before the Tailwind theme exists**

Run:

```bash
pnpm test
```

Expected: `FAIL` because `global.css` does not yet import Tailwind or expose `@theme inline`.

- [ ] **Step 3: Replace the runtime tokens with semantic, theme-aware variables**

Replace `src/styles/tokens.css` with:

```css
:root {
  --font-heading: "Merriweather", Georgia, serif;
  --font-body: "Raleway", system-ui, -apple-system, sans-serif;
  --accent: #7d3c52;
  --accent-light: #ad627d;
  --accent-dark: #5c2838;
  --tag-safety: #246253;
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
  --tag-safety: #73c4af;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:focus-visible {
  outline: 2px solid var(--focus-color);
  outline-offset: 3px;
}

/* Temporary aliases keep unmigrated routes intact through Tasks 2-5. */
:root {
  --ink: var(--text-primary);
  --parchment: var(--bg-primary);
  --cream: var(--bg-secondary);
  --copper: var(--accent);
  --copper-light: var(--accent-light);
  --rule: var(--border);
  --mono: var(--font-body);
  --aisafety: var(--tag-safety);
}
```

- [ ] **Step 4: Turn `global.css` into the Tailwind v4 entry point**

Replace `src/styles/global.css` with:

```css
@import "tailwindcss";
@import "./tokens.css";
@import "./base.css";
@import "./home.css";
@import "./projects.css";

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
  --color-safety: var(--tag-safety);
  --ease-deco: var(--ease-smooth);
}
```

- [ ] **Step 5: Keep existing component imports during the migration**

Do not delete or detach `home.css`, `projects.css`, or the existing legacy-token references yet. The aliases above keep every unmigrated surface styled while later tasks convert markup route by route.

- [ ] **Step 6: Run foundation verification**

Run:

```bash
pnpm test
pnpm build
```

Expected: `PASS` for the theme-foundation test and a successful Astro static build; legacy CSS remains operational through the temporary aliases until Task 6.

- [ ] **Step 7: Commit the foundation**

```bash
rtk git add package.json tests/visual-redesign.test.mjs src/styles/tokens.css src/styles/global.css
rtk git commit -m "feat: establish Tailwind v4 visual theme"
```

---

### Task 2: Add Persistent Three-State Theme Control

**Files:**
- Create: `src/components/ThemeToggle.astro`
- Modify: `src/layouts/Base.astro`
- Modify: `tests/visual-redesign.test.mjs`

- [ ] **Step 1: Append failing tests for theme initialization and control behavior**

Append:

```js
test('Base initializes theme before render and mounts the global toggle', async () => {
  const base = await read('src/layouts/Base.astro');

  assert.match(base, /import ThemeToggle from '\.\.\/components\/ThemeToggle\.astro'/);
  assert.match(base, /localStorage\.getItem\('theme'\)/);
  assert.match(base, /prefers-color-scheme:\s*dark/);
  assert.match(base, /document\.documentElement\.dataset\.theme/);
  assert.match(base, /<ThemeToggle \/>/);
});

test('ThemeToggle supports system, light, and dark without storing system mode', async () => {
  const toggle = await read('src/components/ThemeToggle.astro');

  assert.match(toggle, /data-theme-toggle/);
  assert.match(toggle, /\['system', 'light', 'dark'\]/);
  assert.match(toggle, /localStorage\.removeItem\('theme'\)/);
  assert.match(toggle, /localStorage\.setItem\('theme', next\)/);
  assert.match(toggle, /Switch to \$\{next/);
  assert.doesNotMatch(toggle, /Click to/);
});
```

- [ ] **Step 2: Run the tests and verify the new behavior is absent**

Run:

```bash
pnpm test
```

Expected: `FAIL` because `ThemeToggle.astro` does not exist and `Base.astro` has no theme initializer.

- [ ] **Step 3: Create the Astro theme control**

Create `src/components/ThemeToggle.astro`:

```astro
<button
  type="button"
  data-theme-toggle
  class="fixed right-4 top-4 z-50 flex items-center gap-2 border border-rule bg-panel px-3 py-2 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-muted transition-colors hover:border-accent-strong hover:text-ink"
  aria-label="Theme: System. Switch to Light theme."
>
  <span aria-hidden="true">Theme</span>
  <span data-theme-label>System</span>
</button>

<script>
  const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  const label = button?.querySelector<HTMLElement>('[data-theme-label]');
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const modes = ['system', 'light', 'dark'] as const;
  type Mode = (typeof modes)[number];

  function storedMode(): Mode {
    try {
      const value = localStorage.getItem('theme');
      return value === 'light' || value === 'dark' ? value : 'system';
    } catch {
      return 'system';
    }
  }

  let activeMode: Mode = storedMode();

  function render(mode: Mode): void {
    activeMode = mode;
    const applied = mode === 'system' ? (media.matches ? 'dark' : 'light') : mode;
    document.documentElement.dataset.theme = applied;
    if (label) label.textContent = mode[0].toUpperCase() + mode.slice(1);
    const next = modes[(modes.indexOf(mode) + 1) % modes.length];
    button?.setAttribute(
      'aria-label',
      `Theme: ${mode[0].toUpperCase() + mode.slice(1)}. Switch to ${next[0].toUpperCase() + next.slice(1)} theme.`
    );
  }

  button?.addEventListener('click', () => {
    const next = modes[(modes.indexOf(activeMode) + 1) % modes.length];
    try {
      if (next === 'system') localStorage.removeItem('theme');
      else localStorage.setItem('theme', next);
    } catch {
      // Keep the control operational when storage is blocked.
    }
    render(next);
  });

  media.addEventListener('change', () => {
    if (activeMode === 'system') render('system');
  });

  render(activeMode);
</script>
```

- [ ] **Step 4: Initialize the chosen theme in the document head and render the toggle once**

In `src/layouts/Base.astro`, add:

```astro
---
import ThemeToggle from '../components/ThemeToggle.astro';
---
```

Replace the font stylesheet URL with the Merriweather/Raleway URL from the spec, and add this immediately before `</head>`:

```astro
<script is:inline>
  (() => {
    let theme;
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') theme = saved;
    } catch {}
    theme ||= window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
  })();
</script>
```

Add this as the first element inside `<body>`:

```astro
<ThemeToggle />
```

- [ ] **Step 5: Verify theme behavior compiles and tests pass**

Run:

```bash
pnpm test
pnpm build
```

Expected: all Node tests `PASS`; Astro builds with a single theme toggle rendered by the base layout.

- [ ] **Step 6: Commit the theme interaction**

```bash
rtk git add src/components/ThemeToggle.astro src/layouts/Base.astro tests/visual-redesign.test.mjs
rtk git commit -m "feat: add persistent theme toggle"
```

---

### Task 3: Create Reusable Deco Structure And Convert The Home Surface

**Files:**
- Create: `src/components/DecoDivider.astro`
- Create: `src/components/Icon.astro`
- Modify: `src/components/Card.astro`
- Modify: `src/components/TabNav.astro`
- Modify: `src/components/Publications.astro`
- Modify: `src/pages/index.astro`
- Modify: `tests/visual-redesign.test.mjs`

- [ ] **Step 1: Append failing component-structure tests**

Append:

```js
test('home UI is composed from DecoDivider and semantic Tailwind surfaces', async () => {
  const divider = await read('src/components/DecoDivider.astro');
  const icon = await read('src/components/Icon.astro');
  const card = await read('src/components/Card.astro');
  const publications = await read('src/components/Publications.astro');
  const index = await read('src/pages/index.astro');

  assert.match(divider, /aria-hidden="true"/);
  assert.match(divider, /border-accent/);
  assert.match(icon, /fill-current/);
  assert.match(icon, /aria-hidden="true"/);
  assert.match(icon, /'external-link'/);
  assert.match(icon, /fontawesome\.com\/license\/free/);
  assert.match(card, /import Icon/);
  assert.match(card, /<Icon name=\{icon\}/);
  assert.doesNotMatch(card, /images\/icons|<img/);
  assert.match(publications, /<Icon name="external-link"/);
  assert.match(card, /border-rule/);
  assert.match(card, /bg-panel/);
  assert.match(index, /import DecoDivider/);
  assert.match(index, /icon="resume"/);
  assert.doesNotMatch(index, /<em>Farrell<\/em>/);
});
```

- [ ] **Step 2: Run the new test and verify the legacy home markup fails it**

Run:

```bash
pnpm test
```

Expected: `FAIL` because there are no `DecoDivider.astro` or `Icon.astro` components and the name is still italic markup.

- [ ] **Step 3: Create the reusable divider**

Create `src/components/DecoDivider.astro`:

```astro
---
interface Props {
  class?: string;
}

const { class: className = '' } = Astro.props;
---

<div class:list={['flex items-center gap-3', className]} aria-hidden="true">
  <span class="h-px flex-1 bg-rule"></span>
  <span class="size-2 rotate-45 border border-accent bg-canvas"></span>
  <span class="h-px flex-1 bg-rule"></span>
</div>
```

- [ ] **Step 4: Create a typed inline SVG component for themed UI icons**

Create `src/components/Icon.astro`:

```astro
---
type IconName = 'resume' | 'linkedin' | 'github' | 'scholar' | 'website' | 'external-link';

interface Props {
  name: IconName;
  class?: string;
}

// Font Awesome Free v7.2.0 / v5.15.4 icon path definitions.
// License and attribution: https://fontawesome.com/license/free
const icons: Record<IconName, { viewBox: string; path: string }> = {
  resume: {
    viewBox: '0 0 384 512',
    path: 'M0 64C0 28.7 28.7 0 64 0L213.5 0c17 0 33.3 6.7 45.3 18.7L365.3 125.3c12 12 18.7 28.3 18.7 45.3L384 448c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm208-5.5l0 93.5c0 13.3 10.7 24 24 24L325.5 176 208 58.5zM120 256c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z',
  },
  linkedin: {
    viewBox: '0 0 448 512',
    path: 'M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm5 170.2l66.5 0 0 213.8-66.5 0 0-213.8zm71.7-67.7a38.5 38.5 0 1 1 -77 0 38.5 38.5 0 1 1 77 0zM317.9 416l0-104c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9l0 105.8-66.4 0 0-213.8 63.7 0 0 29.2 .9 0c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9l0 117.2-66.4 0z',
  },
  github: {
    viewBox: '0 0 512 512',
    path: 'M173.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM252.8 8c-138.7 0-244.8 105.3-244.8 244 0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1 100-33.2 167.8-128.1 167.8-239 0-138.7-112.5-244-251.2-244zM105.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9s4.3 3.3 5.6 2.3c1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z',
  },
  scholar: {
    viewBox: '0 0 512 512',
    path: 'M390.9 298.5s0 .1 .1 .1c9.2 19.4 14.4 41.1 14.4 64-.1 82.5-66.9 149.4-149.4 149.4S106.7 445.1 106.7 362.7c0-22.9 5.2-44.6 14.4-64 1.7-3.6 3.6-7.2 5.6-10.7 4.4-7.6 9.4-14.7 15-21.3 27.4-32.6 68.5-53.3 114.4-53.3 33.6 0 64.6 11.1 89.6 29.9 9.1 6.9 17.4 14.7 24.8 23.5 5.6 6.6 10.6 13.8 15 21.3 2 3.4 3.8 7 5.5 10.5l-.1-.1zm26.4-18.8c-30.1-58.4-91-98.4-161.3-98.4s-131.2 40-161.3 98.4l-94.7-77 256-202.7 256 202.7-94.7 77.1 0-.1z',
  },
  website: {
    viewBox: '0 0 512 512',
    path: 'M351.9 280l-190.9 0c2.9 64.5 17.2 123.9 37.5 167.4 11.4 24.5 23.7 41.8 35.1 52.4 11.2 10.5 18.9 12.2 22.9 12.2s11.7-1.7 22.9-12.2c11.4-10.6 23.7-28 35.1-52.4 20.3-43.5 34.6-102.9 37.5-167.4zM160.9 232l190.9 0C349 167.5 334.7 108.1 314.4 64.6 303 40.2 290.7 22.8 279.3 12.2 268.1 1.7 260.4 0 256.4 0s-11.7 1.7-22.9 12.2c-11.4 10.6-23.7 28-35.1 52.4-20.3 43.5-34.6 102.9-37.5 167.4zm-48 0C116.4 146.4 138.5 66.9 170.8 14.7 78.7 47.3 10.9 131.2 1.5 232l111.4 0zM1.5 280c9.4 100.8 77.2 184.7 169.3 217.3-32.3-52.2-54.4-131.7-57.9-217.3L1.5 280zm398.4 0c-3.5 85.6-25.6 165.1-57.9 217.3 92.1-32.7 159.9-116.5 169.3-217.3l-111.4 0zm111.4-48C501.9 131.2 434.1 47.3 342 14.7 374.3 66.9 396.4 146.4 399.9 232l111.4 0z',
  },
  'external-link': {
    viewBox: '0 0 512 512',
    path: 'M432 320H400a16 16 0 0 0-16 16V448H64V128H208a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16H48A48 48 0 0 0 0 112V464a48 48 0 0 0 48 48H400a48 48 0 0 0 48-48V336A16 16 0 0 0 432 320ZM488 0H360c-21.37 0-32.05 25.91-17 41l35.73 35.73L135 320.37a24 24 0 0 0 0 34L157.67 377a24 24 0 0 0 34 0L435.28 133.32 471 169c15 15 41 4.5 41-17V24A24 24 0 0 0 488 0Z',
  },
};

const { name, class: className = '' } = Astro.props;
const icon = icons[name];
---

<svg class:list={['shrink-0 fill-current', className]} viewBox={icon.viewBox} fill="currentColor" aria-hidden="true" focusable="false">
  <path d={icon.path} />
</svg>
```

- [ ] **Step 5: Convert `Card.astro` to use typed icon names and a Tailwind-framed surface**

Replace `src/components/Card.astro` with:

```astro
---
import Icon from './Icon.astro';

interface Props {
  href: string;
  icon: 'resume' | 'linkedin' | 'github' | 'scholar';
  title: string;
  sub: string;
  external?: boolean;
}

const { href, icon, title, sub, external = true } = Astro.props;
---

<a
  class="group flex items-center gap-4 border border-rule bg-panel px-5 py-4 text-ink transition duration-200 ease-deco hover:-translate-y-0.5 hover:border-accent focus-visible:border-accent"
  href={href}
  target={external ? '_blank' : undefined}
  rel={external ? 'noopener' : undefined}
>
  <span class="flex size-9 shrink-0 items-center justify-center text-subtle transition group-hover:text-accent">
    <Icon name={icon} class="size-6" />
  </span>
  <span class="flex flex-1 flex-col gap-1">
    <span class="font-serif text-lg font-bold text-ink">{title}</span>
    <span class="font-sans text-xs uppercase tracking-[0.16em] text-subtle">{sub}</span>
  </span>
  <span class="text-accent opacity-0 transition group-hover:opacity-100" aria-hidden="true">&#8594;</span>
</a>
```

- [ ] **Step 6: Migrate home composition to upright type, icon names, and semantic utilities**

In `src/pages/index.astro`, import `DecoDivider`, put layout classes directly on existing containers, and replace the identity heading/divider section with:

```astro
<header class="mb-12 animate-[fade-up_0.7s_var(--ease-smooth)_forwards]">
  <div class="deco-frame mb-6 size-36 border border-accent bg-panel p-1">
    <img class="size-full object-cover object-[80%_80%]" src="/images/theocool.jpeg" alt="Theo Farrell" width="140" height="140" fetchpriority="high" />
  </div>
  <p class="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.28em] text-accent-strong">Researcher &amp; organiser</p>
  <h1 class="mb-6 font-serif text-5xl font-black leading-tight text-ink sm:text-6xl">Theo<br />Farrell</h1>
  <DecoDivider class="mb-6 max-w-44" />
  <p class="font-sans text-sm leading-8 tracking-wide text-muted">
    MSci Natural Sciences (Computer Science &amp; Philosophy) at Durham University<br />
    AI safety researcher &amp; group organiser
  </p>
</header>
```

Apply the complete page shell classes without changing panel ids, roles, embed markup, or card props:

```astro
<a class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-accent focus:bg-panel focus:px-4 focus:py-2 focus:text-ink" href="#main">Skip to main content</a>

<main id="main" class="w-full px-5 py-16 sm:px-6" tabindex="-1">
  <TabNav />
  <div id="panel-home" role="tabpanel" aria-labelledby="tab-home">
    <div class="mx-auto w-full max-w-[560px]">
      <header class="mb-12 animate-[fade-up_0.7s_var(--ease-smooth)_forwards]">
        <div class="deco-frame mb-6 size-36 border border-accent bg-panel p-1">
          <img class="size-full object-cover object-[80%_80%]" src="/images/theocool.jpeg" alt="Theo Farrell" width="140" height="140" fetchpriority="high" />
        </div>
        <p class="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.28em] text-accent-strong">Researcher &amp; organiser</p>
        <h1 class="mb-6 font-serif text-5xl font-black leading-tight text-ink sm:text-6xl">Theo<br />Farrell</h1>
        <DecoDivider class="mb-6 max-w-44" />
        <p class="font-sans text-sm leading-8 tracking-wide text-muted">
          MSci Natural Sciences (Computer Science &amp; Philosophy) at Durham University<br />
          AI safety researcher &amp; group organiser
        </p>
      </header>
      <nav class="mb-12 flex flex-col gap-3" aria-label="Links">
        <Card href="/cv/" icon="resume" title="Curriculum Vitae" sub="View my full CV" external={false} />
        <Card href="https://www.linkedin.com/in/theofarrell/" icon="linkedin" title="LinkedIn" sub="Connect with me" />
        <Card href="https://github.com/Theosdoor" icon="github" title="GitHub" sub="Browse my code" />
        <Card href="https://scholar.google.com/citations?user=wbiptScAAAAJ" icon="scholar" title="Google Scholar" sub="Research &amp; publications" />
      </nav>
      <Publications />
      <footer class="mt-12 border-t border-rule pt-6">
        <p class="font-sans text-xs uppercase tracking-[0.16em] text-subtle">theo.farrell99 'at' outlook.com &middot; Manchester, UK &middot; 2026</p>
      </footer>
    </div>
  </div>
  <div id="panel-projects" role="tabpanel" aria-labelledby="tab-projects" hidden>
    <div class="mx-auto w-full max-w-[960px]"><Projects /></div>
  </div>
  <div id="panel-chat" role="tabpanel" aria-labelledby="tab-chat" hidden>
    <div class="mx-auto mb-8 w-full max-w-[560px]">
      <h2 class="mb-4 border-b border-rule pb-3 font-serif text-xl font-bold text-ink">Let's chat!</h2>
      <p class="font-sans text-sm leading-8 text-muted">Pick a time that works for you and I'll see you there.</p>
    </div>
    <div class="mx-auto w-full max-w-[900px] px-4">
      <script is:inline type="text/javascript" async src="https://static.zcal.co/embed/v1/embed.js"></script>
      <div class="zcal-inline-widget"><a href="https://zcal.co/i/pLX_Nnsl">30 Minute Meeting - Schedule a meeting</a></div>
    </div>
  </div>
</main>
```

- [ ] **Step 7: Migrate static tab and publication visual classes without altering scripts/data**

In `TabNav.astro`, use this class structure for buttons and retain the existing script unchanged:

```astro
<nav class="mx-auto mb-10 flex max-w-[560px] border-b border-rule" role="tablist" aria-label="Page sections">
  <button class="tab-btn tab-btn--active border-b-2 border-accent px-0 pb-3 pr-6 pt-2 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-accent" role="tab" aria-selected="true" aria-controls="panel-home" id="tab-home">Home</button>
  <button class="tab-btn border-b-2 border-transparent px-0 pb-3 pr-6 pt-2 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-subtle hover:text-ink" role="tab" aria-selected="false" aria-controls="panel-projects" id="tab-projects">Projects</button>
  <button class="tab-btn border-b-2 border-transparent px-0 pb-3 pt-2 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-subtle hover:text-ink" role="tab" aria-selected="false" aria-controls="panel-chat" id="tab-chat">Let's chat!</button>
</nav>
```

Update `activate()` so active tab state updates utility classes:

```ts
t.classList.toggle('border-accent', isActive);
t.classList.toggle('text-accent', isActive);
t.classList.toggle('border-transparent', !isActive);
t.classList.toggle('text-subtle', !isActive);
```

In `Publications.astro`, import `Icon` and assign semantic utility classes directly:

```astro
---
import Icon from './Icon.astro';
import pubsData from '../../content/pubs.yaml';

const owner: string = pubsData.owner;
const [ownerFirst, ...ownerRest] = owner.split(' ');
const ownerLast = ownerRest.at(-1) ?? '';

interface Pub {
  title: string;
  authors: string[];
  venue: string;
  year: number;
  url: string;
  link_label?: string;
}

const pubs: Pub[] = [...pubsData.publications].sort((a: Pub, b: Pub) => b.year - a.year);

function formatAuthors(authors: string[]): string {
  return authors
    .map((a) => {
      const isOwner =
        a === owner ||
        (a.includes(ownerFirst) && a.includes(ownerLast));
      return isOwner ? `<strong>${a}</strong>` : a;
    })
    .join(', ');
}
---

<section class="space-y-0" id="publications" aria-live="polite">
  <h2 class="mb-5 border-b border-rule pb-3 font-serif text-xl font-bold text-ink">Publications</h2>
  {pubs.map((pub) => (
    <article class="border-b border-rule py-6 last:border-0">
      <h3 class="mb-3 font-serif text-xl font-bold leading-snug text-ink">{pub.title}</h3>
      <p class="mb-2 font-sans text-sm leading-7 text-muted" set:html={formatAuthors(pub.authors)} />
      <p class="mb-3 font-sans text-sm text-accent">{pub.venue}</p>
      <a class="inline-flex items-center gap-2 border-b border-rule pb-1 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-ink hover:border-accent hover:text-accent" href={pub.url} target="_blank" rel="noopener">
        <Icon name="external-link" class="size-3" />
        {pub.link_label ?? 'View paper'}
      </a>
    </article>
  ))}
</section>
```

- [ ] **Step 8: Run component tests and build**

Run:

```bash
pnpm test
pnpm build
```

Expected: all current tests `PASS`; home and tab-panel routes compile with Tailwind utility classes.

- [ ] **Step 9: Commit the home/component migration**

```bash
rtk git add src/components/DecoDivider.astro src/components/Icon.astro src/components/Card.astro src/components/TabNav.astro src/components/Publications.astro src/pages/index.astro tests/visual-redesign.test.mjs
rtk git commit -m "feat: migrate home design to Astro and Tailwind"
```

---

### Task 4: Migrate Projects Presentation Without Changing Filtering Behavior

**Files:**
- Modify: `src/components/Projects.astro`
- Modify: `src/pages/projects/index.astro`
- Modify: `tests/visual-redesign.test.mjs`

- [ ] **Step 1: Append a failing project behavior-and-style regression test**

Append:

```js
test('projects retains data behavior hooks while using semantic utilities', async () => {
  const projects = await read('src/components/Projects.astro');

  assert.match(projects, /data-url-sync/);
  assert.match(projects, /setupPillGroup\('filter-role', 'role'\)/);
  assert.match(projects, /restoreFromUrl\(\)/);
  assert.match(projects, /bg-panel/);
  assert.match(projects, /border-rule/);
  assert.match(projects, /text-safety/);
  assert.match(projects, /classList\.toggle\('border-accent', active\)/);
  assert.doesNotMatch(projects, /(?:text|bg|border)-\$\{/);
});
```

- [ ] **Step 2: Run the test and verify presentation has not yet migrated**

Run:

```bash
pnpm test
```

Expected: `FAIL` on missing semantic utility class assertions.

- [ ] **Step 3: Replace project template classes with semantic Tailwind utilities**

Keep all `id`, `data-*`, accessibility attributes, and the existing `<script>` behavior. Apply these class lists to the corresponding existing elements:

```astro
<section class="space-y-6">
  <Heading class="mb-5 border-b border-rule pb-3 font-serif text-xl font-bold text-ink">Projects</Heading>
  <div class="relative mb-6">
    <div class="flex flex-wrap gap-4">
      <button class="proj-filter-btn border-b border-rule pb-1 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-muted hover:border-accent hover:text-accent">Filter &#9662;</button>
      <button class="proj-sort-btn border-b border-rule pb-1 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-muted hover:border-accent hover:text-accent">Sort &#9662;</button>
      <input class="proj-search min-w-40 border-b border-rule bg-transparent pb-1 font-sans text-xs tracking-wider text-ink placeholder:text-subtle focus:border-accent" />
    </div>
  </div>
</section>
```

Use these exact semantic class values on the corresponding existing dropdowns, controls, and cards, retaining their existing children and attributes:

```text
Dropdown: proj-dropdown absolute z-20 mt-3 min-w-72 border border-rule bg-panel p-4 text-ink
Pill: proj-pill border border-rule px-3 py-1 font-sans text-xs uppercase tracking-wider text-muted hover:border-accent hover:text-ink
Active pill/chip additions: border-accent text-accent
List: proj-list grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(min(260px,100%),1fr))]
Card: proj-card proj group flex flex-col border border-rule bg-panel text-ink transition hover:-translate-y-0.5 hover:border-accent
AI badge: border border-safety px-2 py-1 font-sans text-[0.65rem] font-semibold uppercase tracking-wider text-safety
Project title: font-serif text-lg font-bold text-ink
Description/meta: font-sans text-sm leading-6 text-muted
Role/category chip: border border-accent px-2 py-1 font-sans text-[0.65rem] uppercase tracking-wider text-accent
Language/tool tag: border border-rule px-2 py-1 font-sans text-[0.65rem] uppercase tracking-wider text-subtle
```

- [ ] **Step 4: Ensure script-generated headings use the same utility design vocabulary**

Replace `makeHeading()` class construction with:

```ts
function makeHeading(text: string, type: 'featured' | 'year' = 'year') {
  const div = document.createElement('div');
  div.className = 'proj-group-heading col-span-full border-t border-rule pt-6 font-serif text-2xl font-bold text-ink';
  div.dataset.groupType = type;
  div.textContent = text;
  return div;
}
```

Add this helper immediately above `restoreFromUrl()`:

```ts
function setActiveStyle(el: Element, active: boolean) {
  el.classList.toggle('border-accent', active);
  el.classList.toggle('text-accent', active);
  el.classList.toggle('border-rule', !active);
  el.classList.toggle('text-muted', !active);
}
```

In each existing callback that currently toggles `proj-pill--active` or `proj-tag-chip--active`, retain that behavior class toggle and call `setActiveStyle(b, active)` using the same Boolean expression. This applies to URL restoration, single-select pills, multi-select chips, and the filter-active indicator, so direct navigation and pointer interaction produce identical styled states.

- [ ] **Step 5: Apply standalone page spacing**

In `src/pages/projects/index.astro`, update the wrapper:

```astro
<div class="mx-auto w-full max-w-[960px] px-5 py-16 sm:px-8" id="main" tabindex="-1">
  <Projects urlSync={true} headingLevel="h1" />
</div>
```

- [ ] **Step 6: Verify tests and build**

Run:

```bash
pnpm test
pnpm build
```

Expected: tests `PASS`; both homepage projects panel and `/projects/` build with existing filtering behavior hooks unchanged.

- [ ] **Step 7: Commit the projects migration**

```bash
rtk git add src/components/Projects.astro src/pages/projects/index.astro tests/visual-redesign.test.mjs
rtk git commit -m "feat: migrate projects surface to Tailwind theme"
```

---

### Task 5: Harmonize The CV Route While Preserving Viewer State

**Files:**
- Modify: `src/pages/cv/index.astro`
- Replace: `src/styles/cv.css`
- Use: `src/components/Icon.astro`
- Modify: `tests/visual-redesign.test.mjs`

- [ ] **Step 1: Append failing CV state-preservation tests**

Append:

```js
test('CV composes the redesigned shell and retains sidebar persistence', async () => {
  const cvPage = await read('src/pages/cv/index.astro');
  const cvCss = await read('src/styles/cv.css');

  assert.match(cvPage, /import DecoDivider/);
  assert.match(cvPage, /import Icon/);
  assert.match(cvPage, /localStorage\.getItem\('sidebarHidden'\)/);
  assert.match(cvPage, /localStorage\.setItem\('sidebarHidden'/);
  assert.match(cvPage, /TheoFarrell_CV\.pdf/);
  assert.doesNotMatch(cvPage, /<em>Farrell<\/em>/);
  assert.match(cvPage, /<Icon name="linkedin"/);
  assert.doesNotMatch(cvPage, /images\/icons|<img class="size-4/);
  assert.match(cvCss, /@import "\.\/global\.css";/);
  assert.doesNotMatch(cvCss, /--copper|--parchment|--ink/);
});
```

- [ ] **Step 2: Run the tests and verify the legacy CV style fails**

Run:

```bash
pnpm test
```

Expected: `FAIL` because the CV route still uses legacy italic/token styling and does not compose `DecoDivider`.

- [ ] **Step 3: Convert CV markup while retaining the existing sidebar and iframe scripts**

Import both shared components in `src/pages/cv/index.astro`:

```astro
---
import Base from '../../layouts/Base.astro';
import DecoDivider from '../../components/DecoDivider.astro';
import Icon from '../../components/Icon.astro';
import '../../styles/cv.css';
---
```

Keep all `sidebarHidden` initialization and click-handler code unchanged. Replace the sidebar markup with:

```astro
<aside class="deco-frame cv-sidebar relative flex h-screen w-[260px] shrink-0 flex-col overflow-hidden border-r border-rule bg-panel p-8">
  <div>
    <p class="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.24em] text-accent-strong">Curriculum Vitae</p>
    <h1 class="font-serif text-3xl font-black leading-tight text-ink">Theo<br />Farrell</h1>
    <DecoDivider class="my-7 max-w-36" />
    <div class="space-y-3 font-sans text-sm leading-7 text-muted">
      <p><span class="block text-xs font-semibold uppercase tracking-wider text-subtle">Location</span>Manchester, UK</p>
      <p><span class="block text-xs font-semibold uppercase tracking-wider text-subtle">Phone</span>(+44) 7596 102384</p>
      <p>
        <span class="block text-xs font-semibold uppercase tracking-wider text-subtle">Email</span>
        <a class="border-b border-rule hover:border-accent hover:text-accent" href="mailto:theo.farrell99@outlook.com">theo.farrell99 'at' outlook.com</a>
      </p>
    </div>
    <div class="mt-7 flex gap-4">
      <a class="text-muted hover:text-accent" href="https://www.linkedin.com/in/theofarrell/" target="_blank" rel="noopener" aria-label="LinkedIn">
        <Icon name="linkedin" class="size-4" />
      </a>
      <a class="text-muted hover:text-accent" href="https://github.com/Theosdoor" target="_blank" rel="noopener" aria-label="GitHub">
        <Icon name="github" class="size-4" />
      </a>
      <a class="text-muted hover:text-accent" href="https://scholar.google.com/citations?hl=en&user=wbiptScAAAAJ" target="_blank" rel="noopener" aria-label="Google Scholar">
        <Icon name="scholar" class="size-4" />
      </a>
      <a class="text-muted hover:text-accent" href="https://theosdoor.github.io" target="_blank" rel="noopener" aria-label="Website">
        <Icon name="website" class="size-4" />
      </a>
    </div>
  </div>
  <div class="mt-auto">
    <a class="inline-flex items-center gap-2 border border-accent bg-accent px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wider text-white hover:bg-accent-strong" href="/cv/TheoFarrell_CV.pdf" download>
      <span aria-hidden="true">&#8595;</span>
      Download PDF
    </a>
    <p class="mt-4 font-sans text-xs tracking-wide text-subtle">Built from LaTeX source &middot; auto-deployed</p>
  </div>
</aside>
```

Replace the sidebar toggle and main viewer markup with:

```astro
<button class="sidebar-toggle fixed z-20 flex h-14 w-6 items-center justify-center border border-rule bg-panel text-accent" id="sidebarToggle" aria-label="Collapse sidebar" aria-expanded="true">
  <svg class="chevron" viewBox="0 0 6 10" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <polyline points="5,1 1,5 5,9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</button>

<main class="flex h-screen min-w-0 flex-1 flex-col">
  <div class="top-bar items-center border-b border-rule bg-panel px-4 py-3">
    <div class="flex flex-1 items-center gap-3">
      <span class="font-serif text-lg font-bold text-ink">Theo Farrell</span>
      <a class="ml-auto border border-accent px-3 py-2 font-sans text-xs font-semibold uppercase tracking-wider text-accent" href="/cv/TheoFarrell_CV.pdf" download>&#8595; PDF</a>
    </div>
  </div>
  <iframe class="flex-1 bg-canvas" src="/cv/TheoFarrell_CV.pdf" title="Theo Farrell - Curriculum Vitae"></iframe>
</main>
```

- [ ] **Step 4: Replace `cv.css` with state/layout CSS only**

Replace `src/styles/cv.css` with:

```css
@import "./global.css";

:root {
  --sidebar-w: 260px;
}

html,
body {
  height: 100%;
}

body {
  display: flex;
  flex-direction: row;
  overflow: hidden;
}

.cv-sidebar,
.sidebar-toggle {
  transition:
    width 0.45s var(--ease-smooth),
    min-width 0.45s var(--ease-smooth),
    padding 0.45s var(--ease-smooth),
    left 0.45s var(--ease-smooth);
}

.sidebar-toggle {
  left: var(--sidebar-w);
  top: 50%;
  transform: translateY(-50%);
}

body.sidebar-hidden .cv-sidebar,
html.sidebar-hidden-init .cv-sidebar {
  width: 0;
  min-width: 0;
  padding: 0;
  border-width: 0;
}

body.sidebar-hidden .sidebar-toggle,
html.sidebar-hidden-init .sidebar-toggle {
  left: 0;
}

body.sidebar-hidden .sidebar-toggle .chevron {
  transform: rotate(180deg);
}

.top-bar {
  display: none;
}

@media (max-width: 700px) {
  body {
    flex-direction: column;
    overflow: auto;
  }

  .cv-sidebar,
  .sidebar-toggle {
    display: none;
  }

  .top-bar {
    display: flex;
  }
}
```

- [ ] **Step 5: Verify the CV route builds and retains its state hooks**

Run:

```bash
pnpm test
pnpm build
```

Expected: tests `PASS`; `/cv/` builds with `sidebarHidden` storage and the PDF iframe path intact.

- [ ] **Step 6: Commit the CV migration**

```bash
rtk git add src/pages/cv/index.astro src/styles/cv.css tests/visual-redesign.test.mjs
rtk git commit -m "feat: theme the CV viewer shell"
```

---

### Task 6: Remove Superseded CSS And Verify The Complete Redesign

**Files:**
- Delete: `src/styles/home.css`
- Delete: `src/styles/projects.css`
- Delete: `public/images/icons/resume.svg`
- Delete: `public/images/icons/linkedin.svg`
- Delete: `public/images/icons/github.svg`
- Delete: `public/images/icons/gscholar.svg`
- Delete: `public/images/icons/globe.svg`
- Delete: `public/images/icons/external-link.svg`
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/global.css`
- Replace: `src/styles/base.css`
- Modify: `tests/visual-redesign.test.mjs`

- [ ] **Step 1: Append the failing legacy-removal test**

Append:

```js
test('legacy palette and superseded component styles are removed', async () => {
  const sourceFiles = [
    'src/styles/tokens.css',
    'src/styles/global.css',
    'src/styles/base.css',
    'src/styles/cv.css',
    'src/pages/index.astro',
    'src/pages/projects/index.astro',
    'src/pages/cv/index.astro',
    'src/components/Card.astro',
    'src/components/Icon.astro',
    'src/components/TabNav.astro',
    'src/components/Publications.astro',
    'src/components/Projects.astro',
  ];
  const source = (await Promise.all(sourceFiles.map(read))).join('\n');

  assert.doesNotMatch(source, /--(?:ink|parchment|cream|copper|copper-light|rule|mono|aisafety)\b/);
  assert.doesNotMatch(source, /images\/icons|filter:/);
  assert.doesNotMatch(source, /(?:text|bg|border)-\$\{/);
  await assert.rejects(read('src/styles/home.css'));
  await assert.rejects(read('src/styles/projects.css'));
  await assert.rejects(read('public/images/icons/resume.svg'));
  await assert.rejects(read('public/images/icons/linkedin.svg'));
  await assert.rejects(read('public/images/icons/github.svg'));
  await assert.rejects(read('public/images/icons/gscholar.svg'));
  await assert.rejects(read('public/images/icons/globe.svg'));
  await assert.rejects(read('public/images/icons/external-link.svg'));
});
```

- [ ] **Step 2: Run the test and verify the old component styles still exist**

Run:

```bash
pnpm test
```

Expected: `FAIL` because `home.css` and `projects.css` still exist.

- [ ] **Step 3: Delete superseded CSS and remove migration-only aliases/imports**

Delete:

```text
src/styles/home.css
src/styles/projects.css
public/images/icons/resume.svg
public/images/icons/linkedin.svg
public/images/icons/github.svg
public/images/icons/gscholar.svg
public/images/icons/globe.svg
public/images/icons/external-link.svg
```

Remove the temporary alias block from `src/styles/tokens.css` that defines `--ink`, `--parchment`, `--cream`, `--copper`, `--copper-light`, `--rule`, `--mono`, and `--aisafety`.

Replace `src/styles/global.css` with the final entry point:

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
  --color-safety: var(--tag-safety);
  --ease-deco: var(--ease-smooth);
}
```

- [ ] **Step 4: Replace global base styling with semantic behavior and shared frame accents**

Replace `src/styles/base.css` with:

```css
html {
  font-size: 18px;
}

body {
  font-family: var(--font-body);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  background-image:
    linear-gradient(var(--grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid) 1px, transparent 1px);
  background-size: 28px 28px;
}

.deco-frame::before,
.deco-frame::after {
  content: "";
  position: absolute;
  pointer-events: none;
  border: 1px solid var(--border);
}

.deco-frame::before {
  inset: 6px -6px -6px 6px;
}

.deco-frame::after {
  inset: -6px 6px 6px -6px;
}

.cv-sidebar.deco-frame::before {
  inset: 12px;
}

.cv-sidebar.deco-frame::after {
  display: none;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-delay: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

@media (max-width: 600px) {
  html { font-size: 17px; }
}

@media (max-width: 380px) {
  html { font-size: 16px; }

  .deco-frame::before,
  .deco-frame::after {
    display: none;
  }
}
```

- [ ] **Step 5: Run structural tests, legacy-token scan, and production build**

Run:

```bash
pnpm test
rg -- '--(ink|parchment|cream|copper|copper-light|rule|mono|aisafety)' src
rg 'images/icons|filter:|text-\$\{|bg-\$\{|border-\$\{' src
pnpm build
```

Expected: tests `PASS`; both `rg` commands exit with no matches; Astro static build succeeds.

- [ ] **Step 6: Start the dev server for browser verification**

Run:

```bash
pnpm dev
```

Expected: Astro reports a local URL, normally `http://localhost:4321/`.

- [ ] **Step 7: Inspect interactive and responsive behavior in the browser**

Open `/`, `/#projects`, `/#chat`, `/projects/`, and `/cv/` and verify:

```text
Theme states: System -> Light -> Dark -> System changes visibly and persists/removes override after reload.
System updates: system preference changes affect the page only while System is selected.
Keyboard: theme toggle, tabs, cards, filters, search, CV toggle, and download link all show a visible focus outline in both themes.
Typography: all display and section headings are upright Merriweather.
Project behavior: filter, sort, search, and /projects/ query synchronization still work.
Embeds: Zcal and the PDF viewer remain usable; only surrounding chrome is required to match theme.
Icons: card, publication, and CV social icons inherit link/accent colour in Light and Dark modes without filter artifacts.
Responsive: no overlap or clipping at widths 320px, 375px, 600px, and desktop.
```

- [ ] **Step 8: Stop the dev server and commit final cleanup**

```bash
rtk git add src/styles/home.css src/styles/projects.css src/styles/tokens.css src/styles/global.css src/styles/base.css public/images/icons/resume.svg public/images/icons/linkedin.svg public/images/icons/github.svg public/images/icons/gscholar.svg public/images/icons/globe.svg public/images/icons/external-link.svg tests/visual-redesign.test.mjs
rtk git commit -m "refactor: remove legacy visual styles"
```

---

## Completion Criteria

- The build produces `/`, `/projects/`, and `/cv/` successfully.
- Tailwind v4 is used through `@import "tailwindcss"` and semantic `@theme inline` utility mapping.
- Light, Dark, and System theme modes are keyboard-accessible, persisted correctly, and resolve before first paint.
- The theme control visibly reports its current mode and exposes its next action in an action-neutral accessible label.
- The themed UI icon set renders through typed inline `currentColor` SVGs rather than filtered external image files.
- Tailwind colour utility classes are literal and statically discoverable in templates and interaction scripts.
- Existing interactive behaviors remain intact: tab hashes, project filtering/sorting/query sync, CV sidebar state, Zcal embed, and PDF viewer.
- All copper-era token references and superseded component styles are removed.
- Manual browser checks pass in both themes and the specified mobile/desktop widths.
