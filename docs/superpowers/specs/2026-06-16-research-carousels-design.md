# Spec: Research Carousels on Research Page

**Date**: 2026-06-16  
**Author**: Antigravity  
**Goal**: Replace the vertical publication lists in the Research tab with two horizontal scrolling carousels: one for papers in which the author played a key role, and one for other contributions.

---

## 1. Project Context & Requirements

*   **Target Pages**: The Research tab on the homepage (`src/pages/index.astro`, which loads `src/components/Publications.astro`).
*   **Aesthetics**: Sleek, border-based layout aligning with the site's Tailwind v4 styling. High-resolution thumbnails generated from PDF first pages.
*   **Fallbacks**: If a publication does not have a thumbnail specified, it will fall back to `/images/icons/article.svg`.

---

## 2. Technical Design

### A. Data Schema Updates

We will add an optional `thumbnail` field to the `pubs` content collection schema.

*   **File**: `src/content.config.ts`
    ```typescript
    // Under pubs collection schema
    thumbnail: z.string().optional()
    ```

*   **Data File**: `content/pubs.yaml`
    Three publications will specify their thumbnails pointing to high-resolution PNGs pre-rendered via Ghostscript:
    ```yaml
    - title: "Order by Scale: Relative-Magnitude Relational Composition in Attention-Only Transformers"
      key-role: true
      thumbnail: "/images/pubs/5_Order_by_Scale_Relative_Magn.png"
      ...
    - title: "Sparse Autoencoders Can Learn Graded Latents for Relational Composition"
      key-role: true
      thumbnail: "/images/pubs/402_Sparse_Autoencoders_Can_Le.png"
      ...
    - title: "Challenges of Evaluating LLM Safety for User Welfare"
      key-role: false
      thumbnail: "/images/pubs/context_evals.png"
    ```

### B. New Components

#### 1. `src/components/ResearchCard.astro`
Renders a single publication as a card.
*   **Structure**:
    *   Outer link `<a>` with hover transitions (`hover:-translate-y-0.5 hover:border-accent`).
    *   Top image thumbnail wrapper (`aspect-[4/3] bg-panel overflow-hidden border-b border-rule flex items-center justify-center`).
        *   Renders dynamic image if `pub.thumbnail` is present: `size-full object-cover object-top`.
        *   Falls back to `/images/icons/article.svg` if absent.
    *   Bottom details container (`p-5 flex flex-col flex-grow`):
        *   Title: `h4 class="font-serif text-base font-bold text-ink mb-2 leading-snug group-hover:text-accent transition duration-200 line-clamp-3"`
        *   Authors: formatted list with the owner's name bolded (`set:html={formatAuthors(pub.authors, owner)}`).
        *   Venue: `p class="font-sans text-[0.65rem] uppercase tracking-wider text-accent-strong mb-4"`.
        *   Action indicator link: external link icon + label (`View paper`).

#### 2. `src/components/ResearchCarousel.astro`
Handles horizontal scrolling, track presentation, and next/prev controls.
*   **Props**:
    *   `papers`: `Pub[]`
    *   `title`: `string`
    *   `id`: `string`
*   **Structure**:
    *   Header: Flex row with the section title and the next/prev buttons on the right.
    *   Buttons: Border-accent/rule navigation buttons using inline SVG arrows.
    *   Track: `<div id={id} class="carousel-track flex gap-5 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory scrollbar-hide">`
    *   Items: `<div class="carousel-item flex-shrink-0 w-72 snap-start">` wrapping each `<ResearchCard>`
*   **Behavior (Inline Script)**:
    *   Listens to scroll events to disable the "Prev" button when at the start (`scrollLeft === 0`), and disable the "Next" button when at the end.
    *   Scrolls by 1 card width (`308px` containing 288px width + 20px gap) per click.

### C. Modified Components

#### `src/components/Publications.astro`
*   Replaces the vertical listing blocks inside `#key-role` and `#other-papers` with the new `<ResearchCarousel>` component.
*   Maintains the parent IDs for scroll-anchor jump navigation.

---

## 3. Verification & Testing

*   **Static Type Check**: Run `pnpm exec astro check` to verify types.
*   **Visual Check**: Build/run local dev server (`pnpm dev`) to verify:
    *   Visual display of thumbnails in dark & light modes.
    *   Responsiveness of the horizontal scrollbar and alignment.
    *   Interactive hover state changes.
    *   Smooth scrolling and proper disabling of navigation buttons at bounds.
    *   Fallback SVG rendering when `thumbnail` is missing.
