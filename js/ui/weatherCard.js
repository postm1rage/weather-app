// Карточка погоды для одного города: название, иконка, температура, описание, детали.
class WeatherCard {
  /**
   * @param {HTMLElement} container - куда будет вставлена карточка.
   */
  constructor(container) {
    this.container = container;
  }

  /**
   * Отрисовывает карточку с данными о погоде.
   * @param {object} data - объект с полями city, temp, feelsLike, humidity, windSpeed, description, icon.
   */
  render(data) {
    this.clear();

    const card = document.createElement('div');
    card.className = 'weather-card';

    const cityName = document.createElement('h2');
    cityName.textContent = data.city;

    const icon = document.createElement('img');
    icon.src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
    icon.alt = data.description;
    icon.className = 'weather-icon';

    const temp = document.createElement('p');
    temp.className = 'temp';
    temp.textContent = `${data.temp}°C`;

    const description = document.createElement('p');
    description.className = 'description';
    description.textContent = data.description;

    const details = document.createElement('div');
    details.className = 'details';
    details.innerHTML = `
      <p>Ощущается как: ${data.feelsLike}°C</p>
      <p>Влажность: ${data.humidity}%</p>
      <p>Ветер: ${data.windSpeed} м/с</p>
    `;

    card.append(cityName, icon, temp, description, details);
    this.container.appendChild(card);
  }

  // Очищает контейнер (например, перед показом нового города или при ошибке).
  clear() {
    this.container.innerHTML = '';
  }
}

export default WeatherCard;