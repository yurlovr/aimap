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
    { id: 'transport', label: 'Транспорт и логистика', children: [] },
    { id: 'finance', label: 'Финансы и страхование', children: [] },
    { id: 'retail', label: 'Ритейл и e-commerce', children: [] },
    { id: 'gov', label: 'Государственный сектор', children: [] },
    { id: 'telecom', label: 'Телеком', children: [] },
    { id: 'education', label: 'Образование', children: [] },
    { id: 'healthcare', label: 'Здравоохранение', children: [] },
    { id: 'agriculture', label: 'Сельское и лесное хозяйство', children: [] },
    { id: 'legal', label: 'Право и юридические услуги', children: [] },
    { id: 'hr', label: 'HR и управление персоналом', children: [] },
    { id: 'marketing', label: 'Маркетинг и реклама', children: [] },
    { id: 'media', label: 'Медиа и развлечения', children: [] },
    { id: 'tourism', label: 'Туризм и гостеприимство', children: [] },
  ],
  technology: [
    { id: 'ml', label: 'Машинное обучение', children: [
      { id: 'ml-1', label: 'Компьютерное зрение' },
      { id: 'ml-2', label: 'Обработка естественного языка' },
      { id: 'ml-3', label: 'Рекомендательные системы' },
    ]},
    { id: 'nlp', label: 'Обработка языка', children: [
      { id: 'nlp-1', label: 'Чат-боты' },
      { id: 'nlp-2', label: 'Анализ текста' },
    ]},
    { id: 'cv', label: 'Компьютерное зрение', children: [
      { id: 'cv-1', label: 'Распознавание лиц' },
      { id: 'cv-2', label: 'Детекция объектов' },
    ]},
    { id: 'rpa', label: 'RPA', children: [] },
    { id: 'llm', label: 'Большие языковые модели', children: [] },
    { id: 'data', label: 'Data Science', children: [] },
  ]
};

const state = {
  industry: new Set(),
  technology: new Set(),
};

function initFilter(filterEl, filterKey) {
  const button    = filterEl.querySelector('.filter__button');
  const valueEl   = filterEl.querySelector('.filter__value');
  const clearBtn  = filterEl.querySelector('.filter__clear');
  const listWrap  = filterEl.querySelector('[data-list]');
  const data      = FILTER_DATA[filterKey];

  renderList(listWrap, data);

  button.addEventListener('click', (e) => {
    if (e.target.closest('.filter__clear')) return;
    e.stopPropagation();

    const willOpen = !filterEl.classList.contains('_open');

    document.querySelectorAll('.filter._open').forEach(f => {
      f.classList.remove('_open');
      f.querySelector('.filter__button').setAttribute('aria-expanded', 'false');
    });

    if (willOpen) {
      filterEl.classList.add('_open');
      button.setAttribute('aria-expanded', 'true');
    }
  });

  clearBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    state[filterKey].clear();
    refresh();
  });

  listWrap.addEventListener('click', (e) => {
    const toggleEl = e.target.closest('.filter__option-toggle');
    const optionEl = e.target.closest('.filter__option');
    if (!optionEl) return;

    if (toggleEl && optionEl.contains(toggleEl)) {
      optionEl.classList.toggle('_expanded');
      return;
    }

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
        if (allChildIds.every(cid => state[filterKey].has(cid))) {
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

  refresh();
}

function renderList(container, data) {
  container.innerHTML = '';

  data.forEach(parent => {
    const hasChildren = parent.children && parent.children.length > 0;

    // Родительская опция
    const parentEl = document.createElement('div');
    parentEl.className = 'filter__option';
    parentEl.dataset.id = parent.id;
    parentEl.dataset.isParent = hasChildren ? 'true' : 'false';
    if (hasChildren) parentEl.dataset.children = JSON.stringify(parent.children.map(c => c.id));

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
      const childrenWrap = document.createElement('div');
      childrenWrap.className = 'filter__children';
      childrenWrap.innerHTML = '<div class="filter__children-inner"></div>';
      const inner = childrenWrap.querySelector('.filter__children-inner');

      parent.children.forEach(child => {
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
    document.querySelectorAll('.filter._open').forEach(f => {
      f.classList.remove('_open');
      f.querySelector('.filter__button').setAttribute('aria-expanded', 'false');
    });
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.filter._open').forEach(f => {
      f.classList.remove('_open');
      f.querySelector('.filter__button').setAttribute('aria-expanded', 'false');
    });
  }
});

document.querySelectorAll('.filter').forEach(filterEl => {
  initFilter(filterEl, filterEl.dataset.filter);
});