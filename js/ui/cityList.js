class CityList {
  constructor(container) {
    this.container = container;
    this.cities = [];
    this.filteredCities = [];
    this.sortField = null;
    this.sortDirection = 1;
    this.filterMin = null;
    this.filterMax = null;
    this.onUpdate = null;
  }

  addCity(cityData) {
    const alreadyExists = this.cities.some(c => c.city === cityData.city);
    if (alreadyExists) {
      return false;
    }
    this.cities.push(cityData);
    // Сбрасываем фильтры и сортировку, чтобы новый город был виден
    this.filterMin = null;
    this.filterMax = null;
    this.sortField = null;
    this.applyFiltersAndSort();
    return true;
  }

  removeCity(name) {
    this.cities = this.cities.filter(c => c.city !== name);
    this.applyFiltersAndSort();
  }

  sortBy(field) {
    if (this.sortField === field) {
      this.sortDirection *= -1;
    } else {
      this.sortField = field;
      this.sortDirection = 1;
    }
    this.applyFiltersAndSort();
  }

  filterByTemp(min, max) {
    this.filterMin = min;
    this.filterMax = max;
    this.applyFiltersAndSort();
  }

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

  hide() {
    this.container.innerHTML = '';
  }

  show() {
    this.render();
  }
}

export default CityList;