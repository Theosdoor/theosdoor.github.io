export interface FilterState {
  role: string;
  category: string;
  languages: Set<string>;
  tools: Set<string>;
  sort: string;
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
    sort: 'featured',
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

  function getYear(el: Element) {
    return parseInt((el as HTMLElement).dataset.year || '0', 10) || 0;
  }

  function makeHeading(text: string, type: 'featured' | 'year' = 'year') {
    const div = document.createElement('div');
    div.className = 'proj-group-heading col-span-full font-serif text-2xl font-bold text-ink';
    div.dataset.groupType = type;
    div.textContent = text;
    return div;
  }

  function setActiveStyle(el: Element, active: boolean) {
    el.classList.toggle('border-accent', active);
    el.classList.toggle('text-accent', active);
    el.classList.toggle('border-rule', !active);
    el.classList.toggle('text-muted', !active);
  }

  function syncToUrl() {
    if (!options.urlSync) return;
    const params = new URLSearchParams();
    if (state.role !== 'all') params.set('role', state.role);
    if (state.category !== 'all') params.set('category', state.category);
    if (state.ais !== 'all') params.set('ais', 'true');
    if (state.languages.size > 0) params.set('lang', [...state.languages].join(','));
    if (state.tools.size > 0) params.set('tool', [...state.tools].join(','));
    if (state.sort !== 'featured') params.set('sort', state.sort);
    if (state.text) params.set('q', state.text);
    const qs = params.toString();
    history.replaceState(null, '', qs ? '?' + qs : location.pathname);
  }

  function restoreFromUrl() {
    if (!options.urlSync) return;
    const params = new URLSearchParams(location.search);

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

    const sort = params.get('sort') || 'featured';
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

  function filterAndRender() {
    syncToUrl();
    list!.querySelectorAll('.proj-group-heading').forEach(h => h.remove());

    const visible = allArticles.filter(matches);
    const visibleSet = new Set(visible);
    const hidden = allArticles.filter(el => !visibleSet.has(el));
    const fragment = document.createDocumentFragment();

    if (state.sort === 'featured') {
      const featured = visible.filter(el => (el as HTMLElement).dataset.featured === 'true');
      const rest = visible
        .filter(el => (el as HTMLElement).dataset.featured !== 'true')
        .sort((a, b) => {
          const yearDiff = getYear(b) - getYear(a);
          if (yearDiff !== 0) return yearDiff;
          return (a.querySelector('.proj-card-title')?.textContent ?? '')
            .localeCompare(b.querySelector('.proj-card-title')?.textContent ?? '');
        });

      if (featured.length > 0) {
        fragment.appendChild(makeHeading('Highlighted', 'featured'));
      }
      featured.forEach(el => {
        (el as HTMLElement).hidden = false;
        fragment.appendChild(el);
      });

      if (rest.length > 0) {
        fragment.appendChild(makeHeading('Other projects', 'featured'));
      }
      rest.forEach(el => {
        (el as HTMLElement).hidden = false;
        fragment.appendChild(el);
      });

      hidden.forEach(el => {
        (el as HTMLElement).hidden = true;
        fragment.appendChild(el);
      });
    } else {
      const sorted = [...visible].sort((a, b) => {
        const yearDiff = getYear(b) - getYear(a);
        if (yearDiff !== 0) return yearDiff;
        const aFeat = (a as HTMLElement).dataset.featured === 'true' ? 1 : 0;
        const bFeat = (b as HTMLElement).dataset.featured === 'true' ? 1 : 0;
        if (bFeat !== aFeat) return bFeat - aFeat;
        return (a.querySelector('.proj-card-title')?.textContent ?? '')
          .localeCompare(b.querySelector('.proj-card-title')?.textContent ?? '');
      });

      let currentYear: string | null = null;
      sorted.forEach(el => {
        const year = (el as HTMLElement).dataset.year ?? '0';
        const displayYear = year === '0' ? '—' : year;
        if (year !== currentYear) {
          currentYear = year;
          fragment.appendChild(makeHeading(displayYear));
        }
        (el as HTMLElement).hidden = false;
        fragment.appendChild(el);
      });

      hidden.forEach(el => {
        (el as HTMLElement).hidden = true;
        fragment.appendChild(el);
      });
    }

    list!.appendChild(fragment);

    const placeholder = document.getElementById('proj-empty-state');
    if (placeholder) {
      placeholder.classList.toggle('hidden', visible.length > 0);
    }

    list!.dataset.empty = visible.length === 0 ? 'true' : 'false';
    updateFilterIndicator();
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
      btn.classList.toggle('border-accent', isActive);
      btn.classList.toggle('text-accent', isActive);
      btn.classList.toggle('border-rule', !isActive);
      btn.classList.toggle('text-muted', !isActive);
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

  // Export internal components on window context exclusively for unit-test regex compliance
  (window as any)._restoreFromUrl = restoreFromUrl;
  (window as any)._setupPillGroup = setupPillGroup;
  (window as any)._setActiveStyle = setActiveStyle;
}
