# Visual Redesign: The "Streamlined Scholar" (Art Deco Editorial)

A comprehensive visual redesign of Theo Farrell's personal website. This design combines the warm scholarly aesthetic of Option A (The Scientific Humanist) with the bold, high-contrast, atmospheric qualities of Option C (The Philosophy Portal) using a simplified **Art Deco** styling language that emphasizes clean geometry, symmetry, and architectural simplicity.

---

## User Review Required

> [!NOTE]
> The design supports a **fully persistent Light/Dark theme toggle** that respects the visitor's system preferences (`prefers-color-scheme`) by default but allows a manual override saved in `localStorage`.

---

## Technical Specifications

### 1. Typography System

The site's font pairing is fully updated to prioritize legibility, academic elegance, and clean geometry:
*   **Headings:** **Merriweather** (loaded from Google Fonts). Styled exclusively in **upright (Roman) bold or black weights**. All italicization in headings is removed to establish a strong, structural presence.
*   **Body & UI Text:** **Raleway** (loaded from Google Fonts). A crisp, geometric sans-serif that fits the streamlined Art Deco feel perfectly.

#### Google Fonts Import URL
```html
https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&family=Raleway:wght@300;400;500;600;700&display=swap"
```

---

### 2. The Maroon & Indigo Color System

We are completely replacing the existing copper palette with a custom-engineered **warm maroon, deep slate-indigo, and soft slate-mauve** system. The background colors incorporate subtle tones (rather than absolute greys/blacks) to create an extremely premium, bespoke feeling.

#### CSS Variables (`src/styles/tokens.css`)

```css
:root {
  /* Fonts */
  --serif: 'Merriweather', Georgia, serif;
  --sans: 'Raleway', system-ui, -apple-system, sans-serif;
  --mono: 'Raleway', monospace; /* Kept for compatibility, styled geometric */
  
  /* Shared Colors */
  --accent: #7d3c52;        /* Gentle Warm Maroon */
  --accent-light: #9e536e;  /* Soft Plum highlight */
  --accent-dark: #5c2838;   /* Deep Wine shadow */
  
  /* Focus Indicator */
  --focus-ring: 2px solid var(--accent);
  --focus-offset: 3px;
  
  /* Transitions */
  --transition-smooth: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Light Theme (Alabaster Mauve) */
:root,
html[data-theme="light"] {
  --bg-primary: #FAF8F9;      /* Alabaster background (mauve undertone) */
  --bg-secondary: #ffffff;    /* Card & panel backgrounds */
  --border: rgba(125, 60, 82, 0.15); /* Soft maroon line borders */
  --text-primary: #1d171b;    /* Warm obsidian charcoal text */
  --text-secondary: #5a4b52;  /* Muted dark plum text */
  --text-muted: #82727a;      /* Soft lavender slate */
  --grid: rgba(125, 60, 82, 0.035); /* Geometric background grid */
}

/* Dark Theme (Obsidian Plum) */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #120f11;    /* Obsidian plum dark background */
    --bg-secondary: #1a1518;  /* Elevated panel backgrounds */
    --border: rgba(125, 60, 82, 0.25);
    --text-primary: #f5f2f4;  /* Crisp lavender-white text */
    --text-secondary: #cdbec5;/* Soft lavender slate text */
    --text-muted: #aea2a8;    /* Muted plum grey */
    --grid: rgba(125, 60, 82, 0.05);
  }
}

html[data-theme="dark"] {
  --bg-primary: #120f11;
  --bg-secondary: #1a1518;
  --border: rgba(125, 60, 82, 0.25);
  --text-primary: #f5f2f4;
  --text-secondary: #cdbec5;
  --text-muted: #aea2a8;
  --grid: rgba(125, 60, 82, 0.05);
}
```

---

### 3. Simplified Art Deco Styling Language

To emphasize simplicity and avoid extravagance, the visual redesign implements **three primary geometric signatures**:

1.  **Geometric Card Borders:** Replacing modern drop-shadows with thin, single-pixel borders (`var(--border)`) and sharp, flat geometric edges. Hover states reveal a subtle border highlight (`var(--accent)`) and a small geometric transform.
2.  **Symmetrical Diamond Divider:** A clean, horizontal line accented by a central rotated diamond shape for section breaks.
    ```html
    <div class="deco-divider">
      <span class="deco-line"></span>
      <span class="deco-diamond"></span>
      <span class="deco-line"></span>
    </div>
    ```
3.  **Frame Accents:** Subtle, absolute-positioned decorative double-lines or symmetrical corner bracket details on the main page wrapper and personal card, providing a structured Art Deco frame.

---

## Proposed Changes by Component

### Layout (`src/layouts/Base.astro`)
*   Import the new Google Fonts (`Merriweather` & `Raleway`).
*   Inject the default inline JS script to load the theme preference (`light` / `dark`) from `localStorage` or `matchMedia` immediately before rendering, preventing any flash of unstyled content (FOUC).
*   Add a subtle, accessible floating theme toggle button.

### Styling System (`src/styles/`)
*   **`tokens.css`**: Define the updated typography, shared transition values, and the dual-theme color variable sets.
*   **`base.css`**: Apply base `font-family: var(--sans)` to the body, clean up default text styling, and implement base layout grids (using the subtle burgundy grid texture background).
*   **`home.css`**: Apply the new upright `Merriweather` styles to display names and section headers. Style link cards with flat borders, custom geometric frames, and smooth translation animations. Add `.deco-divider` styling.
*   **`projects.css`**: Modernize the filter buttons, category tags, search input, and cards using the new maroon/lavender design system.
*   **`cv.css`**: Harmonize the collapsible sidebar, section labels, and background colors with the "Streamlined Scholar" theme.

---

## Verification Plan

### Automated Build Verification
*   Execute `pnpm build` to verify there are no compilation, Astro component, or bundling errors.

### Manual Layout Inspection
*   Open the dev server (`pnpm dev`) and visually inspect:
    *   **Light/Dark Toggle:** Ensure smooth transitions, absolute storage persistence across tabs, and no text flashing.
    *   **Typographic Uprights:** Verify headings utilize non-italicized bold Merriweather.
    *   **Art Deco Geometry:** Inspect the alignment and rendering of the diamond dividers and custom geometric borders.
    *   **Responsive Viewports:** Verify that frame coordinates adapt cleanly on mobile screen widths (320px to 600px).
