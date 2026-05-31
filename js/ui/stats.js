// Блок статистики по сохранённым городам:
// выводит количество городов, среднюю температуру, самый холодный и самый тёплый город.
class Stats {
  /**
   * @param {HTMLElement} container - контейнер для вставки блока.
   */
  constructor(container) {
    this.container = container;
  }

  /**
   * Рассчитывает и отображает статистику.
   * @param {object[]} cities - массив объектов с полями city, temp и др.
   */
  render(cities) {
    this.container.innerHTML = '';

    if (!cities || cities.length === 0) {
      this.container.innerHTML = '<p>Нет данных для статистики.</p>';
      return;
    }

    const count = cities.length;
    const temps = cities.map(c => c.temp);
    const avgTemp = (temps.reduce((sum, t) => sum + t, 0) / count).toFixed(1);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const minCity = cities.find(c => c.temp === minTemp).city;
    const maxCity = cities.find(c => c.temp === maxTemp).city;

    const block = document.createElement('div');
    block.className = 'stats-block';
    block.innerHTML = `
      <h3>Статистика</h3>
      <p>Сохранено городов: ${count}</p>
      <p>Средняя температура: ${avgTemp}°C</p>
      <p>Самый холодный: ${minCity} (${minTemp}°C)</p>
      <p>Самый тёплый: ${maxCity} (${maxTemp}°C)</p>
    `;

    this.container.appendChild(block);
  }

  // Скрывает блок статистики.
  hide() {
    this.container.innerHTML = '';
  }
}

export default Stats;