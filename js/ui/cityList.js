class CityList {
  constructor(container) {
    this.container = container;
    this.cities = [];
  }

  addCity(cityData) {
    this.cities.push(cityData);
  }

  removeCity(name) {
    this.cities = this.cities.filter(c => c.city !== name);
  }

  sortBy(field) {
    // позже
  }

  filterByTemp(min, max) {
    // позже
  }

  render() {
    this.container.innerHTML = '';

    if (this.cities.length === 0) {
      this.container.innerHTML = '<p>Сохранённых городов пока нет.</p>';
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
    this.cities.forEach(city => {
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
        this.render();
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