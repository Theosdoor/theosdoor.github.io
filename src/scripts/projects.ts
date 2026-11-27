import { curatedCompare, moreInEverythingCount, newestCompare, type ProjectsView } from '../utils/projects-view';

export interface FilterState {
  role: string;
  category: string;
  languages: Set<string>;
  tools: Set<string>;
  sort: string;
  view: ProjectsView;
  text: string;
  ais: string;
}

export function initializeProjectsFilter(options: { urlSync: boolean }) {
  const list = document.getElementById('proj-list');
  if (!list) return;

  const allArticles = [...list.querySelectorAll('.proj')];
  const state: FilterState = {
    role: 'all',
    category: 'all',
    languages: new Set<string>(),
    tools: new Set<string>(),
    sort: 'curated',
    view: 'highlights',
    text: '',
    ais: 'all',
  };

  function matches(el: Element) {
    const article = el as HTMLElement;
    const roleOk = state.role === 'all' || article.dataset.role === state.role;
    const catOk = state.category === 'all' || article.dataset.category === state.category;
    const aisOk = state.ais === 'all' || article.dataset.ais === 'true';
    const elLangs = article.dataset.languages ? article.dataset.languages.split(',') : [];
    const elTools = article.dataset.tools ? article.dataset.tools.split(',') : [];
    const langOk = state.languages.size === 0 ||
      [...state.languages].some(l => elLangs.includes(l));
    const toolOk = state.tools.size === 0 ||
      [...state.tools].some(t => elTools.includes(t));
    const q = state.text.toLowerCase();
    const textOk = q === '' ||
      (article.querySelector('.proj-card-title')?.textContent ?? '').toLowerCase().includes(q) ||
      (article.querySelector('.proj-card-desc')?.textContent ?? '').toLowerCase().includes(q);
    return roleOk && catOk && aisOk && langOk && toolOk && textOk;
  }

  // Sortable view of a card, read from its data attributes and title.
  function cardInfo(el: Element) {
    const d = (el as HTMLElement).dataset;
    return {
      highlight: d.highlight ? parseInt(d.highlight, 10) : undefined,
      year: parseInt(d.year || '0', 10) || 0,
      title: el.querySelector('.proj-card-title')?.textContent ?? '',
    };
  }

  function isHighlight(el: Element) {
    return (el as HTMLElement).dataset.highlight !== undefined;
  }

  function makeHeading(text: string) {
    const div = document.createElement('div');
    div.className = 'proj-group-heading col-span-full font-serif text-2xl font-bold text-ink';
    div.dataset.groupType = 'year';
    div.textContent = text;
    return div;
  }

  // Styling follows from aria-pressed via Tailwind's aria-pressed: variants.
  function setActiveStyle(el: Element, active: boolean) {
    el.setAttribute('aria-pressed', String(active));
  }

  function syncToUrl() {
    if (!options.urlSync) return;
    const params = new URLSearchParams();
    if (state.role !== 'all') params.set('role', state.role);
    if (state.category !== 'all') params.set('category', state.category);
    if (state.ais !== 'all') params.set('ais', 'true');
    if (state.languages.size > 0) params.set('lang', [...state.languages].join(','));
    if (state.tools.size > 0) params.set('tool', [...state.tools].join(','));
    if (state.view !== 'highlights') params.set('show', 'all');
    if (state.sort !== 'curated') params.set('sort', state.sort);
    if (state.text) params.set('q', state.text);
    const qs = params.toString();
    history.replaceState(null, '', qs ? '?' + qs : location.pathname);
  }

  function restoreFromUrl() {
    if (!options.urlSync) return;
    const params = new URLSearchParams(location.search);
    state.view = params.get('show') === 'all' ? 'all' : 'highlights';
    syncViewButtons();

    const role = params.get('role') || 'all';
    state.role = role;
    document.querySelectorAll('[data-filter-role]').forEach(b =>
      setActiveStyle(b, (b as HTMLElement).dataset.filterRole === role)
    );

    const category = params.get('category') || 'all';
    state.category = category;
    document.querySelectorAll('[data-filter-category]').forEach(b =>
      setActiveStyle(b, (b as HTMLElement).dataset.filterCategory === category)
    );

    const validLangs = new Set(
      [...document.querySelectorAll('[data-filter-lang]')]
        .map(el => (el as HTMLElement).dataset.filterLang!)
        .filter(v => v !== 'any')
    );
    const lang = params.get('lang');
    if (lang) {
      lang.split(',').filter(l => validLangs.has(l)).forEach(l => state.languages.add(l));
    }
    document.querySelectorAll('[data-filter-lang]').forEach(b => {
      const isAny = (b as HTMLElement).dataset.filterLang === 'any';
      const active = isAny ? state.languages.size === 0 : state.languages.has((b as HTMLElement).dataset.filterLang!);
      setActiveStyle(b, active);
    });

    const validTools = new Set(
      [...document.querySelectorAll('[data-filter-tool]')]
        .map(el => (el as HTMLElement).dataset.filterTool!)
        .filter(v => v !== 'any')
    );
    const tool = params.get('tool');
    if (tool) {
      tool.split(',').filter(t => validTools.has(t)).forEach(t => state.tools.add(t));
    }
    document.querySelectorAll('[data-filter-tool]').forEach(b => {
      const isAny = (b as HTMLElement).dataset.filterTool === 'any';
      const active = isAny ? state.tools.size === 0 : state.tools.has((b as HTMLElement).dataset.filterTool!);
      setActiveStyle(b, active);
    });

    const sort = params.get('sort') === 'newest' ? 'newest' : 'curated';
    state.sort = sort;
    document.querySelectorAll('[data-sort]').forEach(b =>
      setActiveStyle(b, (b as HTMLElement).dataset.sort === sort)
    );

    const ais = params.get('ais') === 'true' ? 'true' : 'all';
    state.ais = ais;
    document.querySelectorAll('[data-filter-ais]').forEach(b =>
      setActiveStyle(b, (b as HTMLElement).dataset.filterAis === ais)
    );

    const q = params.get('q')?.trim();
    if (q) {
      state.text = q;
      const searchInput = document.getElementById('proj-search') as HTMLInputElement | null;
      if (searchInput) searchInput.value = q;
    }
  }

  // Card videos ship without autoplay so reduced-motion visitors get a still
  // first frame; everyone else gets the looping preview.
  const motionOk = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  function playPreviews() {
    if (!motionOk) return;
    list!.querySelectorAll<HTMLVideoElement>('video[data-autoplay]').forEach((video) => {
      video.play().catch(() => {});
    });
  }

  function filterAndRender() {
    syncToUrl();
    list!.querySelectorAll('.proj-group-heading').forEach(h => h.remove());

    const matching = allArticles.filter(matches);
    const visible = matching.filter(el => state.view === 'all' || isHighlight(el));
    const visibleSet = new Set(visible);
    const hidden = allArticles.filter(el => !visibleSet.has(el));
    const fragment = document.createDocumentFragment();

    if (state.sort === 'curated') {
      visible.sort((a, b) => curatedCompare(cardInfo(a), cardInfo(b)));
      visible.forEach(el => {
        (el as HTMLElement).hidden = false;
        fragment.appendChild(el);
      });
    } else {
      visible.sort((a, b) => newestCompare(cardInfo(a), cardInfo(b)));
      let currentYear: string | null = null;
      visible.forEach(el => {
        const year = (el as HTMLElement).dataset.year ?? '0';
        if (year !== currentYear) {
          currentYear = year;
          fragment.appendChild(makeHeading(year === '0' ? '—' : year));
        }
        (el as HTMLElement).hidden = false;
        fragment.appendChild(el);
      });
    }

    hidden.forEach(el => {
      (el as HTMLElement).hidden = true;
      fragment.appendChild(el);
    });

    list!.appendChild(fragment);
    // Re-attaching a card pauses its video, so resume previews after every render
    playPreviews();

    const placeholder = document.getElementById('proj-empty-state');
    if (placeholder) {
      placeholder.classList.toggle('hidden', visible.length > 0);
    }

    list!.dataset.empty = visible.length === 0 ? 'true' : 'false';
    updateFilterIndicator();

    const more = moreInEverythingCount(
      state.view,
      allArticles.map(el => ({ matchesFilters: matching.includes(el), isHighlight: isHighlight(el) })),
    );
    const moreLine = document.getElementById('proj-more');
    const moreBtn = document.getElementById('proj-show-all');
    if (moreLine && moreBtn) {
      moreBtn.textContent = `${more} more in Everything`;
      moreLine.hidden = more === 0;
    }
  }

  function updateFilterIndicator() {
    const btn = document.getElementById('proj-filter-btn');
    const isActive =
      state.role !== 'all' ||
      state.category !== 'all' ||
      state.ais !== 'all' ||
      state.languages.size > 0 ||
      state.tools.size > 0 ||
      state.text !== '';
    
    if (btn) {
      btn.toggleAttribute('data-active', isActive);
    }
  }

  function closeAllDropdowns() {
    document.querySelectorAll('.proj-dropdown').forEach(p => {
      (p as HTMLElement).hidden = true;
    });
    document.querySelectorAll('.proj-filter-btn, .proj-sort-btn')
      .forEach(b => b.setAttribute('aria-expanded', 'false'));
  }

  let lastFocusedBtn: HTMLElement | null = null;

  function setupDropdown(btnId: string, panelId: string) {
    const btn = document.getElementById(btnId);
    const panel = document.getElementById(panelId);
    if (!btn || !panel) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !(panel as HTMLElement).hidden;
      closeAllDropdowns();
      if (!isOpen) {
        lastFocusedBtn = btn;
        (panel as HTMLElement).hidden = false;
        btn.setAttribute('aria-expanded', 'true');
        const firstFocusable = panel.querySelector<HTMLElement>('button, [href], input, [tabindex]:not([tabindex="-1"])');
        firstFocusable?.focus();
      }
    });

    panel.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllDropdowns();
        const btn = lastFocusedBtn;
        lastFocusedBtn = null;
        btn?.focus();
      }
    });
  }

  function isAnyDropdownOpen() {
    return [...document.querySelectorAll('.proj-dropdown')]
      .some(p => !(p as HTMLElement).hidden);
  }

  document.addEventListener('click', () => {
    if (isAnyDropdownOpen()) {
      closeAllDropdowns();
      lastFocusedBtn = null;
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isAnyDropdownOpen()) {
      closeAllDropdowns();
      const btn = lastFocusedBtn;
      lastFocusedBtn = null;
      btn?.focus();
    }
  });

  document.querySelectorAll('.proj-dropdown').forEach(panel => {
    panel.addEventListener('click', (e) => e.stopPropagation());
  });

  setupDropdown('proj-filter-btn', 'proj-filter-panel');
  setupDropdown('proj-sort-btn', 'proj-sort-panel');

  function setupPillGroup(attr: string, stateKey: 'role' | 'category' | 'sort' | 'ais') {
    const datasetKey = attr.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    document.querySelectorAll(`[data-${attr}]`).forEach(btn => {
      btn.addEventListener('click', () => {
        state[stateKey] = (btn as HTMLElement).dataset[datasetKey] as string;
        document.querySelectorAll(`[data-${attr}]`).forEach(b =>
          setActiveStyle(b, b === btn)
        );
        filterAndRender();
      });
    });
  }

  function syncViewButtons() {
    document.querySelectorAll('[data-show]').forEach(b =>
      setActiveStyle(b, (b as HTMLElement).dataset.show === state.view)
    );
  }

  function setView(view: ProjectsView) {
    state.view = view;
    syncViewButtons();
    filterAndRender();
  }

  document.querySelectorAll('[data-show]').forEach(b =>
    b.addEventListener('click', () =>
      setView((b as HTMLElement).dataset.show === 'all' ? 'all' : 'highlights')
    )
  );
  document.getElementById('proj-show-all')?.addEventListener('click', () => setView('all'));

  setupPillGroup('filter-role', 'role');
  setupPillGroup('filter-category', 'category');
  setupPillGroup('filter-ais', 'ais');
  setupPillGroup('sort', 'sort');

  function setupTagGroup(attr: string, stateSet: Set<string>) {
    const datasetKey = attr.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    document.querySelectorAll(`[data-${attr}]`).forEach(btn => {
      btn.addEventListener('click', () => {
        const val = (btn as HTMLElement).dataset[datasetKey] as string;
        if (val === 'any') {
          stateSet.clear();
          document.querySelectorAll(`[data-${attr}]`).forEach(b =>
            setActiveStyle(b, (b as HTMLElement).dataset[datasetKey] === 'any')
          );
        } else {
          if (stateSet.has(val)) {
            stateSet.delete(val);
          } else {
            stateSet.add(val);
          }
          const anyChip = document.querySelector(`[data-${attr}="any"]`);
          if (anyChip) setActiveStyle(anyChip, stateSet.size === 0);
          setActiveStyle(btn, stateSet.has(val));
        }
        filterAndRender();
      });
    });
  }

  setupTagGroup('filter-lang', state.languages);
  setupTagGroup('filter-tool', state.tools);

  const searchInput = document.getElementById('proj-search') as HTMLInputElement | null;
  searchInput?.addEventListener('input', () => {
    state.text = searchInput!.value.trim();
    filterAndRender();
  });

  restoreFromUrl();
  filterAndRender();
}
