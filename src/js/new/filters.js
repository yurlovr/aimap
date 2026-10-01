const FILTER_DATA = {
  industry: [
    { id: 'manufacturing', label: 'Промышленность и производство', children: [
      { id: 'manufacturing-1', label: 'Машиностроение' },
      { id: 'manufacturing-2', label: 'Металлургия' },
      { id: 'manufacturing-3', label: 'Химическая промышленность' },
      { id: 'manufacturing-4', label: 'Робототехника' },
    ]},
    { id: 'energy', label: 'Энергетика и ЖКХ', children: [
      { id: 'energy-1', label: 'Электроэнергетика' },
      { id: 'energy-2', label: 'Теплоэнергетика' },
      { id: 'energy-3', label: 'Водоснабжение' },
    ]},
    { id: 'construction', label: 'Строительство и недвижимость', children: [
      { id: 'construction-1', label: 'Жилое строительство' },
      { id: 'construction-2', label: 'Коммерческая недвижимость' },
      { id: 'construction-3', label: 'Проектирование' },
    ]},
    { id: 'transport', label: 'Транспорт и логистика' },
    { id: 'finance', label: 'Финансы и страхование'},
    { id: 'retail', label: 'Ритейл и e-commerce' },
    { id: 'gov', label: 'Государственный сектор' },
    { id: 'telecom', label: 'Телеком' },
    { id: 'education', label: 'Образование' },
    { id: 'healthcare', label: 'Здравоохранение' },
    { id: 'agriculture', label: 'Сельское и лесное хозяйство' },
    { id: 'legal', label: 'Право и юридические услуги' },
    { id: 'hr', label: 'HR и управление персоналом' },
    { id: 'marketing', label: 'Маркетинг и реклама' },
    { id: 'media', label: 'Медиа и развлечения' },
    { id: 'tourism', label: 'Туризм и гостеприимство' },
  ],
  technology: [
    { id: 'ml', label: 'Машинное обучение'},
    { id: 'nlp', label: 'Обработка языка'},
    { id: 'cv', label: 'Компьютерное зрение'},
    { id: 'rpa', label: 'RPA'},
    { id: 'llm', label: 'Большие языковые модели'},
    { id: 'data', label: 'Data Science'},
  ]
};

const state = {
  industry: new Set(),
  technology: new Set(),
};

function isParentSelected(parent, selectedSet) {
  if (parent.children && parent.children.length) {
    if (selectedSet.has(parent.id)) return true;
    return parent.children.some(c => selectedSet.has(c.id));
  }
  return selectedSet.has(parent.id);
}

function hasSelectedChild(parentEl, selectedSet) {
  const ids = JSON.parse(parentEl.dataset.children || '[]');
  return ids.some(cid => selectedSet.has(cid));
}

function sortBySelection(items, isSelected) {
  return [...items].sort((a, b) => {
    const aSel = isSelected(a) ? 0 : 1;
    const bSel = isSelected(b) ? 0 : 1;
    return aSel - bSel;
  });
}

function resetScroll(listWrap) {
  if (!listWrap) return;

  const candidates = [
    listWrap,
    listWrap.closest('.filter__list-wrapper'),
    listWrap.closest('.filter__list'),
    listWrap.closest('.filter__dropdown'),
    listWrap.closest('.filter__body'),
  ].filter(Boolean);

  candidates.forEach(el => { el.scrollTop = 0; });

  requestAnimationFrame(() => {
    candidates.forEach(el => { el.scrollTop = 0; });
  });
}

function restoreExpanded(listWrap, expandedIds, selectedSet) {
  if (!expandedIds || expandedIds.size === 0) return;
  listWrap.querySelectorAll('.filter__option').forEach(el => {
    const id = el.dataset.id;
    if (!expandedIds.has(id)) return;
    if (hasSelectedChild(el, selectedSet)) {
      el.classList.add('_expanded');
    }
  });
}

/** Закрывает все открытые фильтры (со сбросом скролла) */
function closeAllFilters() {
  document.querySelectorAll('.filter._open').forEach(f => {
    f.classList.remove('_open');
    f.querySelector('.filter__button').setAttribute('aria-expanded', 'false');

    const lw = f.querySelector('[data-list]');
    if (lw) resetScroll(lw);
  });
}

function initFilter(filterEl, filterKey) {
  const button   = filterEl.querySelector('.filter__button');
  const valueEl  = filterEl.querySelector('.filter__value');
  const clearBtn = filterEl.querySelector('.filter__clear');
  const listWrap = filterEl.querySelector('[data-list]');
  const data     = FILTER_DATA[filterKey];

  renderList(listWrap, data, state[filterKey]);
  refresh();

  button.addEventListener('click', (e) => {
    if (e.target.closest('.filter__clear')) return;
    e.stopPropagation();

    const willOpen = !filterEl.classList.contains('_open');

    document.querySelectorAll('.filter._open').forEach(f => {
      f.classList.remove('_open');
      f.querySelector('.filter__button').setAttribute('aria-expanded', 'false');

      const lw = f.querySelector('[data-list]');
      if (lw) resetScroll(lw);
    });

    if (willOpen) {
      const expandedIds = new Set(
        [...listWrap.querySelectorAll('.filter__option._expanded')]
          .map(el => el.dataset.id)
      );

      renderList(listWrap, data, state[filterKey]);
      restoreExpanded(listWrap, expandedIds, state[filterKey]);
      refresh();

      filterEl.classList.add('_open');
      button.setAttribute('aria-expanded', 'true');

      resetScroll(listWrap);
    }
  });

  clearBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    state[filterKey].clear();

    listWrap.querySelectorAll('.filter__option._expanded')
      .forEach(el => el.classList.remove('_expanded'));

    refresh();
  });

  listWrap.addEventListener('click', (e) => {
    const optionEl = e.target.closest('.filter__option');
    if (!optionEl) return;

    const toggleEl   = e.target.closest('.filter__option-toggle');
    const checkboxEl = e.target.closest('.filter__checkbox');
    const labelEl    = e.target.closest('.filter__option-label');

    if (toggleEl && optionEl.contains(toggleEl)) {
      optionEl.classList.toggle('_expanded');
      return;
    }

    if (!checkboxEl && !labelEl) return;

    const id = optionEl.dataset.id;
    const isParent = optionEl.dataset.isParent === 'true';
    const childrenIds = isParent ? JSON.parse(optionEl.dataset.children || '[]') : [];

    if (isParent && childrenIds.length) {
      const allSelected = childrenIds.every(cid => state[filterKey].has(cid));
      if (allSelected) {
        childrenIds.forEach(cid => state[filterKey].delete(cid));
        state[filterKey].delete(id);
      } else {
        childrenIds.forEach(cid => state[filterKey].add(cid));
        state[filterKey].add(id);
      }
    } else {
      if (state[filterKey].has(id)) {
        state[filterKey].delete(id);
      } else {
        state[filterKey].add(id);
      }

      const parentEl = optionEl.closest('.filter__children')?.previousElementSibling;
      if (parentEl && parentEl.classList.contains('filter__option')) {
        const parentId = parentEl.dataset.id;
        const allChildIds = JSON.parse(parentEl.dataset.children || '[]');
        if (allChildIds.length && allChildIds.every(cid => state[filterKey].has(cid))) {
          state[filterKey].add(parentId);
        } else {
          state[filterKey].delete(parentId);
        }
      }
    }

    refresh();
  });

  function refresh() {
    const selected = state[filterKey];

    listWrap.querySelectorAll('.filter__option').forEach(optEl => {
      const id = optEl.dataset.id;
      const isParent = optEl.dataset.isParent === 'true';
      const childrenIds = isParent ? JSON.parse(optEl.dataset.children || '[]') : [];

      let selectedState = false;
      let indeterminate = false;

      if (isParent && childrenIds.length) {
        const picked = childrenIds.filter(cid => selected.has(cid));
        if (picked.length === childrenIds.length) selectedState = true;
        else if (picked.length > 0) indeterminate = true;

        if (picked.length > 0) {
          optEl.classList.add('_expanded');
        } else {
          optEl.classList.remove('_expanded');
        }
      } else {
        selectedState = selected.has(id);
      }

      optEl.classList.toggle('_selected', selectedState);
      optEl.classList.toggle('_indeterminate', indeterminate);
    });

    const labels = [];
    data.forEach(parent => {
      if (selected.has(parent.id) && (!parent.children || !parent.children.length)) {
        labels.push(parent.label);
      }
      (parent.children || []).forEach(child => {
        if (selected.has(child.id)) labels.push(child.label);
      });
    });

    if (labels.length === 0) {
      data.forEach(parent => {
        if (selected.has(parent.id)) labels.push(parent.label);
      });
    }

    if (labels.length === 0) {
      valueEl.textContent = filterKey === 'industry' ? 'Все отрасли' : 'Все технологии';
      filterEl.classList.remove('_has-selection');
    } else {
      if (labels.length <= 2) {
        valueEl.textContent = labels.join(', ');
      } else {
        valueEl.textContent = labels.slice(0, 2).join(', ') + ` и ещё ${labels.length - 2}`;
      }
      filterEl.classList.add('_has-selection');
    }
  }
}

function renderList(container, data, selectedSet) {
  container.innerHTML = '';

  const sortedParents = sortBySelection(
    data,
    (parent) => isParentSelected(parent, selectedSet)
  );

  sortedParents.forEach(parent => {
    const hasChildren = parent.children && parent.children.length > 0;

    const parentEl = document.createElement('div');
    parentEl.className = 'filter__option';
    parentEl.dataset.id = parent.id;
    parentEl.dataset.isParent = hasChildren ? 'true' : 'false';
    if (hasChildren) {
      parentEl.dataset.children = JSON.stringify(parent.children.map(c => c.id));
    }

    if (hasChildren && parent.children.some(c => selectedSet.has(c.id))) {
      parentEl.classList.add('_expanded');
    }

    parentEl.innerHTML = `
      <span class="filter__checkbox"></span>
      <span class="filter__option-label">${parent.label}</span>
      ${hasChildren ? `
        <span class="filter__option-toggle">
          <svg viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 13.7522L18.1488 7.5L19.5 8.87389L12 16.5L4.5 8.87389L5.85117 7.5L12 13.7522Z"/></svg>
        </span>
      ` : ''}
    `;
    container.appendChild(parentEl);

    if (hasChildren) {
      const sortedChildren = sortBySelection(
        parent.children,
        (child) => selectedSet.has(child.id)
      );

      const childrenWrap = document.createElement('div');
      childrenWrap.className = 'filter__children';
      childrenWrap.innerHTML = '<div class="filter__children-inner"></div>';
      const inner = childrenWrap.querySelector('.filter__children-inner');

      sortedChildren.forEach(child => {
        const childEl = document.createElement('div');
        childEl.className = 'filter__option filter__option--child';
        childEl.dataset.id = child.id;
        childEl.dataset.isParent = 'false';
        childEl.innerHTML = `
          <span class="filter__checkbox"></span>
          <span class="filter__option-label">${child.label}</span>
        `;
        inner.appendChild(childEl);
      });

      container.appendChild(childrenWrap);
    }
  });
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.filter')) {
    closeAllFilters();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAllFilters();
  }
});

document.querySelectorAll('.filter').forEach(filterEl => {
  initFilter(filterEl, filterEl.dataset.filter);
});