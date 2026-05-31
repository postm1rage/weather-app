import API_KEY from './config.js';

class WeatherService {
  constructor() {
    this.apiKey = API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
  }

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