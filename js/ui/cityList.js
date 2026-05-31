// Хранит массив сохранённых городов, умеет фильтровать, сортировать и отображать таблицу.
// Сообщает внешнему коду об изменениях через колбэк onUpdate.
class CityList {
  /**
   * @param {HTMLElement} container - DOM-элемент, куда будет рендериться таблица.
   */
  constructor(container) {
    this.container = container;
    this.cities = [];           // исходный массив городов
    this.filteredCities = [];   // массив после применения фильтров и сортировки
    this.sortField = null;      // поле, по которому сортируем
    this.sortDirection = 1;     // 1 – по возрастанию, -1 – по убыванию
    this.filterMin = null;      // минимальная температура для фильтра
    this.filterMax = null;      // максимальная температура для фильтра
    this.onUpdate = null;       // колбэк, вызывается при каждом изменении списка
  }

  /**
   * Добавляет город в список. Если город уже есть, возвращает false и не добавляет.
   * После добавления сбрасывает фильтры и сортировку, чтобы новый город был виден.
   * @param {object} cityData - объект с данными погоды.
   * @returns {boolean} true, если город добавлен, иначе false.
   */
  addCity(cityData) {
    const alreadyExists = this.cities.some(c => c.city === cityData.city);
    if (alreadyExists) {
      return false;
    }
    this.cities.push(cityData);
    this.filterMin = null;
    this.filterMax = null;
    this.sortField = null;
    this.applyFiltersAndSort();
    return true;
  }

  /**
   * Удаляет город из списка по названию.
   * @param {string} name - название города.
   */
  removeCity(name) {
    this.cities = this.cities.filter(c => c.city !== name);
    this.applyFiltersAndSort();
  }

  /**
   * Устанавливает поле сортировки. Повторный вызов меняет направление.
   * @param {string} field - название поля (city, temp, humidity, windSpeed).
   */
  sortBy(field) {
    if (this.sortField === field) {
      this.sortDirection *= -1;
    } else {
      this.sortField = field;
      this.sortDirection = 1;
    }
    this.applyFiltersAndSort();
  }

  /**
   * Задаёт диапазон температуры для фильтрации.
   * @param {number|null} min - нижняя граница (или null).
   * @param {number|null} max - верхняя граница (или null).
   */
  filterByTemp(min, max) {
    this.filterMin = min;
    this.filterMax = max;
    this.applyFiltersAndSort();
  }

  // Применяет активные фильтры и сортировку к копии исходного массива,
  // сохраняет результат в filteredCities и перерисовывает таблицу.
  applyFiltersAndSort() {
    let result = [...this.cities];

    if (this.filterMin !== null && this.filterMin !== '') {
      result = result.filter(c => c.temp >= Number(this.filterMin));
    }
    if (this.filterMax !== null && this.filterMax !== '') {
      result = result.filter(c => c.temp <= Number(this.filterMax));
    }

    if (this.sortField) {
      result.sort((a, b) => {
        const aVal = a[this.sortField];
        const bVal = b[this.sortField];
        if (typeof aVal === 'string') {
          return this.sortDirection * aVal.localeCompare(bVal);
        }
        return this.sortDirection * (aVal - bVal);
      });
    }

    this.filteredCities = result;
    this.render();
    if (this.onUpdate) {
      this.onUpdate(this.filteredCities);
    }
  }

  // Строит HTML-таблицу на основе filteredCities.
  // Если список пуст, выводит сообщение.
  render() {
    this.container.innerHTML = '';

    if (this.filteredCities.length === 0) {
      this.container.innerHTML = '<p>Сохранённых городов нет или они не найдены.</p>';
      return;
    }

    const table = document.createElement('table');
    table.className = 'city-table';

    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>Город</th>
        <th>Температура</th>
        <th>Влажность</th>
        <th>Ветер</th>
        <th></th>
      </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    this.filteredCities.forEach(city => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${city.city}</td>
        <td>${city.temp}°C</td>
        <td>${city.humidity}%</td>
        <td>${city.windSpeed} м/с</td>
        <td><button class="btn-remove" data-city="${city.city}">Удалить</button></td>
      `;
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    this.container.appendChild(table);

    this.container.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.city;
        this.removeCity(name);
      });
    });
  }

  // Очищает контейнер (используется при смене экранов).
  hide() {
    this.container.innerHTML = '';
  }

  // Принудительно обновляет отображение.
  show() {
    this.render();
  }
}

export default CityList;