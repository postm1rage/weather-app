class WeatherService {
  constructor() {
    this.apiKey = 'YOUR_API_KEY';
    this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
  }

  async getWeather(city) {
    throw new Error('Not implemented');
  }
}

export default WeatherService;