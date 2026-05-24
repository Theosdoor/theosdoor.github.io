# Projects: venue + ais fields — Design Spec

**Date:** 2026-04-13

## Overview

Add two optional fields to the projects data model: `venue` (a free-text publication/event string) and `ais` (a boolean marking AI safety projects). Both surface on project cards; `ais` also adds a filter.

---

## Data layer

New optional fields in `content/projects.yaml` and the `Project` TypeScript interface in `src/components/Projects.astro`:

```yaml
venue: "NeurIPS 2025 Responsible FM Workshop"  # optional string
ais: true                                       # optional bool, omitted = false
```

Interface additions:
```ts
venue?: string;
ais?: boolean;
```

---

## Card layout

Cards render in this order when fields are present:

```
[ AI Safety ]          ← .proj-ais-badge, only if ais: true
Project Title          ← h3.proj-card-title (unchanged)
NeurIPS 2025 …         ← p.proj-card-venue, only if venue set
Description text…      ← p.proj-card-desc (unchanged)
[ lead ] [ research ]  ← .proj-chips (unchanged)
[ Python ] [ PyTorch ] ← .proj-tags (unchanged)
```

### AI Safety badge

- Element: `<span class="proj-ais-badge">AI Safety</span>`
- Positioned above the `<h3>` title in `.proj-card-body`
- Styled using new CSS token `--aisafety` (to be added to `src/styles/tokens.css`)
- Color should be visually distinct from `--copper`; a muted blue-green in the same low-saturation family as the existing palette

### Venue line

- Element: `<p class="proj-card-venue">{p.venue}</p>`
- Positioned between the title and the description
- Muted small text (e.g., `var(--text-muted)`, `font-size` slightly smaller than body)

---

## Filter panel

New "Focus" section added at the bottom of `#proj-filter-panel`, single-select pills matching the Role/Category pattern:

```html
<div class="proj-filter-section">
  <span class="proj-filter-label">Focus</span>
  <div class="proj-pills">
    <button class="proj-pill proj-pill--active" data-filter-ais="all">All</button>
    <button class="proj-pill" data-filter-ais="true">AI Safety</button>
  </div>
</div>
```

### State

- New `state.ais` field: `'all' | 'true'`, default `'all'`
- `matches()` updated: `const aisOk = state.ais === 'all' || article.dataset.ais === 'true';`
- `updateFilterIndicator()` updated to include `state.ais !== 'all'`

### Data attribute on cards

```html
data-ais={p.ais ? 'true' : 'false'}
```

### URL sync

- `syncToUrl()`: if `state.ais !== 'all'` → `params.set('ais', 'true')`
- `restoreFromUrl()`: if `params.get('ais') === 'true'` → restore pill active state

### `setupPillGroup` wiring

The existing `setupPillGroup` signature restricts `stateKey` to `'role' | 'category' | 'sort'`. Add `'ais'` to that union:

```ts
function setupPillGroup(attr: string, stateKey: 'role' | 'category' | 'sort' | 'ais') {
```

Then wire up:

```ts
setupPillGroup('filter-ais', 'ais');
```

---

## CSS additions

In `src/styles/tokens.css`:
```css
--aisafety: #3d7a6b;  /* muted teal, distinct from --copper */
```

In `src/styles/projects.css`:
```css
.proj-ais-badge { /* pill style using --aisafety */ }
.proj-card-venue { /* muted small text */ }
```

---

## Files changed

| File | Change |
|------|--------|
| `content/projects.yaml` | Add `venue` / `ais` fields to relevant projects |
| `src/components/Projects.astro` | Interface, card markup, filter section, JS state/filter/URL |
| `src/styles/tokens.css` | Add `--aisafety` token |
| `src/styles/projects.css` | Add `.proj-ais-badge`, `.proj-card-venue` styles |
