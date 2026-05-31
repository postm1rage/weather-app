// Панель управления: выпадающий список сортировки и два поля для фильтра по температуре.
// Принимает колбэки для оповещения внешнего кода об изменении сортировки и фильтра.
class ControlsPanel {
  /**
   * @param {HTMLElement} container - контейнер для вставки панели.
   * @param {function} onSortChange - будет вызвана с названием поля сортировки (или пустой строкой).
   * @param {function} onFilterChange - будет вызвана с параметрами (min, max).
   */
  constructor(container, onSortChange, onFilterChange) {
    this.container = container;
    this.onSortChange = onSortChange;
    this.onFilterChange = onFilterChange;
  }

  // Создаёт DOM-элементы панели и навешивает обработчики.
  render() {
    this.container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'controls';

    const sortLabel = document.createElement('label');
    sortLabel.textContent = 'Сортировать по:';
    const sortSelect = document.createElement('select');
    sortSelect.innerHTML = `
      <option value="">Без сортировки</option>
      <option value="city">Город</option>
      <option value="temp">Температура</option>
      <option value="humidity">Влажность</option>
      <option value="windSpeed">Ветер</option>
    `;
    sortSelect.addEventListener('change', () => {
      this.onSortChange(sortSelect.value);
    });

    const filterGroup = document.createElement('span');
    filterGroup.className = 'filter-group';

    const filterLabel = document.createElement('label');
    filterLabel.textContent = 'Температура от';
    const filterMin = document.createElement('input');
    filterMin.type = 'number';
    filterMin.placeholder = 'Мин';
    const filterMaxLabel = document.createElement('span');
    filterMaxLabel.textContent = 'до';
    filterMaxLabel.style.margin = '0 4px';
    const filterMax = document.createElement('input');
    filterMax.type = 'number';
    filterMax.placeholder = 'Макс';

    filterGroup.append(filterLabel, filterMin, filterMaxLabel, filterMax);

    const applyFilter = () => {
      const min = filterMin.value !== '' ? Number(filterMin.value) : null;
      const max = filterMax.value !== '' ? Number(filterMax.value) : null;
      this.onFilterChange(min, max);
    };

    filterMin.addEventListener('keyup', applyFilter);
    filterMax.addEventListener('keyup', applyFilter);

    wrapper.append(sortLabel, sortSelect, filterGroup);
    this.container.appendChild(wrapper);
  }

  // Сбрасывает поля ввода фильтра (очищает значения).
  // Вызывается внешним кодом, например, после сохранения города.
  resetFilter() {
    const filterMin = this.container.querySelector('input[placeholder="Мин"]');
    const filterMax = this.container.querySelector('input[placeholder="Макс"]');
    if (filterMin) filterMin.value = '';
    if (filterMax) filterMax.value = '';
  }
}

export default ControlsPanel;