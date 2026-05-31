import WeatherService from './data/weatherApi.js';
import WelcomeScreen from './ui/welcome.js';
import Header from './ui/header.js';
import WeatherCard from './ui/weatherCard.js';
import CityList from './ui/cityList.js';
import Stats from './ui/stats.js';

class App {
  constructor() {
    this.weatherService = new WeatherService();
    this.welcomeScreen = null;
    this.header = null;
    this.weatherCard = null;
    this.cityList = null;
    this.stats = null;
    this.userName = '';
  }

  init() {
    throw new Error('Not implemented');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App().init();
});