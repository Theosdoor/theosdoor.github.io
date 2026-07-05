export interface SkillsFilterState {
  text: string;
  ais: boolean;
  sort: 'rating' | 'alphabetical';
}

export function initializeSkillsFilter() {
  const container = document.getElementById('skills-container');
  if (!container) return;

  const cards = [...container.querySelectorAll('.skill-card')] as HTMLElement[];
  const state: SkillsFilterState = {
    text: '',
    ais: false,
    sort: 'rating',
  };

  const searchInput = document.getElementById('skills-search') as HTMLInputElement | null;
  const aisToggle = document.getElementById('skills-ais-toggle') as HTMLInputElement | null;
  const sortBtn = document.getElementById('skills-sort-btn') as HTMLButtonElement | null;
  const emptyState = document.getElementById('skills-empty-state');

  function matches(card: HTMLElement) {
    // 1. AI Safety Toggle Filter
    if (state.ais && card.dataset.ais !== 'true') {
      return false;
    }

    // 2. Search Text Filter
    const q = state.text.toLowerCase().trim();
    if (q !== '') {
      const name = (card.dataset.name ?? '').toLowerCase();
      const tags = (card.dataset.tags ?? '').toLowerCase().split(',');
      const matchName = name.includes(q);
      const matchTags = tags.some(tag => tag.includes(q));
      return matchName || matchTags;
    }

    return true;
  }

  function filterAndRender() {
    const visibleCards = cards.filter(matches);
    const hiddenCards = cards.filter(c => !visibleCards.includes(c));

    // Sort visible cards
    visibleCards.sort((a, b) => {
      if (state.sort === 'rating') {
        const rA = parseInt(a.dataset.rating ?? '0', 10);
        const rB = parseInt(b.dataset.rating ?? '0', 10);
        if (rB !== rA) return rB - rA; // Descending rating
      }
      const nA = (a.dataset.name ?? '').toLowerCase();
      const nB = (b.dataset.name ?? '').toLowerCase();
      return nA.localeCompare(nB); // Ascending alphabetical name
    });

    // Batch DOM updates with a document fragment
    const fragment = document.createDocumentFragment();
    
    if (emptyState) {
      emptyState.classList.toggle('hidden', visibleCards.length > 0);
      fragment.appendChild(emptyState);
    }

    visibleCards.forEach(card => {
      card.hidden = false;
      card.style.display = '';
      fragment.appendChild(card);
    });

    hiddenCards.forEach(card => {
      card.hidden = true;
      card.style.display = 'none';
      fragment.appendChild(card);
    });

    container.appendChild(fragment);
  }

  // Restore state from URL search params if present
  function restoreFromUrl() {
    const params = new URLSearchParams(location.search);
    
    // AI Safety Toggle
    if (params.get('ais') === 'true') {
      state.ais = true;
      if (aisToggle) {
        aisToggle.checked = true;
        aisToggle.closest('label')?.classList.add('bg-accent');
      }
      container.classList.add('show-ais-glow');
    }

    // Sort value
    const sortVal = params.get('sort');
    if (sortVal === 'alphabetical' || sortVal === 'rating') {
      state.sort = sortVal as 'rating' | 'alphabetical';
    }
    updateSortButtonUI();

    // Search query
    const q = params.get('q')?.trim();
    if (q) {
      state.text = q;
      if (searchInput) searchInput.value = q;
    }
  }

  // Sync state to URL search params
  function syncToUrl() {
    const params = new URLSearchParams();
    if (state.ais) params.set('ais', 'true');
    if (state.sort !== 'rating') params.set('sort', state.sort);
    if (state.text) params.set('q', state.text);
    
    const qs = params.toString();
    const newUrl = qs ? '?' + qs : location.pathname;
    history.replaceState(null, '', newUrl);
  }

  function updateSortButtonUI() {
    if (sortBtn) {
      sortBtn.dataset.sort = state.sort;
      const ratingIcon = sortBtn.querySelector('.sort-icon-rating');
      const alphaIcon = sortBtn.querySelector('.sort-icon-alpha');
      if (ratingIcon && alphaIcon) {
        if (state.sort === 'rating') {
          ratingIcon.classList.remove('hidden');
          ratingIcon.classList.add('flex');
          alphaIcon.classList.remove('flex');
          alphaIcon.classList.add('hidden');
        } else {
          ratingIcon.classList.remove('flex');
          ratingIcon.classList.add('hidden');
          alphaIcon.classList.remove('hidden');
          alphaIcon.classList.add('flex');
        }
      }
    }
  }

  // Event Listeners
  searchInput?.addEventListener('input', () => {
    state.text = searchInput.value;
    syncToUrl();
    filterAndRender();
  });

  aisToggle?.addEventListener('change', () => {
    state.ais = aisToggle.checked;
    
    if (state.ais) {
      aisToggle.closest('label')?.classList.add('bg-accent');
      container.classList.add('show-ais-glow');
    } else {
      aisToggle.closest('label')?.classList.remove('bg-accent');
      container.classList.remove('show-ais-glow');
    }

    syncToUrl();
    filterAndRender();
  });

  sortBtn?.addEventListener('click', () => {
    state.sort = state.sort === 'rating' ? 'alphabetical' : 'rating';
    updateSortButtonUI();
    syncToUrl();
    filterAndRender();
  });

  // Debug Tags Toggle logic
  const debugToggle = document.getElementById('skills-debug-tags') as HTMLInputElement | null;
  const debugContainer = document.getElementById('skills-debug-container');

  const isDev = window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1' || 
                new URLSearchParams(window.location.search).has('debug');

  if (isDev && debugContainer) {
    debugContainer.classList.remove('hidden');
    debugContainer.classList.add('flex'); // Add flex layout
  }

  debugToggle?.addEventListener('change', () => {
    if (debugToggle.checked) {
      container.classList.add('show-tags');
    } else {
      container.classList.remove('show-tags');
    }
  });

  // Init
  restoreFromUrl();
  filterAndRender();
}
