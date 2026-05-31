import WeatherService from './data/weatherApi.js';
import WelcomeScreen from './ui/welcome.js';
import Header from './ui/header.js';

class App {
  constructor() {
    this.container = document.getElementById('app');
    this.weatherService = new WeatherService();
    this.welcomeScreen = null;
    this.header = null;
    this.userName = '';
  }

  init() {
    this.header = new Header(this.container);
    this.header.onChangeName = () => {
      this.welcomeScreen.render();
    };

    this.welcomeScreen = new WelcomeScreen(this.container, (name) => {
      this.userName = name;
      this.welcomeScreen.hide();
      this.header.render(name);
    });

    this.welcomeScreen.render();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App().init();
});