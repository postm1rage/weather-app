import API_KEY from '../config.js';

// Отвечает за общение с OpenWeatherMap API.
// Формирует URL, выполняет fetch, обрабатывает ошибки сети и HTTP,
// приводит сырой ответ API к простому объекту с нужными полями.
class WeatherService {
  constructor() {
    // Ключ импортируется из внешнего конфига, чтобы не хранить в репозитории
    this.apiKey = API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
  }

  /**
   * Запрашивает текущую погоду для указанного города.
   * @param {string} city - Название города (например, "Moscow").
   * @returns {Promise<object>} Объект с полями city, temp, feelsLike, humidity, windSpeed, description, icon.
   * @throws {Error} При проблемах сети или если город не найден.
   */
  async getWeather(city) {
    const params = new URLSearchParams({
      q: city,
      appid: this.apiKey,
      units: 'metric',
      lang: 'ru'
    });

    const url = `${this.baseUrl}?${params}`;

    let response;
    try {
      response = await fetch(url);
    } catch {
      throw new Error('Ошибка сети. Проверьте подключение.');
    }

    if (!response.ok) {
      throw new Error(`Город "${city}" не найден или проблема с API.`);
    }

    const data = await response.json();

    return {
      city: data.name,
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed),
      description: data.weather[0].description,
      icon: data.weather[0].icon
    };
  }
}

export default WeatherService;